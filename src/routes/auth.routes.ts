import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate, requireBody } from '../middleware/validator';
import { authenticate } from '../middleware/auth';
import {
  signupValidation,
  loginValidation,
  refreshTokenValidation,
  updateProfileValidation,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/signup', requireBody, validate(signupValidation), authController.signup);
router.post('/login', requireBody, validate(loginValidation), authController.login);
router.post('/refresh-token', requireBody, validate(refreshTokenValidation), authController.refreshToken);
router.post('/logout', requireBody, validate(refreshTokenValidation), authController.logout);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, requireBody, validate(updateProfileValidation), authController.updateProfile);

export default router;
