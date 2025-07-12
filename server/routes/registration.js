const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { uploadDocuments } = require('../middleware/upload');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const QRCode = require('qrcode');

const router = express.Router();

// Validation rules
const personalDataValidation = [
  body('personalData.fullName').notEmpty().withMessage('Nama lengkap wajib diisi'),
  body('personalData.gender').isIn(['Laki-laki', 'Perempuan']).withMessage('Jenis kelamin tidak valid'),
  body('personalData.birthPlace').notEmpty().withMessage('Tempat lahir wajib diisi'),
  body('personalData.birthDate').isISO8601().withMessage('Tanggal lahir tidak valid'),
  body('personalData.address.street').notEmpty().withMessage('Alamat wajib diisi'),
  body('personalData.address.city').notEmpty().withMessage('Kota wajib diisi'),
  body('personalData.phoneNumber').notEmpty().withMessage('Nomor telepon wajib diisi'),
  body('personalData.email').isEmail().withMessage('Email tidak valid')
];

const parentDataValidation = [
  body('parentData.father.name').notEmpty().withMessage('Nama ayah wajib diisi'),
  body('parentData.mother.name').notEmpty().withMessage('Nama ibu wajib diisi')
];

const academicDataValidation = [
  body('academicData.previousSchool.name').notEmpty().withMessage('Nama sekolah sebelumnya wajib diisi'),
  body('academicData.lastGrade').notEmpty().withMessage('Nilai terakhir wajib diisi')
];

// Create new registration (step 1: personal data)
router.post('/personal-data', personalDataValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ 'personalData.email': req.body.personalData.email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    const student = new Student({
      personalData: req.body.personalData
    });

    await student.save();

    // Generate QR Code
    const qrData = student.generateQRCode();
    const qrCode = await QRCode.toDataURL(qrData);
    student.qrCode = qrCode;
    await student.save();

    // Send confirmation email
    if (process.env.EMAIL_USER) {
      emailService.sendRegistrationConfirmation(student);
    }

    // Send confirmation SMS
    if (process.env.TWILIO_ACCOUNT_SID) {
      smsService.sendRegistrationConfirmation(student);
    }

    res.status(201).json({
      success: true,
      message: 'Data pribadi berhasil disimpan',
      data: {
        registrationNumber: student.registrationNumber,
        qrCode: student.qrCode
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data'
    });
  }
});

// Update parent data (step 2)
router.put('/:registrationNumber/parent-data', parentDataValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    student.parentData = req.body.parentData;
    await student.save();

    res.json({
      success: true,
      message: 'Data orang tua berhasil diperbarui',
      data: student
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data'
    });
  }
});

// Update academic data (step 3)
router.put('/:registrationNumber/academic-data', academicDataValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    student.academicData = req.body.academicData;
    await student.save();

    res.json({
      success: true,
      message: 'Data akademik berhasil diperbarui',
      data: student
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data'
    });
  }
});

// Upload documents (step 4)
router.post('/:registrationNumber/documents', uploadDocuments, async (req, res) => {
  try {
    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    // Process uploaded files
    const files = req.files;
    const documentTypes = ['birthCertificate', 'familyCard', 'previousDiploma', 'photo', 'healthCertificate'];

    documentTypes.forEach(type => {
      if (files[type] && files[type][0]) {
        const file = files[type][0];
        student.documents[type] = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          uploadedAt: new Date()
        };
      }
    });

    await student.save();

    res.json({
      success: true,
      message: 'Dokumen berhasil diupload',
      data: {
        uploadedDocuments: Object.keys(files || {}),
        totalDocuments: documentTypes.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat upload dokumen'
    });
  }
});

// Submit registration (final step)
router.post('/:registrationNumber/submit', async (req, res) => {
  try {
    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    // Check if all required data is complete
    const requiredDocuments = ['birthCertificate', 'familyCard', 'previousDiploma', 'photo'];
    const missingDocuments = requiredDocuments.filter(doc => !student.documents[doc]);

    if (missingDocuments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Dokumen persyaratan belum lengkap',
        missingDocuments
      });
    }

    // Update status to submitted
    student.registrationStatus = 'Submitted';
    student.tracking.submittedAt = new Date();
    await student.save();

    // Send status update notifications
    if (process.env.EMAIL_USER) {
      emailService.sendStatusUpdate(student, 'Submitted');
    }

    if (process.env.TWILIO_ACCOUNT_SID) {
      smsService.sendStatusUpdate(student, 'Submitted');
    }

    res.json({
      success: true,
      message: 'Pendaftaran berhasil disubmit',
      data: {
        registrationNumber: student.registrationNumber,
        status: student.registrationStatus,
        submittedAt: student.tracking.submittedAt
      }
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat submit pendaftaran'
    });
  }
});

// Get registration by number
router.get('/:registrationNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
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

// Update registration (for editing)
router.put('/:registrationNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    // Only allow updates if status is Draft
    if (student.registrationStatus !== 'Draft') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat mengubah data setelah disubmit'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['personalData', 'parentData', 'academicData'];
    allowedUpdates.forEach(field => {
      if (req.body[field]) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    res.json({
      success: true,
      message: 'Data berhasil diperbarui',
      data: student
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data'
    });
  }
});

module.exports = router; 