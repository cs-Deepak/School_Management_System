/**
 * FeeTransaction Model
 * 
 * Tracks financial transactions for school fees.
 */

const mongoose = require('mongoose');

const feeTransactionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    type: {
      type: String,
      required: [true, 'Fee type is required (e.g., Tuition, Transport, Exam)'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Paid', 'Pending', 'Failed'],
        message: 'Status must be Paid, Pending, or Failed',
      },
      required: [true, 'Payment status is required'],
      default: 'Pending',
    },
    paymentDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple nulls if not yet paid
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true, // Generated only on successful payment
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index student for faster reporting
feeTransactionSchema.index({ student: 1 });

module.exports = mongoose.model('FeeTransaction', feeTransactionSchema);
