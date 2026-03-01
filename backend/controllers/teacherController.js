/**
 * Teacher Controller
 * 
 * Full CRUD operations for the Teacher resource.
 * Errors are forwarded to the centralized error handler via next().
 */

const Teacher = require('../models/Teacher');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all teachers (with optional filters)
 * @route   GET /api/teachers
 * @access  Public
 */
const getAllTeachers = async (req, res, next) => {
  try {
    const { subject, isActive, page = 1, limit = 20 } = req.query;

    // Build filter object
    const filter = {};
    if (subject) filter.subject = subject;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [teachers, total] = await Promise.all([
      Teacher.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Teacher.countDocuments(filter),
    ]);

    return successResponse(res, {
      teachers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Teachers fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single teacher by ID
 * @route   GET /api/teachers/:id
 * @access  Public
 */
const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return errorResponse(res, 'Teacher not found', 404);
    }

    return successResponse(res, teacher, 'Teacher fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new teacher
 * @route   POST /api/teachers
 * @access  Public
 */
const createTeacher = async (req, res, next) => {
  try {
    console.log('TeacherController: Creating teacher:', JSON.stringify(req.body, null, 2));
    const teacher = await Teacher.create(req.body);
    return successResponse(res, teacher, 'Teacher created successfully', 201);
  } catch (error) {
    console.error('TeacherController: Error creating teacher:', error);
    next(error);
  }
};

/**
 * @desc    Update a teacher
 * @route   PUT /api/teachers/:id
 * @access  Public
 */
const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return errorResponse(res, 'Teacher not found', 404);
    }

    return successResponse(res, teacher, 'Teacher updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a teacher (soft delete — sets isActive to false)
 * @route   DELETE /api/teachers/:id
 * @access  Public
 */
const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!teacher) {
      return errorResponse(res, 'Teacher not found', 404);
    }

    return successResponse(res, teacher, 'Teacher deactivated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
