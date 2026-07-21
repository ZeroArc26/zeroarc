import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Dashboard Stats
    const totalOrders = await Order.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalUsers = await User.countDocuments();

    // Total Revenue
    const revenueData = await Order.aggregate([
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
      revenueData.length > 0
        ? revenueData[0].totalRevenue
        : 0;

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // Monthly Revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$total",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,

      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
      },

      recentOrders,

      monthlyRevenue,
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