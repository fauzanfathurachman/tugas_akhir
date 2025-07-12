const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: 6
  },
  fullName: {
    type: String,
    required: [true, 'Nama lengkap wajib diisi']
  },
  role: {
    type: String,
    enum: ['admin', 'reviewer', 'super_admin'],
    default: 'reviewer'
  },
  permissions: [{
    type: String,
    enum: ['view_registrations', 'edit_registrations', 'approve_registrations', 'manage_admins', 'view_reports']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  profilePicture: String
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);