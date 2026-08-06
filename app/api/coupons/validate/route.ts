import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { code, subtotal, email } = await req.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon code." },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, message: "This coupon is no longer active." },
        { status: 400 }
      );
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "This coupon has expired." },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}.`,
        },
        { status: 400 }
      );
    }

    if (
      coupon.usageLimit !== undefined &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return NextResponse.json(
        { success: false, message: "This coupon has reached its usage limit." },
        { status: 400 }
      );
    }

    if (coupon.perCustomerLimit !== undefined && email) {
      const usage = coupon.usedBy.find(
        (u: any) => u.email === email.toLowerCase()
      );
      if (usage && usage.count >= coupon.perCustomerLimit) {
        return NextResponse.json(
          {
            success: false,
            message: "You've already used this coupon the maximum number of times.",
          },
          { status: 400 }
        );
      }
    }

    let discount =
      coupon.discountType === "percentage"
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue;

    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }

    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      success: true,
      discount,
      code: coupon.code,
      message: "Coupon applied successfully.",
    });
  } catch (error) {
    console.error("Coupon Validate Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate coupon." },
      { status: 500 }
    );
  }
}