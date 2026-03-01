/**
 * Attendance Controller
 * 
 * Handles HTTP requests for attendance marking and reporting.
 */

const attendanceService = require('../services/attendanceService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Mark attendance for a class
 * @route   POST /api/attendance
 */
const markAttendance = async (req, res, next) => {
  try {
    const { classId, date, attendanceData } = req.body;

    if (!classId || !date || !attendanceData || !Array.isArray(attendanceData)) {
      return errorResponse(res, 'Missing required fields: classId, date, or attendanceData array', 400);
    }

    const result = await attendanceService.markAttendance(classId, date, attendanceData);
    return successResponse(res, result, 'Attendance marked successfully', 201);
  } catch (error) {
    if (error.message.includes('already marked')) {
        return errorResponse(res, error.message, 409); // Conflict
    }
    next(error);
  }
};

/**
 * @desc    Get attendance report
 * @route   GET /api/attendance
 */
const getAttendanceReport = async (req, res, next) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return errorResponse(res, 'Missing query parameters: classId and date are required', 400);
    }

    const report = await attendanceService.getAttendanceReport(classId, date);
    return successResponse(res, report, 'Attendance report fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendanceReport,
};
