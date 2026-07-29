import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

export async function getProductById(id: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    return null;
  }

  return JSON.parse(JSON.stringify(product));
}