const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { inquiryValidations } = require('../middleware/validation');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', inquiryValidations.create, inquiryController.createInquiry);

// Protected admin routes
router.get('/', auth, isAdmin, inquiryController.getAllInquiries);
router.get('/stats', auth, isAdmin, inquiryController.getInquiryStats);
router.get('/:id', auth, isAdmin, inquiryController.getInquiryById);
router.patch('/:id/status', auth, isAdmin, inquiryController.updateInquiryStatus);

module.exports = router;