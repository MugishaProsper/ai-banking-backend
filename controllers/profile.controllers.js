import User from "../models/user.models.js";
import { logout } from "./auth.controllers.js";
import AppError from "../utils/AppError.js";
import { createAuditLog } from "../utils/auditLogger.js";
import { uploadToCloudinary } from "../utils/fileUpload.js";

export const updateProfile = async (req, res, next) => {
  try {
    const { fullNames, phoneNumber, preferredLanguage, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullNames,
        phoneNumber,
        preferredLanguage,
        address
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'PROFILE_UPDATED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { updatedFields: Object.keys(req.body) }
    });

    return res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const getWalletAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (!user.walletAddress) {
      return next(new AppError('Wallet address not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadKycDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a document', 400));
    }

    const { documentType, documentNumber } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Upload to Cloudinary
    const documentUrl = await uploadToCloudinary(req.file, `kyc/${user._id}`);

    // Add document to user's KYC documents
    user.kycDocuments.push({
      type: documentType,
      documentNumber,
      documentUrl,
      uploadedAt: new Date()
    });

    // Update KYC status
    user.kycStatus = 'in_progress';
    await user.save();

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'KYC_DOCUMENT_UPLOADED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { documentType }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: { kycStatus: user.kycStatus }
    });
  } catch (error) {
    next(error);
  }
};

export const getKycStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        kycStatus: user.kycStatus,
        documents: user.kycDocuments
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'ACCOUNT_DEACTIVATED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      status: 'success',
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const reactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Create audit log
    await createAuditLog({
      userId: user._id,
      action: 'ACCOUNT_REACTIVATED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      status: 'success',
      message: 'Account reactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        auditLogs: user.auditLogs
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" })
    await user.remove();
    await logout(res);
    // Clear the cookie
    res.clearCookie("jwt");
    // Optionally, you can also clear the session or any other authentication tokens
    return res.status(200).json({ message: "Profile deleted successfully" });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) return res.status(404).json({ message: "No users found" })
    return res.status(200).json({ users })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.status(200).json({ user })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" })
    await user.remove();
    return res.status(200).json({ message: "User deleted successfully" });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.find({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.status(200).json({ user })
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.find({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.status(200).json({ user })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const getUserByRole = async (req, res) => {
  const { role } = req.params;

  try {
    const user = await User.find({ role }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.status(200).json({ user })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}

export const getUserByFullName = async (req, res) => {
  const { fullName } = req.params;

  try {
    const user = await User.find({ fullName }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" })
  }
}
