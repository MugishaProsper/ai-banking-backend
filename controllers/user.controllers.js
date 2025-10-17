import User from "../models/user.models.js";

export const getCurrentUser = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({
            success: false,
            message: "User not found"
        });
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        console.log(error);
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
        if (!user) return res.status(404).json({
            success: false,
            message: "User not found"
        });
        return res.status(200).json({
            success: true,
            message: "User found", user: user
        })
    } catch (error) {
        console.log(error);
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
        return res.status(200).json({
            success: true,
            message: "Users found", users: users
        })
    } catch (error) {
        console.log(error);
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
        if (!user) return res.status(404).json({
            success: false,
            message: "User not found"
        });
        await user.deleteOne();
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        console.log(error);
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
        if (!user) return res.status(404).json({
            success: false,
            message: "User not found"
        });
        await user.deleteOne();
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        console.log(error);
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
        if (!user) return res.status(404).json({
            success: false,
            message: "User not found"
        });
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}