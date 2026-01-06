import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middleware/validator';
import {
  getProductsValidation,
  getProductByIdValidation,
  getProductBySlugValidation,
  getCategoryBySlugValidation,
} from '../validators/product.validator';

const router = Router();

// Product routes
router.get('/', validate(getProductsValidation), productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', validate(getProductByIdValidation), productController.getProductById);
router.get('/slug/:slug', validate(getProductBySlugValidation), productController.getProductBySlug);

// Category routes
router.get('/categories/all', productController.getCategories);
router.get('/categories/:slug', validate(getCategoryBySlugValidation), productController.getCategoryBySlug);

export default router;
