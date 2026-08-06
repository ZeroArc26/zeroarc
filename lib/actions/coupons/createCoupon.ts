"use server";

import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { couponSchema, type CouponFormInput } from "@/lib/validations/coupon.schema";

export async function createCoupon(data: CouponFormInput) {
  try {
    await connectDB();

    const validated = couponSchema.parse(data);

    const existing = await Coupon.findOne({
      code: validated.code.toUpperCase(),
    });

    if (existing) {
      return { success: false, message: "A coupon with this code already exists." };
    }

    const coupon = await Coupon.create({
      ...validated,
      code: validated.code.toUpperCase(),
      expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : undefined,
    });

    revalidatePath("/admin/dashboard/coupons");

    return {
      success: true,
      message: "Coupon created successfully.",
      data: JSON.parse(JSON.stringify(coupon)),
    };
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create coupon.",
    };
  }
}