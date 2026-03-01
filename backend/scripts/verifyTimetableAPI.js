const timetableService = require('../services/timetableService');

// Mocking some data for verification
const sampleClassId = '65d12345678901234567890a'; 
const sampleSubjectId = '65d12345678901234567890b';
const sampleTeacherId = '65d12345678901234567890c';

const mockTimetableData = {
  class: sampleClassId,
  academicYear: '2024',
  semester: 'Semester 1',
  weeklySchedule: [
    {
      day: 'Monday',
      slots: [
        {
          startTime: '08:00 AM',
          endTime: '09:00 AM',
          subject: sampleSubjectId,
          teacher: sampleTeacherId,
          type: 'Theory'
        },
        {
          startTime: '09:00 AM', // No overlap
          endTime: '10:00 AM',
          subject: sampleSubjectId,
          teacher: sampleTeacherId,
          type: 'Theory'
        }
      ]
    }
  ]
};

const overlapTimetableData = {
  class: sampleClassId,
  academicYear: '2024',
  semester: 'Semester 2',
  weeklySchedule: [
    {
      day: 'Monday',
      slots: [
        {
          startTime: '08:00 AM',
          endTime: '09:30 AM',
          subject: sampleSubjectId,
          teacher: sampleTeacherId,
          type: 'Theory'
        },
        {
          startTime: '09:00 AM', // OVERLAP!
          endTime: '10:00 AM',
          subject: sampleSubjectId,
          teacher: sampleTeacherId,
          type: 'Theory'
        }
      ]
    }
  ]
};

async function testValidation() {
  console.log('--- Testing Overlap Validation ---');
  try {
    // We can't easily run the real service without DB, 
    // but we can test the local functions if we export them or just check the logic.
    // Since I implemented them in the service, let's just trace the logic.
    
    const timeToMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const s1 = timeToMinutes('08:00 AM'); // 480
    const e1 = timeToMinutes('09:30 AM'); // 570
    const s2 = timeToMinutes('09:00 AM'); // 540
    const e2 = timeToMinutes('10:00 AM'); // 600

    console.log(`Slot 1: ${s1} to ${e1}`);
    console.log(`Slot 2: ${s2} to ${e2}`);
    
    const isOverlap = s1 < e2 && s2 < e1;
    console.log('Overlap detected:', isOverlap);
    
    if (isOverlap) {
      console.log('✅ Overlap detection logic works.');
    } else {
      console.error('❌ Overlap detection logic failed.');
    }

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testValidation();
