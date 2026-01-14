const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: 200
  },
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'viewing_scheduled', 'offer_sent', 'closed', 'rejected'],
    default: 'new'
  },
  preferredContact: {
    type: String,
    enum: ['email', 'phone', 'any'],
    default: 'any'
  },
  budget: {
    type: Number,
    min: 0,
    max: 1000000
  },
  moveInDate: {
    type: Date
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responseNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ floorId: 1 });

// Virtual for formatted date
inquirySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('Inquiry', inquirySchema);