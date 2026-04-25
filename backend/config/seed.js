const User = require('../models/userModel');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@collegesphere.com';
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      console.log('No admin found in database. Creating default admin...');
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'admin123', // Will be hashed by userModel pre-save hook
        role: 'admin',
        collegeName: 'System'
      });
      console.log('-----------------------------------');
      console.log('DEFAULT ADMIN CREATED:');
      console.log(`Email: ${adminEmail}`);
      console.log('Password: admin123');
      console.log('-----------------------------------');
    } else {
      console.log('Admin account verified in database.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;
