import express from 'express';
import { authorise, authoriseRole } from '../middleware/auth.middleware.js';
import { changePassword } from '../controllers/profile.controllers.js';
import { deleteMyAccount, deleteUserById, getAllUsers, getCurrentUser, getUserById, getUserByWalletId, updateProfile } from '../controllers/user.controllers.js';

const router = express.Router();

// Profile management
router.get('/me', authorise, getCurrentUser);
router.get('/:userId', authorise, getUserById);
router.get('/', authorise, authoriseRole(["ADMIN"]), getAllUsers)
router.put('/me', authorise, changePassword);
router.delete("/me", authorise, deleteMyAccount);
router.delete('/:userId', authorise, authoriseRole(["ADMIN"]), deleteUserById);
router.put('/', authorise, updateProfile);
router.get('/wallet/:walletId', authorise, getUserByWalletId)

export default router;