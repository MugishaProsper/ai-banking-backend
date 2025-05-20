import User from "../models/user.models.js";
import { generateVerificationCode } from "../utils/generate.verification.code.js";
import { generateTokenAndSetCookie } from "../utils/generate.token.js";
import { sendVerificationCode } from "../config/email.config.js";
import VerificationCode from "../models/verification_code.models.js";
import { generateWalletAddress } from "../utils/generate.wallet.address.js";
import AppError from '../utils/AppError.js';
import { createAuditLog } from "../utils/auditLogger.js";
import { generateResetPassword } from "../utils/generate.reset.password.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      await user?.incrementLoginAttempts();
      return next(new AppError('Incorrect email or password', 401));
    }

    if (user.isLocked()) {
      return next(new AppError('Account is locked. Please try again later', 401));
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'LOGIN',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
      message: "Logged in successfully",
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { fullNames, username, email, phoneNumber, password } = req.body;
    console.log(req.body);
    if (!fullNames || !username || !email || !phoneNumber || !password) {
      console.log('Missing required fields');
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }]
    });
    console.log(existingUser);
    if (existingUser) {
      return next(new AppError('User already exists with this email, username, or phone number', 401));
    }

    // Generate wallet address
    const walletAddress = await generateWalletAddress();
    console.log(walletAddress);
    if (!walletAddress) {
      return next(new AppError('Failed to generate wallet address', 500));
    }

    // Create user
    const user = await User.create({
      fullNames,
      username,
      email,
      phoneNumber,
      password,
      walletAddress
    });

    // Generate verification code
    const code = await generateVerificationCode();
    const verification = new VerificationCode({
      userId: user._id,
      code: code,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send verification email and create audit log
    await Promise.all([
      verification.save(),
      sendVerificationCode(email, code),
      createAuditLog({
        userId: user._id,
        action: 'REGISTER',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { walletAddress }
      })
    ]);

    generateTokenAndSetCookie(user._id, res);
    return res.status(201).json({
      message: "Registration successful",
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Create audit log
    await createAuditLog({
      userId: req.user._id,
      action: 'LOGOUT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.cookie('jwt', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const verification = await VerificationCode.findOne({
      code: token,
      expiresAt: { $gt: Date.now() }
    });

    if (!verification) {
      return next(new AppError('Invalid or expired verification code', 400));
    }

    const user = await User.findById(verification.userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.isEmailVerified = true;
    await Promise.all([
      user.save(),
      VerificationCode.deleteOne({ _id: verification._id }),
      createAuditLog({
        userId: user._id,
        action: 'EMAIL_VERIFIED',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      })
    ]);

    return res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('No user found with that email address', 404));
    }

    // Generate reset token
    const resetToken = await generateResetPassword();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendVerificationCode(email, resetToken, 'password-reset');

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'PASSWORD_RESET_REQUESTED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email'
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired password reset token', 400));
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'PASSWORD_RESET',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user || !(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'PASSWORD_UPDATED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
