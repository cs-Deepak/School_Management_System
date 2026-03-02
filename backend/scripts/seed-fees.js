const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Student = require('../models/Student');
const FeeLedger = require('../models/FeeLedger');

const seedFees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for fee seeding...');

    const students = await Student.find({});
    console.log(`Found ${students.length} students. Generating fee ledgers...`);

    const months = [
      'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December', 'January', 'February', 'March'
    ];

    const academicYear = '2025-26';

    for (const student of students) {
      // Clear existing ledger for this year to avoid duplicates
      await FeeLedger.deleteMany({ studentId: student._id, academicYear });

      const monthlyFees = months.map((month, index) => {
        const amount = 2500;
        let paidAmount = 0;
        let paidOn = null;

        // Realistic payment simulation:
        // Earlier months (April-August) are mostly paid
        if (index < 5) {
          paidAmount = amount;
          paidOn = new Date(2025, 3 + index, 5 + Math.floor(Math.random() * 20));
        } 
        // Middle months (September-October) might be partial or unpaid
        else if (index < 7) {
          paidAmount = Math.random() > 0.5 ? 1500 : 0;
          if (paidAmount > 0) {
              paidOn = new Date(2025, 3 + index, 10);
          }
        }
        // Future months are unpaid
        else {
          paidAmount = 0;
          paidOn = null;
        }

        return {
          month,
          amount,
          paidAmount,
          paidOn
        };
      });

      console.log(`Processing ${student.firstName} ${student.lastName} (${student._id})...`);
      await FeeLedger.create({
        studentId: student._id,
        academicYear,
        monthlyFees
      });

      console.log(`Created fee ledger for ${student.firstName} ${student.lastName} (${student.studentId})`);
    }

    console.log('Fee seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', JSON.stringify(error.errors, null, 2));
    } else {
      console.error('Fee seeding error:', error);
    }
    process.exit(1);
  }
};

seedFees();
