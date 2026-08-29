import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import ChatMessage from "@/models/ChatMessage";
import { getCurrentUser } from "@/lib/auth";
import { generateAutoReply } from "@/lib/ai/ruleBasedChatBot";

export async function POST() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to start a chat." },
        { status: 401 }
      );
    }

    await connectDB();

    let conversation = await Conversation.findOne({
      userId: currentUser.id,
      status: "open",
    });

    let isNewConversation = false;

    if (!conversation) {
      // Any old conversation(s) are left as-is in the database (soft
      // delete) — they stay visible to admins in the Live Chat inbox
      // for history/reference, just no longer shown to the customer
      // since a brand-new conversation gets a fresh ID here.
      conversation = await Conversation.create({
        userId: currentUser.id,
        customerName: currentUser.fullName || "Customer",
        customerEmail: currentUser.email || "",
      });
      isNewConversation = true;
    }

    // First time this conversation exists — send a welcome greeting so
    // the widget never opens to a blank screen. Reuses the same
    // rule-based bot as regular messages, so the quick-reply menu is
    // consistent everywhere.
    if (isNewConversation) {
      const greeting = await generateAutoReply("hi", currentUser.fullName);

      if (greeting.reply) {
        const greetingMessage = await ChatMessage.create({
          conversationId: conversation._id,
          sender: "ai",
          senderName: "ZeroArc AI Assistant",
          text: greeting.reply,
          quickReplies: greeting.quickReplies || [],
        });

        conversation.lastMessage = greetingMessage.text;
        conversation.lastMessageAt = new Date();
        await conversation.save();
      }
    }

    const messages = await ChatMessage.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    // Opening the widget marks admin replies as read.
    await ChatMessage.updateMany(
      { conversationId: conversation._id, sender: "admin", read: false },
      { $set: { read: true } }
    );
    conversation.unreadByCustomer = 0;
    await conversation.save();

    return NextResponse.json({
      success: true,
      conversationId: conversation._id.toString(),
      messages: messages.map((m: any) => ({
        _id: m._id.toString(),
        sender: m.sender,
        senderName: m.senderName,
        text: m.text,
        createdAt: m.createdAt,
        quickReplies: m.quickReplies,
      })),
    });
  } catch (error) {
    console.error("CHAT START ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Could not start chat." },
      { status: 500 }
    );
  }
}
