import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => { console.log("✅ Connected to MongoDB") })
  } catch (error) {
    console.log("❌ Could not connect : ",error);
    return -1;
  }
}