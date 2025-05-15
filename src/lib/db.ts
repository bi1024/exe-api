// db.js
import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoDbUri as string);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
