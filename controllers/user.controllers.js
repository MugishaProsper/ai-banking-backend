import User from "../models/user.models.js";
import logger from "../config/logger.js";

export const getCurrentUser = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            logger.error(`Failed to get user details of ${id}`)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        logger.info(`Got user details of ${id}`)
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        logger.error(`Failed to get user details of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            logger.error(`Failed to get user details of ${id}`)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        logger.info(`Got user details of ${id}`)
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        logger.error(`Failed to get user details of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        logger.info(`Got all users details of ${req.user.id}`)
        return res.status(200).json({
            success: true,
            message: "Users found", users: users
        })
    } catch (error) {
        logger.error(`Failed to get all users details of ${req.user.id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export const deleteMyAccount = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id);
        if (!user) return logger.error(`Failed to delete user account of ${id}`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        await user.deleteOne();
        logger.info(`Deleted user account of ${id}`)
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        logger.error(`Failed to delete user account of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return logger.error(`Failed to delete user account of ${id}`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        await user.deleteOne();
        logger.info(`Deleted user account of ${id}`)
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        logger.error(`Failed to delete user account of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const updateProfile = async (req, res) => {
    const { id } = req.user;
    const { name, email } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) return logger.error(`Failed to update profile of ${id}`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        logger.info(`Updated profile of ${id}`)
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })
    } catch (error) {
        logger.error(`Failed to update profile of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getUserByWalletId = async (req, res) => {
    const { walletId } = req.params;
    try {
        const user = await User.findOne({ walletId: walletId });
        if (!user) return logger.error(`Failed to get user details of ${walletId}`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        logger.info(`Got user details of ${walletId}`)
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        logger.error(`Failed to get user details of ${walletId}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}