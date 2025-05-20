import express from 'express';
import { register, login, logout } from '../controllers/auth.controllers.js';
import { authorise } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/protected-route', authorise, (req, res) => {
  console.log(req.user)
  return res.status(200).json({ message : `Welcome ${req.user} to the protected route 👋👋`})
})

export default router;