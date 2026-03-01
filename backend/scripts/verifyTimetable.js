const mongoose = require('mongoose');
const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');

async function verifyTimetable() {
  try {
    console.log('--- Timetable Schema Verification ---');
    
    // We don't need a real DB connection for validation testing if we use .validate()
    // but for a full check, we can mock or just check schema paths
    
    const paths = Object.keys(Timetable.schema.paths);
    console.log('Schema Paths:', paths.join(', '));
    
    const expectedPaths = ['class', 'weeklySchedule', 'academicYear', 'isActive'];
    const missingPaths = expectedPaths.filter(p => !paths.includes(p));
    
    if (missingPaths.length === 0) {
      console.log('✅ All core paths exist.');
    } else {
      console.error('❌ Missing paths:', missingPaths);
    }

    // Verify day enum
    const dayEnum = Timetable.schema.path('weeklySchedule').schema.path('day').enumValues;
    console.log('Day Enum:', dayEnum.join(', '));
    
    // Verify type enum
    const typeEnum = Timetable.schema.path('weeklySchedule').schema.path('slots').schema.path('type').enumValues;
    console.log('Slot Type Enum:', typeEnum.join(', '));

    console.log('--- Verification Complete ---');
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifyTimetable();
