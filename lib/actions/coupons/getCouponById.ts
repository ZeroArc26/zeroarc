"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function getCouponById(id: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid coupon ID." };
    }

    const coupon = await Coupon.findById(id).lean();

    if (!coupon) {
      return { success: false, message: "Coupon not found." };
    }

    return { success: true, data: JSON.parse(JSON.stringify(coupon)) };
  } catch (error) {
    console.error("Get Coupon By ID Error:", error);
    return { success: false, message: "Failed to fetch coupon." };
  }
}