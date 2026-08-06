"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function deleteCoupon(id: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid coupon ID." };
    }

    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return { success: false, message: "Coupon not found." };
    }

    revalidatePath("/admin/dashboard/coupons");

    return { success: true, message: "Coupon deleted successfully." };
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    return { success: false, message: "Failed to delete coupon." };
  }
}