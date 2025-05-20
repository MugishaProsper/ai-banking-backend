import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.local_database_url}`).then(() => { console.log("Connected to MongoDB") })
  } catch (error) {
    console.log(error);
  }
}