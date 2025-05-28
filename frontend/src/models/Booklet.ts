// models/Booklet.js

import mongoose from 'mongoose';

const bookletSchema = new mongoose.Schema({
  barcode: {
    type: String,
    unique: true,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: false,
  },
  // examId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Exam',
  //   required: true,
  // },
  status: {
    type: String,
    enum: ['Issued', 'Not Issued'],
    default: 'Not Issued',
  },
  attended: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Booklet || mongoose.model('Booklet', bookletSchema);
