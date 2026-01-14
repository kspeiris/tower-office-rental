const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  area: {
    type: Number,
    required: true,
    min: 100,
    max: 10000
  },
  pricePerSqFt: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 1000
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'under_maintenance', 'reserved'],
    default: 'available'
  },
  images: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    enum: [
      'high_speed_internet',
      'conference_rooms',
      'parking',
      'security',
      'cafeteria',
      'gym',
      'elevator',
      'air_conditioning',
      'cleaning_services',
      'reception'
    ]
  }],
  floorPlan: {
    type: String,
    trim: true
  },
  maxCapacity: {
    type: Number,
    min: 1,
    max: 500
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  view: {
    type: String,
    enum: ['city', 'river', 'park', 'ocean', 'mountain'],
    default: 'city'
  },
  leaseTerm: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    default: 'yearly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for formatted price
floorSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.totalPrice);
});

// Virtual for price per month
floorSchema.virtual('pricePerMonth').get(function() {
  return Math.round(this.totalPrice / 12);
});

// Index for search
floorSchema.index({ floorNumber: 1, status: 1, isFeatured: 1 });

module.exports = mongoose.model('Floor', floorSchema);