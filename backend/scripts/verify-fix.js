const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Student = require('../models/Student');
const User = require('../models/User');
const feeService = require('../services/feeService');

const verifyFix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for verification...');

    // Clear test data from previous runs
    await User.deleteMany({ email: 'teacher@test.com' });
    await Teacher.deleteMany({ email: 'teacher@test.com' });
    await Student.deleteMany({ email: 'student@test.com' });
    await Class.deleteMany({ name: 'TEST-CLASS' });

    // 1. Create a User for the Teacher
    const teacherUser = await User.create({
      name: 'Test Teacher User',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });

    // 2. Create a Teacher Profile
    const teacher = await Teacher.create({
      firstName: 'Test',
      lastName: 'Teacher',
      email: 'teacher@test.com',
      phone: '1234567890',
      subject: 'Math',
      user: teacherUser._id
    });
    console.log('Teacher created:', teacher._id);

    // 3. Create a Class with the Teacher
    const newClass = await Class.create({
      name: 'TEST-CLASS',
      section: 'A',
      tuitionFee: 1000,
      teacher: teacher._id 
    });
    console.log('Class created:', newClass.name);

    // 4. Create a Student
    const student = await Student.create({
      firstName: 'Test',
      lastName: 'Student',
      email: 'student@test.com',
      grade: '10',
      class: newClass._id,
      rollNumber: 'ROLL-001',
      parentName: 'Parent',
      parentPhone: '9988776655'
    });
    console.log('Student created:', student.rollNumber);

    // 5. Fetch Fee Details
    const feeDetails = await feeService.getStudentFeeDetails(newClass._id, 'ROLL-001');
    console.log('Fee details fetched for student:', feeDetails.student.fullName);
    console.log('Due Fee:', feeDetails.feeSummary.dueFee);

    if (feeDetails.student.fullName === 'Test Student' && feeDetails.feeSummary.totalFee === 1000) {
      console.log('VERIFICATION SUCCESSFUL');
    } else {
      console.error('VERIFICATION FAILED: Data mismatch');
    }

    // Cleanup verification data
    await User.findByIdAndDelete(teacherUser._id);
    await Teacher.findByIdAndDelete(teacher._id);
    await Class.findByIdAndDelete(newClass._id);
    await Student.findByIdAndDelete(student._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Verification Error:', error);
    process.exit(1);
  }
};

verifyFix();
