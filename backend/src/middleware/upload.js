const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for floor images
const floorStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tower-office/floors',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Configure Cloudinary storage for floor plans
const floorPlanStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tower-office/floor-plans',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf']
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
  }
};

// Configure multer with Cloudinary storage
const uploadFloorImages = multer({
  storage: floorStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: imageFilter
});

const uploadFloorPlan = multer({
  storage: floorPlanStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for floor plans
  }
});

// Multiple file upload
const uploadMultiple = uploadFloorImages.fields([
  { name: 'images', maxCount: 5 },
  { name: 'floorPlan', maxCount: 1 }
]);

// Single file upload
const uploadSingle = uploadFloorImages.single('image');

module.exports = { uploadMultiple, uploadSingle, uploadFloorImages };