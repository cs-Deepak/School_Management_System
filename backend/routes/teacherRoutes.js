/**
 * Teacher Routes
 * 
 * RESTful CRUD endpoints for the Teacher resource.
 */

const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');

// GET    /api/teachers        → List all teachers (supports ?subject=&isActive=&page=&limit=)
// POST   /api/teachers        → Create a new teacher
router.route('/').get(getAllTeachers).post(createTeacher);

// GET    /api/teachers/:id    → Get one teacher
// PUT    /api/teachers/:id    → Update a teacher
// DELETE /api/teachers/:id    → Soft-delete a teacher
router.route('/:id').get(getTeacherById).put(updateTeacher).delete(deleteTeacher);

module.exports = router;
