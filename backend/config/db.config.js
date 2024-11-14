import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = () => {
  try {
    mongoose.connect(`${process.env.mongo_url}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
}