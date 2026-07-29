import connectDB from "@/lib/mongodb";

import Category from "@/models/Category";
import Product from "@/models/Product";


export async function getDashboardStats() {

  await connectDB();


  const totalCategories =
    await Category.countDocuments();


  const totalProducts =
    await Product.countDocuments();


  const topProducts =
    await Product.find()
      .sort({
        soldCount: -1,
      })
      .limit(5)
      .lean();

      const lowStockProducts =
  await Product.find({
    "inventory.quantity": {
      $lte: 5,
    },
  })
    .limit(5)
    .lean();

  return {
  revenue: 0,
  orders: 0,
  products: totalProducts,
  customers: 0,
  categories: totalCategories,

  topProducts: JSON.parse(
    JSON.stringify(topProducts)
  ),

  lowStockProducts: JSON.parse(
    JSON.stringify(lowStockProducts)
  ),
};
}