const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    // Delete if already exists (cleanup)
    await User.deleteOne({ email: 'admin@lbs.com' });
    
    const admin = await User.create({
      name: 'LBS School Administrator',
      email: 'admin@lbs.com',
      password: 'password123',
      role: 'admin',
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@lbs.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
