import connectDB from "@/lib/mongodb";

import Category from "@/models/Category";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function getDashboardStats() {
  await connectDB();

  const totalCategories = await Category.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$pricing.grandTotal" },
      },
    },
  ]);

  const totalRevenue =
    revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  const distinctCustomers = await Order.distinct("customer.email");
  const totalCustomers = distinctCustomers.filter(Boolean).length;

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    products: totalProducts,
    customers: totalCustomers,
    categories: totalCategories,
  };
}