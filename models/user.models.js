import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';

const userSchema = mongoose.Schema({
  fullNames: { type: String, required: [true, 'Full name is required'], trim: true },
  username: { type: String, required: [true, 'Username is required'], unique: true, trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, validate: [validator.isEmail, 'Please provide a valid email'] },
  phoneNumber: { type: String, required: [true, 'Phone number is required'], unique: true,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  passwordChangedAt: Date,
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER", "BANK_STAFF"],
    default: "USER",
    select: false
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocuments: [{
    type: {
      type: String,
      enum: ['id_card', 'passport', 'drivers_license', 'utility_bill', 'bank_statement']
    },
    documentNumber: String,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadedAt: Date,
    verifiedAt: Date
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  auditLogs: [{
    action: String,
    timestamp: Date,
    ipAddress: String,
    userAgent: String,
    details: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ 'kycDocuments.documentNumber': 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return await this.updateOne(updates);
};

userSchema.methods.addAuditLog = async function (action, ipAddress, userAgent, details = {}) {
  this.auditLogs.push({
    action,
    timestamp: new Date(),
    ipAddress,
    userAgent,
    details
  });
  return await this.save();
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;