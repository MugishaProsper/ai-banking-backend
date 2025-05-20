import { User } from "../models/user.models.js"

export const updateProfile = async (user, updatedProfile) => {
  try {
    const user_to_update = await User.findById(user._id);
    if (!user_to_update) return false;
    user_to_update = updatedProfile;
    await user_to_update.save()
    return true
  } catch (error) {
    console.log(error)
    return false
  }
} 