import { User } from "../models/user.models.js";
import bcrypt from 'bcryptjs'
import { generateVerificationCode } from "../utils/generate.verification.code.js";
import { generateTokenAndSetCookie } from "../utils/generate.token.js";
import { sendVerificationCode } from "../config/email.config.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({ message : "No user found" });
    };
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({ message : "Password incorrect" });
    };
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({ message : "Logged in successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.findOne({ email : email });
    if(user){
      return res.status(401).json({ message : "User already exists" });
    };
    const verificationCode = await generateVerificationCode();
    await sendVerificationCode(email, verificationCode);
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ firstName, lastName, email, password : hashedPassword });
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message : "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', process.env.jwt_secret, { maxAge : 0 });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message : "Error logging out" });
  }
}

export const verifyCode = async (req, res) => {
  const userId = req.user._id;
  const { code } = req.body;
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message : "No user found" })
    };
    if(!(user.verificationCode === code)){
      return res.status(401).json({ message : "Codes do not match" });
    };
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message : "Verified successfully" })
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
};