import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SiteReview from "@/models/SiteReview";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentAdmin } from "@/lib/auth/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
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

    const { id } = await params;

    const review = await SiteReview.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    if (review.userId.toString() !== current.id) {
      return NextResponse.json(
        { success: false, message: "You can only edit your own review." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Please select a rating." },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Please share a few words." },
        { status: 400 }
      );
    }

    review.rating = rating;
    review.comment = comment.trim();
    await review.save();

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

    const { id } = await params;

    const review = await SiteReview.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    const admin = await getCurrentAdmin();
    const current = await getCurrentUser();

    const isOwner = current && review.userId.toString() === current.id;

    if (!admin && !isOwner) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await SiteReview.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
