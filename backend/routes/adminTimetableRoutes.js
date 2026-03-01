const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { protect, isAdmin } = require('../middleware/auth');

// All routes here are protected and admin-only
router.use(protect);
router.use(isAdmin);

router.post('/', timetableController.createTimetable);
router.put('/:id', timetableController.updateTimetable);

module.exports = router;
