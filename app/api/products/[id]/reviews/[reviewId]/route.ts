import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { recalculateProductRating } from "@/lib/reviews/recalculateProductRating";

interface RouteParams {
  params: Promise<{ id: string; reviewId: string }>;
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: productId, reviewId } = await params;

    const review = await Review.findOne({
      _id: reviewId,
      productId,
    });

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    await Review.findByIdAndDelete(reviewId);
    await recalculateProductRating(productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
