import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  try {
    console.log("Mongo URI:", MONGODB_URI);

    const conn = await mongoose.connect(MONGODB_URI);

    console.log("✅ Mongo Connected");

    return conn;
  } catch (err) {
    console.error("❌ Mongo Error:", err);
    throw err;
  }
}