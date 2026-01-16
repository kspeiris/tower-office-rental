const multer = require('multer');
const path = require('path');

// MEMORY STORAGE - Direct to Cloudinary (Cloud-ready, no disk dependency)
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'), false);
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for Cloudinary compatibility
  },
  fileFilter: fileFilter,
});

// Single file upload
const uploadSingle = upload.single('image');

// Multiple file upload
const uploadMultiple = upload.array('images', 10); // Max 10 images

// Fields upload (for different file types)
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'floorPlan', maxCount: 1 }
]);

module.exports = { 
  uploadSingle, 
  uploadMultiple, 
  uploadFields 
};