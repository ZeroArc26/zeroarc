import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const revenueResult = await Order.aggregate([
  {
    $group: {
      _id: null,
      totalRevenue: {
        $sum: "$total",
      },
    },
  },
]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard stats.",
      },
      {
        status: 500,
      }
    );
  }
}