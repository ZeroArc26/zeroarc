import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import ChatMessage from "@/models/ChatMessage";
import { requireAdmin } from "@/lib/auth/admin";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const { conversationId, text } = await request.json();

    if (!conversationId || !text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message text is required." },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }

    const message = await ChatMessage.create({
      conversationId,
      sender: "admin",
      senderName: admin?.name || "ZeroArc Support",
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    conversation.unreadByCustomer += 1;
    await conversation.save();

    const payload = {
      _id: message._id.toString(),
      sender: message.sender,
      senderName: message.senderName,
      text: message.text,
      createdAt: message.createdAt,
    };

    await pusherServer.trigger(`conversation-${conversationId}`, "new-message", payload);

    return NextResponse.json({ success: true, message: payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : undefined;
    if (msg === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN CHAT REPLY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reply." },
      { status: 500 }
    );
  }
}
