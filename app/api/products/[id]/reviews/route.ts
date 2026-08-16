import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { recalculateProductRating } from "@/lib/reviews/recalculateProductRating";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    const reviews = await Review.find({ productId: id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const current = await getCurrentUser();

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Please sign in to write a review." },
        { status: 401 }
      );
    }

    const { id: productId } = await params;
    const body = await req.json();
    const { rating, title, comment, images } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Please select a rating." },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Please write a review." },
        { status: 400 }
      );
    }

    const existing = await Review.findOne({
      productId,
      userId: current.id,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "You've already reviewed this product.",
        },
        { status: 409 }
      );
    }

    // Verified purchase: does this customer have a non-cancelled order
    // that contains this product?
    const purchaseOrder = await Order.findOne({
      "customer.email": current.email,
      "orderInfo.status": { $ne: "cancelled" },
      "items.productId": productId,
    });

    const review = await Review.create({
      productId,
      userId: current.id,
      customerName: current.fullName,
      rating,
      title: title?.trim() || "",
      comment: comment.trim(),
      images: Array.isArray(images) ? images.slice(0, 5) : [],
      verifiedPurchase: !!purchaseOrder,
    });

    await recalculateProductRating(productId);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review." },
      { status: 500 }
    );
  }
}
