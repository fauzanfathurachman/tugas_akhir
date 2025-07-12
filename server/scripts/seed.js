const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mts_ulul_albab');
    console.log('📦 Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = new Admin({
      username: 'admin',
      email: 'admin@mtsululalbab.sch.id',
      password: 'admin123',
      fullName: 'Super Administrator',
      role: 'super_admin',
      permissions: [
        'view_registrations',
        'edit_registrations',
        'approve_registrations',
        'manage_admins',
        'view_reports'
      ]
    });

    await superAdmin.save();
    console.log('✅ Super admin created successfully');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');

    // Create reviewer admin
    const reviewerAdmin = new Admin({
      username: 'reviewer',
      email: 'reviewer@mtsululalbab.sch.id',
      password: 'reviewer123',
      fullName: 'Registration Reviewer',
      role: 'reviewer',
      permissions: [
        'view_registrations',
        'edit_registrations',
        'approve_registrations'
      ]
    });

    await reviewerAdmin.save();
    console.log('✅ Reviewer admin created successfully');
    console.log('👤 Username: reviewer');
    console.log('🔑 Password: reviewer123');

    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin(); 