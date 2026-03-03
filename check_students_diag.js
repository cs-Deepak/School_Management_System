const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const Student = require('./backend/models/Student');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await Student.find({}).limit(10);
        console.log('Sample Students Raw Data:');
        console.log(JSON.stringify(students, null, 2));
        
        const countAll = await Student.countDocuments({});
        const countActive = await Student.countDocuments({ status: 'active' });
        const countNoStatus = await Student.countDocuments({ status: { $exists: false } });
        
        console.log(`\nStatistics:`);
        console.log(`Total Students: ${countAll}`);
        console.log(`Students with status 'active': ${countActive}`);
        console.log(`Students with no status field: ${countNoStatus}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
