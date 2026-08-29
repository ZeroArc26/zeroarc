import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const tickets = await SupportTicket.find({ userId: currentUser.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      tickets: tickets.map((t: any) => ({
        _id: t._id.toString(),
        ticketNumber: t.ticketNumber,
        status: t.status,
        createdAt: t.createdAt,
        mainProblem: t.mainProblem,
        replies: t.replies || [],
      })),
    });
  } catch (error) {
    console.error("MY TICKETS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load tickets." },
      { status: 500 }
    );
  }
}
