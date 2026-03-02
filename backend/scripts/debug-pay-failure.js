const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Student = require('../models/Student');
const FeeLedger = require('../models/FeeLedger');
const feeService = require('../services/feeService');

const debugPay = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const student = await Student.findOne({ rollNumber: '136' });
        if (!student) {
            console.log('Student 136 not found');
            process.exit(1);
        }

        console.log('Testing payment for student:', student.firstName, student._id);

        const paymentData = {
            amount: 1000,
            type: 'Tuition',
            month: 'September',
            academicYear: '2025-26',
            transactionId: 'DEBUG-TXN-' + Date.now(),
            remarks: 'Debug payment test'
        };

        const transaction = await feeService.processPayment(student._id, paymentData);
        console.log('Success! Transaction ID:', transaction._id);
        process.exit(0);
    } catch (error) {
        console.error('--- ERROR CAUGHT ---');
        console.error(error);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
};

debugPay();
