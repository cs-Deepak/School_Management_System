/**
 * Student Routes
 * 
 * RESTful CRUD endpoints for the Student resource.
 */

const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// GET    /api/students        → List all students
// POST   /api/students        → Create a new student
router.route('/').get(getAllStudents).post(createStudent);

// GET    /api/students/:studentId/profile → Comprehensive profile + fees
router.get('/:studentId/profile', getStudentProfile);

// GET    /api/students/:id    → Get one student (by _id)
// PUT    /api/students/:id    → Update a student
// DELETE /api/students/:id    → Soft-delete a student
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
