const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('🔍 Auth Middleware - Header:', authHeader ? 'Present' : 'MISSING');

    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ Auth Middleware - No token found');
      return res.status(401).json({
        success: false,
        error: 'Please authenticate'
      });
    }

    console.log('🎫 Auth Middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('👤 Auth Middleware - Token decoded, UserID:', decoded.userId);

    const user = await User.findOne({ _id: decoded.userId, isActive: true });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Please authenticate'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Please authenticate'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Admin rights required.'
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Super admin rights required.'
    });
  }
};

module.exports = { auth, isAdmin, isSuperAdmin };