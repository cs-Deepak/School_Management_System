/**
 * Fee Management Routes
 * 
 * Secured for Admin and Staff.
 */

const express = require('express');
const router = express.Router();
const { getFeeDetails, recordPayment, downloadReceipt } = require('../controllers/feeController');
const { protect, isAdmin } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Allow staff/admin for inquiry? Let's keep it specific but add receipt access
router.get('/receipt/:transactionId', downloadReceipt);

router.use(isAdmin); // Restrict to admin role for direct financial edits

// Fetch summary using classId and rollNumber
router.get('/:classId/:rollNumber', getFeeDetails);

// Post a new payment
router.post('/pay', recordPayment);

module.exports = router;
