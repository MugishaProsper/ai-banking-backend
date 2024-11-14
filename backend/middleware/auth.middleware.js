import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.models';

dotenv.config();

export const authorise = async (req, res) => {
  const token = req.cookies.jwt;
  try {
    if(!token){
      return res.status(401).json({ message : "No token provided" });
    };
    const decoded = jwt.verify(token, process.env.jwt_secret);
    if(!decoded){
      return res.status(403).json({ message : "No such user found" });
    };

    const user = await User.findById(decoded._id).select("-password");
    if(!user){
      return res.status(404).json({ message : "No user found with this token" });
    }
    req.user = user;
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
}