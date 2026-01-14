const mongoose = require('mongoose');

const towerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  totalFloors: {
    type: Number,
    min: 1,
    max: 200
  },
  yearBuilt: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  amenities: [{
    name: String,
    description: String,
    icon: String,
    category: {
      type: String,
      enum: ['security', 'convenience', 'recreation', 'business']
    }
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String,
    officeHours: String
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  managementCompany: {
    name: String,
    contact: String,
    email: String
  },
  parkingInfo: {
    totalSpaces: Number,
    visitorSpaces: Number,
    parkingFee: Number
  },
  accessibility: [String],
  sustainability: {
    leedCertified: Boolean,
    energyStar: Boolean,
    greenInitiatives: [String]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TowerInfo', towerInfoSchema);