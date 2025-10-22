import User from "../models/user.models.js";

export const getCurrentUser = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            logger.error(`${id} failed to get user details`)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        logger.info(`${id} got user details`)
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        logger.error(`${id} failed to get user details`, error)
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
            logger.error(`${id} failed to get user details`)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        logger.info(`${id} got user details`)
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        logger.error(`${id} failed to get user details`, error)
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
        logger.info(`${req.user.id} got all users details`)
        return res.status(200).json({
            success: true,
            message: "Users found", users: users
        })
    } catch (error) {
        logger.error(`${req.user.id} failed to get all users details`, error)
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
        if (!user) return logger.error(`${id} failed to delete user account`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        await user.deleteOne();
        logger.info(`${id} deleted user account`)
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        logger.error(`${id} failed to delete user account`, error)
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
        if (!user) return logger.error(`${id} failed to delete user account`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        await user.deleteOne();
        logger.info(`${id} deleted user account`)
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        logger.error(`${id} failed to delete user account`, error)
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
        if (!user) return logger.error(`${id} failed to update profile`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        logger.info(`${id} updated profile`)
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })
    } catch (error) {
        logger.error(`${id} failed to update profile`, error)
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
        if (!user) return logger.error(`${walletId} failed to get user details`) && res.status(404).json({
            success: false,
            message: "User not found"
        });
        logger.info(`${walletId} got user details`)
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        logger.error(`${walletId} failed to get user details`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}