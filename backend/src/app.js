require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const floorRoutes = require('./routes/floor.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const adminRoutes = require('./routes/admin.routes');
const towerRoutes = require('./routes/tower.routes');

const app = express();

/**
 * ✅ REQUIRED FOR RENDER / PROXIES
 * Fixes: express-rate-limit ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
 */
app.set('trust proxy', 1);

/**
 * Security middleware
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

/**
 * ✅ CORS (must be BEFORE rateLimit)
 * Fixes: AxiosError Network Error / CORS blocked from Vercel
 *
 * Supports:
 * - Localhost dev
 * - Your production Vercel domain
 * - Any Vercel preview deployment (*.vercel.app)
 * - Optional FRONTEND_URL env var from Render
 */
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',

  // ✅ Add your Vercel production domain here (important)
  'https://tower-office-rental-jgdl.vercel.app',
]);

// Add FRONTEND_URL (Vercel/custom domain) from environment if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.add(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const clean = origin.replace(/\/$/, '');

      // ✅ Exact allow-list match
      if (allowedOrigins.has(clean)) return callback(null, true);

      // ✅ Allow any Vercel preview deployment: https://xxxx.vercel.app
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(clean)) {
        return callback(null, true);
      }

      console.log('❌ CORS blocked for origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Ensure preflight always responds
app.options('*', cors());

/**
 * Logging
 */
app.use(morgan('combined'));

/**
 * Rate limiting (AFTER CORS)
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

/**
 * Body parsing - increased limits for file uploads
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * Static files
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tower', towerRoutes);

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  // Handle Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error:
          'File too large. Maximum size is 5MB for images and 10MB for floor plans.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Too many files uploaded.' });
    }
    return res.status(400).json({ error: err.message });
  }

  // Handle other errors
  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
