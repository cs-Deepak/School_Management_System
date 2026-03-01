/**
 * Attendance Routes
 * 
 * Accessible by Teachers and Admins.
 */

const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceReport } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
// Admin or teacher
router.use(authorize('admin', 'teacher'));

router.post('/', markAttendance);
router.get('/', getAttendanceReport);

module.exports = router;
