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
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// GET    /api/students        → List all students (supports ?grade=&section=&isActive=&page=&limit=)
// POST   /api/students        → Create a new student
router.route('/').get(getAllStudents).post(createStudent);

// GET    /api/students/:id    → Get one student
// PUT    /api/students/:id    → Update a student
// DELETE /api/students/:id    → Soft-delete a student
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
