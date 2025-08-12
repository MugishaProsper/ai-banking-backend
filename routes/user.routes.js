import express from 'express';
import { authorise } from '../middleware/auth.middleware.js';
import { getLoggedInUser } from '../controllers/profile.controllers.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authorise);

// Profile management
router.get('/me', getLoggedInUser);

export default router;