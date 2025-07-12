const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Nomor Pendaftaran (Auto-generated)
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Data Pribadi
  personalData: {
    fullName: {
      type: String,
      required: [true, 'Nama lengkap wajib diisi'],
      trim: true
    },
    nickName: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      enum: ['Laki-laki', 'Perempuan'],
      required: [true, 'Jenis kelamin wajib diisi']
    },
    birthPlace: {
      type: String,
      required: [true, 'Tempat lahir wajib diisi']
    },
    birthDate: {
      type: Date,
      required: [true, 'Tanggal lahir wajib diisi']
    },
    religion: {
      type: String,
      default: 'Islam'
    },
    address: {
      street: {
        type: String,
        required: [true, 'Alamat wajib diisi']
      },
      village: String,
      district: String,
      city: {
        type: String,
        required: [true, 'Kota wajib diisi']
      },
      postalCode: String
    },
    phoneNumber: {
      type: String,
      required: [true, 'Nomor telepon wajib diisi']
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true
    }
  },

  // Data Orang Tua
  parentData: {
    father: {
      name: {
        type: String,
        required: [true, 'Nama ayah wajib diisi']
      },
      occupation: String,
      phoneNumber: String,
      education: String
    },
    mother: {
      name: {
        type: String,
        required: [true, 'Nama ibu wajib diisi']
      },
      occupation: String,
      phoneNumber: String,
      education: String
    },
    guardian: {
      name: String,
      relationship: String,
      phoneNumber: String
    }
  },

  // Data Akademik
  academicData: {
    previousSchool: {
      name: {
        type: String,
        required: [true, 'Nama sekolah sebelumnya wajib diisi']
      },
      address: String,
      graduationYear: Number
    },
    lastGrade: {
      type: String,
      required: [true, 'Nilai terakhir wajib diisi']
    },
    achievements: [{
      title: String,
      level: String,
      year: Number
    }]
  },

  // Dokumen Persyaratan
  documents: {
    birthCertificate: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    },
    familyCard: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    },
    previousDiploma: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    },
    photo: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    },
    healthCertificate: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date
    }
  },

  // Status Pendaftaran
  registrationStatus: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Waitlisted'],
    default: 'Draft'
  },

  // Tracking
  tracking: {
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    notes: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Notifikasi
  notifications: {
    emailSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    },
    lastNotificationSent: Date
  },

  // QR Code untuk tracking
  qrCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate registration number before saving
studentSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.registrationNumber = `MTS-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Generate QR Code
studentSchema.methods.generateQRCode = function() {
  const data = {
    registrationNumber: this.registrationNumber,
    studentName: this.personalData.fullName,
    status: this.registrationStatus
  };
  return JSON.stringify(data);
};

module.exports = mongoose.model('Student', studentSchema); 