import express from 'express';
import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../controllers/auth.controllers.js';
import { authorise } from '../middleware/auth.middleware.js';
import { loginLimiter } from '../middleware/security.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', validate('register'), register);
router.post('/login', loginLimiter, validate('login'), login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', validate('forgotPassword'), forgotPassword);
router.post('/reset-password/:token', validate('resetPassword'), resetPassword);

// Protected routes
router.post('/logout', authorise, logout);
router.patch('/update-password', authorise, validate('updatePassword'), updatePassword);

export default router;