"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { couponSchema, type CouponFormInput } from "@/lib/validations/coupon.schema";

export async function updateCoupon(id: string, data: CouponFormInput) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid coupon ID." };
    }

    const validated = couponSchema.parse(data);

    const existing = await Coupon.findOne({
      code: validated.code.toUpperCase(),
      _id: { $ne: id },
    });

    if (existing) {
      return { success: false, message: "A coupon with this code already exists." };
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        ...validated,
        code: validated.code.toUpperCase(),
        expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : undefined,
      },
      { new: true }
    );

    if (!coupon) {
      return { success: false, message: "Coupon not found." };
    }

    revalidatePath("/admin/dashboard/coupons");

    return {
      success: true,
      message: "Coupon updated successfully.",
      data: JSON.parse(JSON.stringify(coupon)),
    };
  } catch (error) {
    console.error("Update Coupon Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update coupon.",
    };
  }
}