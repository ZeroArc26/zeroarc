"use server";

import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

interface GetCouponsOptions {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getCoupons({
  search = "",
  page = 1,
  limit = 10,
}: GetCouponsOptions = {}) {
  try {
    await connectDB();

    const query: Record<string, unknown> = {};

    if (search.trim()) {
      query.code = { $regex: search, $options: "i" };
    }

    const total = await Coupon.countDocuments(query);

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(coupons)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get Coupons Error:", error);
    return { success: false, message: "Failed to fetch coupons." };
  }
}