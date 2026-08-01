"use server";

import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function getCustomerStats() {
  try {
    await connectDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalCustomers,
      newCustomers,
      returningCustomers,
      revenue,
    ] = await Promise.all([
      Customer.countDocuments(),

      Customer.countDocuments({
        createdAt: {
          $gte: sevenDaysAgo,
        },
      }),

      Customer.countDocuments({
        totalOrders: {
          $gt: 1,
        },
      }),

      Customer.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalSpent",
            },
          },
        },
      ]),
    ]);

    return {
      success: true,

      data: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        totalRevenue:
          revenue[0]?.totalRevenue ?? 0,
      },
    };
      } catch (error) {
    console.error("Get Customer Stats Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch customer statistics.",

      data: {
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        totalRevenue: 0,
      },
    };
  }
}