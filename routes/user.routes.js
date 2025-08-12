import express from 'express';
import { authorise } from '../middleware/auth.middleware.js';
import { changePassword, getLoggedInUser } from '../controllers/profile.controllers.js';

const router = express.Router();

// Profile management
router.get('/me', authorise, getLoggedInUser);
router.put('/me', authorise, changePassword);

export default router;