import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { getCurrentUser } from "@/lib/auth";
import { recalculateProductRating } from "@/lib/reviews/recalculateProductRating";

interface RouteParams {
  params: Promise<{ id: string; reviewId: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const current = await getCurrentUser();

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Please sign in." },
        { status: 401 }
      );
    }

    const { id: productId, reviewId } = await params;

    const review = await Review.findOne({ _id: reviewId, productId });

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    // Only the customer who wrote it can edit it — not even admins,
    // since rewriting someone else's words isn't the same as removing
    // an inappropriate review (which admin delete already covers).
    if (review.userId.toString() !== current.id) {
      return NextResponse.json(
        { success: false, message: "You can only edit your own review." },
        { status: 403 }
      );
    }

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

    review.rating = rating;
    review.title = title?.trim() || "";
    review.comment = comment.trim();
    review.images = Array.isArray(images) ? images.slice(0, 5) : review.images;
    await review.save();

    await recalculateProductRating(productId);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update review." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

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

    // Either the review's own author, or an admin, can delete it.
    const admin = await getCurrentAdmin();
    const current = await getCurrentUser();

    const isOwner = current && review.userId.toString() === current.id;

    if (!admin && !isOwner) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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
