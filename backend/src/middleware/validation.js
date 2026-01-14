const { body, param, query, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

const floorValidations = {
  create: validate([
    body('floorNumber')
      .isInt({ min: 1, max: 100 })
      .withMessage('Floor number must be between 1 and 100'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name must be less than 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('area')
      .isFloat({ min: 100, max: 10000 })
      .withMessage('Area must be between 100 and 10000 sq ft'),
    body('pricePerSqFt')
      .isFloat({ min: 1, max: 100 })
      .withMessage('Price per sq ft must be between 1 and 100'),
    body('status')
      .optional()
      .isIn(['available', 'occupied', 'under_maintenance', 'reserved'])
      .withMessage('Invalid status'),
    body('maxCapacity')
      .optional()
      .isInt({ min: 1, max: 500 })
      .withMessage('Max capacity must be between 1 and 500')
  ]),

  update: validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid floor ID'),
    body('floorNumber')
      .optional()
      .isInt({ min: 1, max: 100 }),
    body('status')
      .optional()
      .isIn(['available', 'occupied', 'under_maintenance', 'reserved'])
  ])
};

const inquiryValidations = {
  create: validate([
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name must be less than 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Invalid phone number'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 1000 })
      .withMessage('Message must be less than 1000 characters'),
    body('floorId')
      .isMongoId()
      .withMessage('Invalid floor ID')
  ])
};

const authValidations = {
  login: validate([
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ]),

  register: validate([
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ])
};

module.exports = {
  floorValidations,
  inquiryValidations,
  authValidations,
  validate
};