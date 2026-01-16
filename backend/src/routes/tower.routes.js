const express = require('express');
const router = express.Router();
const towerController = require('../controllers/tower.controller');
const { auth, isAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// ============================
// PUBLIC ROUTES
// ============================
router.get('/', towerController.getTowerInfo);

// ============================
// ADMIN ROUTES (Protected)
// ============================

// General tower info update
router.put('/', auth, isAdmin, towerController.updateTowerInfo);

// Feature Images Management
router.post('/feature-images', auth, isAdmin, uploadSingle, towerController.uploadFeatureImage);
router.delete('/feature-images', auth, isAdmin, towerController.deleteFeatureImage);

// YouTube Videos Management
router.post('/youtube-videos', auth, isAdmin, towerController.addYoutubeVideo);
router.delete('/youtube-videos', auth, isAdmin, towerController.deleteYoutubeVideo);

module.exports = router;