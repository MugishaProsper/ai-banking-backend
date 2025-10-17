import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken
} from '../controllers/auth.controllers.js';
import { authorise } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authorise, logout);

export default router;