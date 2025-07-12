const express = require('express');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { protect, authorize, hasPermission } = require('../middleware/auth');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

const router = express.Router();

// Protect all admin routes
router.use(protect);

// Get all registrations with filtering and pagination
router.get('/registrations', hasPermission('view_registrations'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter
    let filter = {};
    if (status) {
      filter.registrationStatus = status;
    }
    if (search) {
      filter.$or = [
        { registrationNumber: { $regex: search, $options: 'i' } },
        { 'personalData.fullName': { $regex: search, $options: 'i' } },
        { 'personalData.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Student.countDocuments(filter);

    // Get registrations
    const registrations = await Student.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-qrCode');

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pendaftaran'
    });
  }
});

// Get registration by ID
router.get('/registrations/:id', hasPermission('view_registrations'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data'
    });
  }
});

// Update registration status
router.put('/registrations/:id/status', hasPermission('approve_registrations'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['Under Review', 'Approved', 'Rejected', 'Waitlisted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    // Update status and tracking
    student.registrationStatus = status;
    student.tracking.reviewedAt = new Date();
    student.tracking.reviewedBy = req.admin._id;
    if (notes) {
      student.tracking.notes = notes;
    }

    await student.save();

    // Send notifications
    if (process.env.EMAIL_USER) {
      emailService.sendStatusUpdate(student, status, notes);
    }

    if (process.env.TWILIO_ACCOUNT_SID) {
      smsService.sendStatusUpdate(student, status, notes);
    }

    res.json({
      success: true,
      message: 'Status pendaftaran berhasil diperbarui',
      data: {
        registrationNumber: student.registrationNumber,
        status: student.registrationStatus,
        reviewedAt: student.tracking.reviewedAt
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard', hasPermission('view_registrations'), async (req, res) => {
  try {
    const totalRegistrations = await Student.countDocuments();
    const submittedRegistrations = await Student.countDocuments({ registrationStatus: 'Submitted' });
    const underReviewRegistrations = await Student.countDocuments({ registrationStatus: 'Under Review' });
    const approvedRegistrations = await Student.countDocuments({ registrationStatus: 'Approved' });
    const rejectedRegistrations = await Student.countDocuments({ registrationStatus: 'Rejected' });
    const waitlistedRegistrations = await Student.countDocuments({ registrationStatus: 'Waitlisted' });

    // Get recent registrations
    const recentRegistrations = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('registrationNumber personalData.fullName registrationStatus createdAt');

    // Get registrations by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Student.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          total: totalRegistrations,
          submitted: submittedRegistrations,
          underReview: underReviewRegistrations,
          approved: approvedRegistrations,
          rejected: rejectedRegistrations,
          waitlisted: waitlistedRegistrations
        },
        recentRegistrations,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data dashboard'
    });
  }
});

// Export registrations to CSV
router.get('/export/registrations', hasPermission('view_registrations'), async (req, res) => {
  try {
    const { status, format = 'csv' } = req.query;
    
    let filter = {};
    if (status) {
      filter.registrationStatus = status;
    }

    const registrations = await Student.find(filter)
      .select('registrationNumber personalData parentData academicData registrationStatus createdAt');

    if (format === 'csv') {
      const csvHeader = 'Nomor Pendaftaran,Nama Lengkap,Email,Telepon,Jenis Kelamin,Tanggal Lahir,Nama Ayah,Nama Ibu,Sekolah Sebelumnya,Status,Tanggal Daftar\n';
      
      const csvData = registrations.map(student => {
        return [
          student.registrationNumber,
          student.personalData.fullName,
          student.personalData.email,
          student.personalData.phoneNumber,
          student.personalData.gender,
          student.personalData.birthDate.toISOString().split('T')[0],
          student.parentData.father.name,
          student.parentData.mother.name,
          student.academicData.previousSchool.name,
          student.registrationStatus,
          student.createdAt.toISOString().split('T')[0]
        ].join(',');
      }).join('\n');

      const csv = csvHeader + csvData;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=registrations-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: registrations
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat export data'
    });
  }
});

// Send reminder to incomplete registrations
router.post('/send-reminders', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const incompleteRegistrations = await Student.find({
      registrationStatus: 'Draft',
      createdAt: { $lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } // 3 days old
    });

    let successCount = 0;
    let errorCount = 0;

    for (const student of incompleteRegistrations) {
      try {
        if (process.env.TWILIO_ACCOUNT_SID) {
          await smsService.sendReminder(student);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to send reminder to ${student.registrationNumber}:`, error);
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Reminder berhasil dikirim ke ${successCount} pendaftar`,
      data: {
        total: incompleteRegistrations.length,
        success: successCount,
        error: errorCount
      }
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengirim reminder'
    });
  }
});

// Get admin list (super admin only)
router.get('/admins', authorize('super_admin'), async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    
    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data admin'
    });
  }
});

// Create new admin (super admin only)
router.post('/admins', authorize('super_admin'), async (req, res) => {
  try {
    const { username, email, password, fullName, role, permissions } = req.body;

    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Username atau email sudah digunakan'
      });
    }

    const admin = new Admin({
      username,
      email,
      password,
      fullName,
      role,
      permissions
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin berhasil dibuat',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat admin'
    });
  }
});

module.exports = router; 