import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
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

    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "conversationId is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await raiseSupportTicket(conversationId, currentUser);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("RAISE TICKET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to raise ticket." },
      { status: 500 }
    );
  }
}
