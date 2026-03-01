/**
 * Admin Routes
 * 
 * All routes here require Admin privileges.
 */

const express = require('express');
const router = express.Router();
const { 
  createClass,
  updateClass,
  deleteClass,
  createTeacher,
  createStudent, 
  getStudentsByClass, 
  getAllClasses,
  getClassAttendanceReport,
  getStudentAttendanceReport,
  getStudentAttendanceAnalysis,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// Apply protection and Admin check to all routes in this router
router.use(protect);
router.use(isAdmin);

// Stats route
router.get('/stats', getDashboardStats);

// Class routes
router.post('/classes', createClass);
router.get('/classes', getAllClasses);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);
router.get('/classes/:classId/students', getStudentsByClass);

// Resource creation routes
router.post('/teachers', createTeacher);
router.post('/students', createStudent);

// Analytics routes
router.get('/attendance/class/:classId', getClassAttendanceReport);
router.get('/attendance/student/:studentId', getStudentAttendanceReport);
router.get('/attendance/analysis/student/:studentId', getStudentAttendanceAnalysis);

module.exports = router;
