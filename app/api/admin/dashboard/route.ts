import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const [
      totalProducts,
      totalOrders,
      products,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),

      Order.countDocuments(),

      Product.find(),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

        const totalRevenue = recentOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const lowStockProducts = products.filter(
      (product) => product.stock <= 5
    );

    return NextResponse.json({
      success: true,

      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStockProducts: lowStockProducts.length,
      },

      recentOrders,

      lowStockProducts: lowStockProducts.slice(0, 5),
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}