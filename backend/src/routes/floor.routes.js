const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floor.controller');
const { floorValidations } = require('../middleware/validation');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', floorController.getAllFloors);
router.get('/available', floorController.getAvailableFloors);
router.get('/featured', floorController.getFeaturedFloors);
router.get('/:id', floorController.getFloorById);

// Protected admin routes
router.post('/', auth, isAdmin, floorValidations.create, floorController.createFloor);
router.put('/:id', auth, isAdmin, floorValidations.update, floorController.updateFloor);
router.delete('/:id', auth, isAdmin, floorController.deleteFloor);

module.exports = router;