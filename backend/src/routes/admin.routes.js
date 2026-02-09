const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Floor = require('../models/Floor');
const Inquiry = require('../models/Inquiry');
const { auth, isAdmin, isSuperAdmin } = require('../middleware/auth');

// Dashboard statistics
router.get('/dashboard/stats', auth, isAdmin, async (req, res) => {
  try {
    const [totalFloors, availableFloors, totalInquiries, newInquiries] = await Promise.all([
      Floor.countDocuments(),
      Floor.countDocuments({ status: 'available' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' })
    ]);

    const revenueStats = await Floor.aggregate([
      { $match: { status: 'occupied' } },
      {
        $group: {
          _id: null,
          totalMonthlyRevenue: { $sum: { $divide: ['$totalPrice', 12] } },
          totalAnnualRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      stats: {
        totalFloors,
        availableFloors,
        occupancyRate: totalFloors > 0 ? ((totalFloors - availableFloors) / totalFloors * 100).toFixed(2) : 0,
        totalInquiries,
        newInquiries,
        monthlyRevenue: revenueStats[0]?.totalMonthlyRevenue || 0,
        annualRevenue: revenueStats[0]?.totalAnnualRevenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User management (super admin only)
router.get('/users', auth, isSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/users/:id/status', auth, isSuperAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', auth, isSuperAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'admin',
      isActive: true
    });

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;