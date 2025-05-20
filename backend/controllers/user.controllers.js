import { sendVerificationCode } from '../config/email.config.js';
import User from '../models/user.models.js';

export const updateProfile = async (req, res) => {
  const { userId } = req.user;
  const { firstName, lastName, username, email } = req.body;
  try {
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message : "User not found" });
    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.username = username ? username : user.username;
    if(email){
      await sendVerificationCode(email)
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message : "Internal Server error" })
  }
}