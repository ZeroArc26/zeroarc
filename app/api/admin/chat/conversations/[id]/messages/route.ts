import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import ChatMessage from "@/models/ChatMessage";
import { requireAdmin } from "@/lib/auth/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    const messages = await ChatMessage.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean();

    await ChatMessage.updateMany(
      { conversationId: id, sender: "customer", read: false },
      { $set: { read: true } }
    );
    await Conversation.findByIdAndUpdate(id, { unreadByAdmin: 0 });

    return NextResponse.json({
      success: true,
      messages: messages.map((m: any) => ({
        _id: m._id.toString(),
        sender: m.sender,
        senderName: m.senderName,
        text: m.text,
        createdAt: m.createdAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN CHAT MESSAGES ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load messages." },
      { status: 500 }
    );
  }
}
