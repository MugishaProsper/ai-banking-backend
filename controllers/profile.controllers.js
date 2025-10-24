import User from "../models/user.models.js";
import logger from "../config/logger.js";

export const changePassword = async (req, res) => {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            logger.error(`Failed to change password of ${id}`)
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) return res.status(403).json({ message: "Incorrect password" });
        user.password = newPassword;
        await user.save();
        logger.info(`Changed password of ${id}`)
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        logger.error(`Failed to change password of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export const updateProfilePicture = async (req, res) => {
    const { id } = req.user;
    const { profilePicture } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            logger.error(`Failed to update profile picture of ${id}`)
            return res.status(404).json({ message: "User not found" });
        }
        user.profilePicture = profilePicture;
        await user.save();
        logger.info(`Updated profile picture of ${id}`)
        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully"
        })
    } catch (error) {
        logger.error(`Failed to update profile picture of ${id}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}