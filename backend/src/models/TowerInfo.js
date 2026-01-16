const mongoose = require('mongoose');

const towerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 200,
    default: 'JFI Tower 3'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: 'Premium commercial office spaces'
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
    max: 200,
    default: 25
  },
  yearBuilt: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  
  // Feature Images stored in Cloudinary
  featureImages: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 500
    },
    category: {
      type: String,
      enum: ['exterior', 'interior', 'lobby', 'amenities', 'offices', 'common-areas'],
      default: 'exterior'
    },
    order: {
      type: Number,
      default: 0
    },
    isHeroImage: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // YouTube Videos
  youtubeVideos: [{
    url: {
      type: String,
      required: true
    },
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 500
    },
    thumbnailUrl: String,
    order: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['tour', 'testimonial', 'facilities', 'location'],
      default: 'tour'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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

// Index for faster queries
towerInfoSchema.index({ 'featureImages.order': 1 });
towerInfoSchema.index({ 'youtubeVideos.order': 1 });

module.exports = mongoose.model('TowerInfo', towerInfoSchema);