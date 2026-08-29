import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const tickets = await SupportTicket.find({})
      .sort({ createdAt: -1 })
      .select("-transcript") // list view doesn't need the full transcript
      .lean();

    return NextResponse.json({
      success: true,
      tickets: tickets.map((t: any) => ({
        _id: t._id.toString(),
        ticketNumber: t.ticketNumber,
        customerName: t.customerName,
        customerEmail: t.customerEmail,
        conversationId: t.conversationId?.toString(),
        status: t.status,
        createdAt: t.createdAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN TICKETS LIST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load tickets." },
      { status: 500 }
    );
  }
}
