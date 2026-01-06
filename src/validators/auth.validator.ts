import { body } from 'express-validator';

export const signupValidation = [
  body('email')
    .exists().withMessage('Email is required')
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .exists().withMessage('First name is required')
    .trim()
    .notEmpty().withMessage('First name cannot be empty')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  body('lastName')
    .exists().withMessage('Last name is required')
    .trim()
    .notEmpty().withMessage('Last name cannot be empty')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[\d\s-()]+$/).withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
];

export const loginValidation = [
  body('email')
    .exists().withMessage('Email is required')
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
    .isString().withMessage('Password must be a string'),
];

export const refreshTokenValidation = [
  body('refreshToken')
    .exists().withMessage('Refresh token is required')
    .notEmpty().withMessage('Refresh token cannot be empty')
    .isString().withMessage('Refresh token must be a string')
    .isLength({ min: 10 }).withMessage('Invalid refresh token format'),
];

export const updateProfileValidation = [
  body('firstName')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty().withMessage('First name cannot be empty if provided')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  body('lastName')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty().withMessage('Last name cannot be empty if provided')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty().withMessage('Phone cannot be empty if provided')
    .matches(/^\+?[\d\s-()]+$/).withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  body()
    .custom((value, { req }) => {
      const hasAtLeastOneField = req.body.firstName || req.body.lastName || req.body.phone;
      if (!hasAtLeastOneField) {
        throw new Error('At least one field (firstName, lastName, or phone) must be provided');
      }
      return true;
    }),
];
