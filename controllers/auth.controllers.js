import logger from "../config/logger.js";
import User from "../models/user.models.js";
import { generateAuthTokens } from "../utils/generate.token.js";

export const register = async (req, res) => {
    const { fullname, username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            logger.error(`${username} or ${email} already exists`)
            return res.status(403).json({
                success: false,
                message: "User already exists"
            });
        }
        const user = new User({ fullname, username, email, password });
        await user.save();
        logger.info(`${user._id} registered`)
        return res.status(201).json({
            success: true,
            message: "User created",
            user: user
        })
    } catch (error) {
        logger.error(`${email} failed to register`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email }).select("-role");
        if (!user) {
            logger.error(`User with ${email} not found`)
            return res.status(404).json({
                success: false,
                message: "No user with such credentials"
            })
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            logger.error(`${user._id} failed to login`)
            return res.status(404).json({
                success: false,
                message: "Incorrect credentials"
            });
        }
        const { refreshToken, accessToken } = await generateAuthTokens(user._id, res);
        logger.info(`${user._id} logged in`);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        logger.error(`${email} failed to login`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const logout = async (req, res) => {
    const { id } = req.user;
    if (!id) return res.status(403).json({
        success: false,
        message: "You should be logged in to logout"
    })
    try {
        logger.info(`${id} logged out`);
        return res.clearCookie("token")
            .status(200).json({
                success: true,
                message: "Logged out"
            });
    } catch (error) {
        logger.error(`${id} failed to logout`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.headers.authorization.split(" ")[1];
    try {
        if (!refreshToken || typeof (refreshToken) == "undefined") {
            return res.status(404).json({
                success: false,
                message: 'No token provided'
            });
        };
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            logger.error(`${decoded.id} failed to refresh token`)
            return res.status(404).json({
                success: false,
                message: 'No user found with this token'
            });
        }
        const { refreshToken: newRefreshToken, accessToken: newAccessToken } = await generateAuthTokens(user._id, res);
        logger.info(`${user._id} token refreshed`);
        return res.status(200).json({
            success: true,
            message: "Token refreshed",
            user: user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        logger.error(`${decoded.id} failed to refresh token`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}