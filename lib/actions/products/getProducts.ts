import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getProducts() {
  await connectDB();

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(products));
}