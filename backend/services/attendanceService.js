/**
 * Attendance Service
 * 
 * Business logic for student attendance.
 */

const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

class AttendanceService {
  /**
   * Mark attendance for multiple students in a class on a specific date
   * @param {string} classId - ID of the class
   * @param {string} date - Date of attendance (YYYY-MM-DD or comparable)
   * @param {Array} attendanceData - Array of { studentId, status, remarks }
   */
  async markAttendance(classId, date, attendanceData) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // 1. Verify class exists
    const cls = await Class.findById(classId);
    if (!cls) {
      throw new Error('Class not found');
    }

    // 2. Prepare bulk operations
    // Using upsert (update if exists, insert if not) to handle "duplicates" gracefully 
    // or just checking index. The requirement was to "Prevent duplicate", 
    // but usually in ERPs, "updating" the attendance is also allowed.
    // If we want to strictly "Reject" duplicates, we check first.
    
    // Check if attendance already exists for this class and date
    const existing = await Attendance.findOne({ class: classId, date: targetDate });
    if (existing) {
       throw new Error(`Attendance already marked for this class on ${targetDate.toDateString()}`);
    }

    const operations = attendanceData.map(item => ({
      student: item.studentId,
      class: classId,
      date: targetDate,
      status: item.status,
      remarks: item.remarks || ''
    }));

    const results = await Attendance.insertMany(operations);
    return results;
  }

  /**
   * Fetch attendance report for a class and date
   */
  async getAttendanceReport(classId, date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const report = await Attendance.find({
      class: classId,
      date: targetDate
    })
    .populate('student', 'firstName lastName rollNumber')
    .sort({ 'student.rollNumber': 1 });

    return report;
  }
}

module.exports = new AttendanceService();
