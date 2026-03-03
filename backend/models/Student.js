const mongoose = require('mongoose');
const Counter = require('./Counter');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      index: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Student must be assigned to a class'],
      index: true,
    },
    grade: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      default: 'A',
    },
    address: {
      type: String,
      trim: true,
    },
    parentName: {
      type: String,
      required: [true, 'Parent name is required'],
      trim: true,
    },
    parentPhone: {
      type: String,
      required: [true, 'Parent phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
studentSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook for auto-generating studentId
studentSchema.pre('save', async function () {
  if (!this.studentId) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'studentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const year = new Date().getFullYear();
    const sequence = counter.seq.toString().padStart(4, '0');
    this.studentId = `STU-${year}-${sequence}`;
  }
});

// Compound index for unique roll number within a class and section
studentSchema.index({ class: 1, section: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);

