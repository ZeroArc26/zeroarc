import mongoose from "mongoose";

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  console.log("Mongo URI:", MONGODB_URI);

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  const conn = await mongoose.connect(MONGODB_URI);

  console.log("✅ Mongo Connected");

  return conn;
}