const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floor.controller');
const { floorValidations } = require('../middleware/validation');
const { auth, isAdmin } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', floorController.getAllFloors);
router.get('/available', floorController.getAvailableFloors);
router.get('/featured', floorController.getFeaturedFloors);
router.get('/:id', floorController.getFloorById);

// Protected admin routes
router.post(
  '/', 
  auth, 
  isAdmin, 
  uploadMultiple,
  floorValidations.create, 
  floorController.createFloor
);

router.put(
  '/:id', 
  auth, 
  isAdmin, 
  uploadMultiple,
  floorValidations.update, 
  floorController.updateFloor
);

router.delete('/:id', auth, isAdmin, floorController.deleteFloor);

// Delete specific image
router.delete('/:id/images', auth, isAdmin, floorController.deleteFloorImage);

module.exports = router;