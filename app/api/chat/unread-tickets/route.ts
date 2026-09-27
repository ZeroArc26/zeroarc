import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ success: false, tickets: [] }, { status: 401 });
    }

    await connectDB();

    const tickets = await SupportTicket.find({
      userId: currentUser.id,
      hasUnreadReply: true,
    }).lean<{ _id: string; ticketNumber: string; replies: { text: string }[] }[]>();

    // Mark as seen immediately so the same reply doesn't surface again
    // on the next page load.
    if (tickets.length > 0) {
      await SupportTicket.updateMany(
        { userId: currentUser.id, hasUnreadReply: true },
        { $set: { hasUnreadReply: false } }
      );
    }

    return NextResponse.json({
      success: true,
      tickets: tickets.map((t) => ({
        ticketId: t._id.toString(),
        ticketNumber: t.ticketNumber,
        text: t.replies[t.replies.length - 1]?.text || "",
      })),
    });
  } catch (error) {
    console.error("UNREAD TICKETS ERROR:", error);
    return NextResponse.json({ success: false, tickets: [] }, { status: 500 });
  }
}
