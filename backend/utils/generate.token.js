import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateTokenAndSetCookie = async (userId, res) => {
  try {
    const token = jwt.sign({ _id : userId }, process.env.jwt_secret, { expiresIn : "15d" });
    res.cookie('token', token, { sameSite : true, httpOnly : true, secure : process.env.NODE_ENV !== "development", maxAge : 5*24*60*60*1000 });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message : "Server error" });
  }
}