const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Counter = require('../models/Counter');

const migrateStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for migration...');

    const students = await Student.find({});
    console.log(`Found ${students.length} students to migrate.`);

    for (let student of students) {
      const updates = {};
      
      // 1. Generate studentId if missing
      if (!student.studentId) {
        const counter = await Counter.findOneAndUpdate(
          { name: 'studentId' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const year = new Date().getFullYear();
        const sequence = counter.seq.toString().padStart(4, '0');
        updates.studentId = `STU-${year}-${sequence}`;
        console.log(`Assigning ID ${updates.studentId} to student ${student._id}`);
      }

      // 2. Ensure field consistency (map old names if they exist)
      if (student.name && !student.firstName) {
        const parts = student.name.split(' ');
        updates.firstName = parts[0] || 'Student';
        updates.lastName = parts.slice(1).join(' ') || 'Legacy';
      }

      if (student.classId && !student.class) {
        updates.class = student.classId;
      }

      if (student.parentMobile && !student.parentPhone) {
        updates.parentPhone = student.parentMobile;
      }

      // 3. Status fix
      if (typeof student.status !== 'string' || !['active', 'inactive'].includes(student.status)) {
        updates.status = student.isActive === false ? 'inactive' : 'active';
      }

      // 4. Required field defaults for validation safety
      if (!student.firstName && !updates.firstName) updates.firstName = 'Unknown';
      if (!student.lastName && !updates.lastName) updates.lastName = 'Student';
      if (!student.rollNumber) updates.rollNumber = 'TEMP-' + student._id.toString().slice(-4);
      if (!student.parentName) updates.parentName = 'Contact Admin';
      if (!student.parentPhone && !updates.parentPhone) updates.parentPhone = '0000000000';

      if (Object.keys(updates).length > 0) {
        await Student.findByIdAndUpdate(student._id, updates, { runValidators: false });
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateStudents();
