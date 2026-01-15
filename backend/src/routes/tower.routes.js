const express = require('express');
const router = express.Router();
const towerController = require('../controllers/tower.controller');
const { auth, isAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Public routes
router.get('/', towerController.getTowerInfo);

// Admin routes
router.put('/', auth, isAdmin, towerController.updateTowerInfo);
router.post('/upload-image', auth, isAdmin, uploadSingle, towerController.uploadTowerImage);

module.exports = router;