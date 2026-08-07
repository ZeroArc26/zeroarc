import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getNewArrivalsFull() {
  await connectDB();

  const products = await Product.find({ "publish.status": "active" })
    .sort({ createdAt: -1 })
    .select("basicInfo pricing images publish variants averageRating reviewCount createdAt")
    .lean();

  return JSON.parse(JSON.stringify(products));
}