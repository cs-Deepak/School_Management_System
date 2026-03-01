/**
 * Fee Controller
 * 
 * Handles fee inquiries and payment recordings.
 */

const feeService = require('../services/feeService');
const { generateFeeReceipt } = require('../utils/pdfGenerator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get student fee summary
 * @route   GET /api/fees/:classId/:rollNumber
 */
const getFeeDetails = async (req, res, next) => {
  try {
    const { classId, rollNumber } = req.params;
    const details = await feeService.getStudentFeeDetails(classId, rollNumber);
    return successResponse(res, details, 'Fee details fetched successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * @desc    Record a new fee payment
 * @route   POST /api/fees/pay
 */
const recordPayment = async (req, res, next) => {
  try {
    const { studentId, amount, type, transactionId, remarks, dueDate } = req.body;

    if (!studentId || !amount || !type) {
      return errorResponse(res, 'studentId, amount, and type are required', 400);
    }

    const transaction = await feeService.processPayment(studentId, {
      amount,
      type,
      transactionId,
      remarks,
      dueDate
    });

    // Fetch student info first to get class and rollNumber
    const Student = require('../models/Student');
    const student = await Student.findById(studentId).populate('class');

    // Fetch updated fee summary
    const studentFeeDetails = await feeService.getStudentFeeDetails(
      student.class._id, 
      student.rollNumber
    );

    const receiptData = {
      receiptNumber: transaction.receiptNumber,
      date: transaction.paymentDate,
      studentName: `${student.firstName} ${student.lastName}`,
      class: student.class.name,
      rollNumber: student.rollNumber,
      paidAmount: transaction.amount,
      dueAmount: studentFeeDetails.feeSummary.dueFee,
      paymentMode: 'Online/Manual'
    };

    const pdfResult = await generateFeeReceipt(receiptData);

    return successResponse(res, {
      transaction,
      receiptUrl: pdfResult.downloadUrl
    }, 'Payment recorded and receipt generated successfully', 201);

  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Download fee receipt PDF
 * @route   GET /api/fees/receipt/:transactionId
 */
const downloadReceipt = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${transactionId}.pdf`);

    await feeService.generateFeeReceiptPDF(transactionId, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeDetails,
  recordPayment,
  downloadReceipt,
};
