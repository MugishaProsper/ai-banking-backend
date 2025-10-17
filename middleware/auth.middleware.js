import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

import { configDotenv } from 'dotenv';

configDotenv()

export const authorise = async (req, res, next) => {
  try {
    const { accessToken } = req.headers.authorization.split(" ")[1];
    if (!accessToken || typeof (accessToken) == "undefined") {
      return res.status(404).json({
        success: false,
        message: 'No token provided'
      });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this token'
      });
    }
    req.user = user
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const authoriseRole = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(402).json({
        success: false,
        message: "Login to access this resource"
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access here man"
      });
    }
    next();
  }
}