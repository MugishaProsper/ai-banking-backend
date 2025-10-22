import User from "../models/user.models.js";
import logger from "../config/logger.js";

export const changePassword = async (req, res) => {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(id);
        if(!user) {
            logger.error(`${id} failed to change password`)
            return res.status(404).json({ message : "User not found" });
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if(!isPasswordValid) return res.status(403).json({ message : "Incorrect password" });
        user.password = newPassword;
        await user.save();
        logger.info(`${id} changed password`)
        return res.status(200).json({ message : "Password changed successfully" })
    } catch (error) {
        logger.error(`${id} failed to change password`, error)
        return res.status(500).json({ message : "Internal server error" })
    }
}