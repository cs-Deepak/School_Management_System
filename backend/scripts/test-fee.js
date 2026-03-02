const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Student = require('../models/Student');
const FeeLedger = require('../models/FeeLedger');

const testFee = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const student = await Student.findOne({});
    if (!student) {
        console.log('No student found');
        process.exit(0);
    }
    console.log('Testing with student:', student.name, student._id);
    
    // Clear existing
    await FeeLedger.deleteMany({ studentId: student._id });

    const data = {
        studentId: student._id,
        academicYear: '2025-26',
        monthlyFees: [
            { month: 'April', amount: 2500, paidAmount: 0 },
            { month: 'May', amount: 2500, paidAmount: 0 }
        ]
    };

    const ledger = await FeeLedger.create(data);
    console.log('Ledger created successfully:', ledger._id);
    process.exit(0);
  } catch (error) {
    console.log('--- ERROR START ---');
    console.log('Name:', error.name);
    console.log('Message:', error.message);
    if (error.errors) {
      for (let key in error.errors) {
        console.log(`Field [${key}]: ${error.errors[key].message}`);
      }
    }
    console.log('--- ERROR END ---');
    process.exit(1);
  }
};

testFee();
