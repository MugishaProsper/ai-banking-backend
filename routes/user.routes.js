import express from 'express';
import { authorise } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { upload } from '../utils/fileUpload.js';
import {
  getProfile,
  updateProfile,
  getWalletAddress,
  uploadKycDocument,
  getKycStatus,
  deactivateAccount,
  reactivateAccount,
  getAuditLogs,
  getAllUsers,
  getUserById,
  deleteUser,
  getUserByEmail,
  getUserByUsername,
  getUserByRole,
  getUserByFullName
} from '../controllers/profile.controllers.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authorise);

// Profile management
router.get('/profile', getProfile);
router.patch('/profile', validate('updateProfile'), updateProfile);

// Wallet management
router.get('/wallet', getWalletAddress);

// KYC management
router.post('/kyc/upload', upload.single('file'), validate('kycUpload'), uploadKycDocument);
router.get('/kyc/status', getKycStatus);

// Account management
router.post('/deactivate', deactivateAccount);
router.post('/reactivate', reactivateAccount);

// Audit logs
router.get('/audit-logs', getAuditLogs);

// Admin routes
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', restrictTo('admin'), getUserById);
router.delete('/:id', restrictTo('admin'), deleteUser);
router.get('/email/:email', restrictTo('admin'), getUserByEmail);
router.get('/username/:username', restrictTo('admin'), getUserByUsername);
router.get('/role/:role', restrictTo('admin'), getUserByRole);
router.get('/name/:fullName', restrictTo('admin'), getUserByFullName);

export default router;