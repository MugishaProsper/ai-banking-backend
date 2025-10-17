import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv()

export const generateAuthTokens = async (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role,
      email: user.email
    }
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    return { refreshToken, accessToken }
  } catch (error) {
    throw new Error(error)
  }
};