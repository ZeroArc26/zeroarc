import connectDB from "@/lib/mongodb";

import Category from "@/models/Category";
import Product from "@/models/Product";

export async function getDashboardStats() {
  await connectDB();

  const totalCategories =
    await Category.countDocuments();

  const totalProducts =
    await Product.countDocuments();

  return {
    revenue: 0,
    orders: 0,
    products: totalProducts,
    customers: 0,
    categories: totalCategories,
  };
}