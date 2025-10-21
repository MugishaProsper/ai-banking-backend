import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI).then(() => { 
      logger.info("✅ Connected to MongoDB");
    })
  } catch (error) {
    logger.error("❌ Could not connect to MongoDB : ", error);
    return -1;
  }
}