/**
 * Auth Routes
 * 
 * Public:   POST /api/auth/register, POST /api/auth/login
 * Private:  GET  /api/auth/me (requires JWT)
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
