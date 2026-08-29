import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const conversations = await Conversation.find({})
      .sort({ lastMessageAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      conversations: conversations.map((c: any) => ({
        _id: c._id.toString(),
        customerName: c.customerName,
        customerEmail: c.customerEmail,
        status: c.status,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        unreadByAdmin: c.unreadByAdmin,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN CHAT LIST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load conversations." },
      { status: 500 }
    );
  }
}
