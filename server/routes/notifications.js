const express = require('express');
const Student = require('../models/Student');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

const router = express.Router();

// Send test email
router.post('/test-email', async (req, res) => {
  try {
    const { email, registrationNumber } = req.body;

    if (!email || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email dan nomor pendaftaran wajib diisi'
      });
    }

    // Create mock student data for testing
    const mockStudent = {
      personalData: {
        fullName: 'Test Student',
        email: email
      },
      registrationNumber: registrationNumber
    };

    const result = await emailService.sendRegistrationConfirmation(mockStudent);

    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengirim test email'
    });
  }
});

// Send test SMS
router.post('/test-sms', async (req, res) => {
  try {
    const { phoneNumber, registrationNumber } = req.body;

    if (!phoneNumber || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Nomor telepon dan nomor pendaftaran wajib diisi'
      });
    }

    // Create mock student data for testing
    const mockStudent = {
      personalData: {
        fullName: 'Test Student',
        phoneNumber: phoneNumber
      },
      registrationNumber: registrationNumber
    };

    const result = await smsService.sendRegistrationConfirmation(mockStudent);

    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengirim test SMS'
    });
  }
});

// Resend confirmation to student
router.post('/resend-confirmation/:registrationNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ registrationNumber: req.params.registrationNumber });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran tidak ditemukan'
      });
    }

    let emailResult = { success: false };
    let smsResult = { success: false };

    // Send email confirmation
    if (process.env.EMAIL_USER) {
      emailResult = await emailService.sendRegistrationConfirmation(student);
    }

    // Send SMS confirmation
    if (process.env.TWILIO_ACCOUNT_SID) {
      smsResult = await smsService.sendRegistrationConfirmation(student);
    }

    res.json({
      success: true,
      message: 'Konfirmasi berhasil dikirim ulang',
      data: {
        email: emailResult,
        sms: smsResult
      }
    });
  } catch (error) {
    console.error('Resend confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengirim ulang konfirmasi'
    });
  }
});

// Get notification settings
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      email: {
        enabled: !!process.env.EMAIL_USER,
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER ? 'Configured' : 'Not configured'
      },
      sms: {
        enabled: !!process.env.TWILIO_ACCOUNT_SID,
        provider: 'Twilio',
        status: process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured'
      }
    }
  });
});

module.exports = router; 