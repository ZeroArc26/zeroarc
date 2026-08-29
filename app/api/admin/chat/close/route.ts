import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "conversationId is required." },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { status: "closed" },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN CHAT CLOSE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to close conversation." },
      { status: 500 }
    );
  }
}
