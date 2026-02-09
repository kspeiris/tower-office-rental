const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authValidations } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', authValidations.register, authController.register);
router.post('/login', authValidations.login, authController.login);

// Protected routes
router.post('/logout', auth, authController.logout);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/update-password', auth, authController.updatePassword);
router.put('/preferences', auth, authController.updatePreferences);

module.exports = router;