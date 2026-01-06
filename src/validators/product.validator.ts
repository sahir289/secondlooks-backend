import { query, param } from 'express-validator';

export const getProductsValidation = [
  query('categoryId')
    .optional({ checkFalsy: true })
    .isUUID().withMessage('Category ID must be a valid UUID'),
  query('search')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters'),
  query('minPrice')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Minimum price must be a positive number')
    .toFloat(),
  query('maxPrice')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Maximum price must be a positive number')
    .toFloat(),
  query('isFeatured')
    .optional({ checkFalsy: true })
    .isBoolean().withMessage('isFeatured must be a boolean value (true or false)')
    .toBoolean(),
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('sortBy')
    .optional({ checkFalsy: true })
    .isIn(['name', 'price', 'createdAt']).withMessage('Sort field must be one of: name, price, createdAt'),
  query('sortOrder')
    .optional({ checkFalsy: true })
    .isIn(['asc', 'desc']).withMessage('Sort order must be either asc or desc'),
];

export const getProductByIdValidation = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Product ID must be a valid UUID'),
];

export const getProductBySlugValidation = [
  param('slug')
    .notEmpty().withMessage('Product slug is required')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Product slug must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Product slug can only contain letters, numbers, hyphens, and underscores'),
];

export const getCategoryBySlugValidation = [
  param('slug')
    .notEmpty().withMessage('Category slug is required')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Category slug must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Category slug can only contain letters, numbers, hyphens, and underscores'),
];
