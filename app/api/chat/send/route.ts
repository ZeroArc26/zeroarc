import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import ChatMessage from "@/models/ChatMessage";
import { getCurrentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";
import { generateAutoReply } from "@/lib/ai/ruleBasedChatBot";
import { raiseSupportTicket } from "@/lib/chat/raiseSupportTicket";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { conversationId, text } = await request.json();

    if (!conversationId || !text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message text is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: currentUser.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }

    const message = await ChatMessage.create({
      conversationId,
      sender: "customer",
      senderName: currentUser.fullName || "Customer",
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    conversation.unreadByAdmin += 1;
    conversation.status = "open";
    await conversation.save();

    const payload = {
      _id: message._id.toString(),
      sender: message.sender,
      senderName: message.senderName,
      text: message.text,
      createdAt: message.createdAt,
    };

    // Push to whoever has this specific conversation open...
    await pusherServer.trigger(`conversation-${conversationId}`, "new-message", payload);
    // ...and ping the admin inbox so the conversation list/badge updates
    // even if no admin currently has this specific chat open.
    await pusherServer.trigger("admin-chat", "new-message", {
      conversationId,
      ...payload,
    });

    // The "Raise Support Ticket" quick-reply sends this exact phrase —
    // intercept it here and actually create the ticket, skipping the
    // normal FAQ rule matching entirely.
    if (text.trim().toLowerCase() === "raise support ticket") {
      try {
        await raiseSupportTicket(conversationId, currentUser);
      } catch (ticketError) {
        console.error("Ticket creation failed:", ticketError);
      }
      return NextResponse.json({ success: true, message: payload });
    }

    // Try a rule-based auto-reply for common FAQ-type questions (no
    // external AI service — pure keyword matching, so it never fails
    // due to API keys, billing, or model deprecations). This never
    // blocks the customer's own message from sending — if no rule
    // matches, the conversation just waits for a human, same as
    // before this feature existed. unreadByAdmin is left as-is so
    // admins still see it in their queue even if the bot answered.
    try {
      const aiResult = await generateAutoReply(text.trim(), currentUser.fullName);

      if (aiResult.canAnswer && aiResult.reply) {
        const aiMessage = await ChatMessage.create({
          conversationId,
          sender: "ai",
          senderName: "ZeroArc AI Assistant",
          text: aiResult.reply,
          quickReplies: aiResult.quickReplies || [],
        });

        conversation.lastMessage = aiResult.reply;
        conversation.lastMessageAt = new Date();
        if (aiResult.shouldClose) {
          conversation.status = "closed";
        }
        await conversation.save();

        const aiPayload = {
          _id: aiMessage._id.toString(),
          sender: aiMessage.sender,
          senderName: aiMessage.senderName,
          text: aiMessage.text,
          createdAt: aiMessage.createdAt,
          quickReplies: aiMessage.quickReplies,
        };

        await pusherServer.trigger(`conversation-${conversationId}`, "new-message", aiPayload);
        await pusherServer.trigger("admin-chat", "new-message", {
          conversationId,
          ...aiPayload,
        });
      }
    } catch (aiError) {
      console.error("Auto-reply failed (non-blocking):", aiError);
    }

    return NextResponse.json({ success: true, message: payload });
  } catch (error) {
    console.error("CHAT SEND ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 }
    );
  }
}
