import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getNewArrivalProducts(limit = 10) {
  await connectDB();

  const products = await Product.find({
    "publish.status": "active",
    "publish.visibility": { $ne: "hidden" },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("basicInfo pricing images publish variants createdAt")
    .lean();

  return JSON.parse(JSON.stringify(products));
}