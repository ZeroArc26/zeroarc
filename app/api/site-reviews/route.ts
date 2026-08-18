import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SiteReview from "@/models/SiteReview";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const reviews = await SiteReview.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const current = await getCurrentUser();

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Please sign in to share your experience." },
        { status: 401 }
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

    const existing = await SiteReview.findOne({ userId: current.id });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "You've already shared your experience.",
        },
        { status: 409 }
      );
    }

    const review = await SiteReview.create({
      userId: current.id,
      customerName: current.fullName,
      rating,
      comment: comment.trim(),
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to submit your review." },
      { status: 500 }
    );
  }
}
