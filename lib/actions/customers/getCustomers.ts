"use server";

import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

interface GetCustomersOptions {
  search?: string;
  status?: "active" | "blocked";
  page?: number;
  limit?: number;
}

export async function getCustomers({
  search = "",
  status,
  page = 1,
  limit = 10,
}: GetCustomersOptions = {}) {
  try {
    await connectDB();

    const query: Record<string, unknown> = {};

    // Search
    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Status Filter
    if (status) {
      query.status = status;
    }

    const totalCustomers = await Customer.countDocuments(query);

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(customers)),

      pagination: {
        total: totalCustomers,
        page,
        limit,
        totalPages: Math.ceil(totalCustomers / limit),
      },
    };
  } catch (error) {
    console.error("Get Customers Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch customers.",
    };
  }
}