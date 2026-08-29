import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import { requireAdmin } from "@/lib/auth/admin";
import { pusherServer } from "@/lib/pusher/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const { id } = await params;
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply text is required." },
        { status: 400 }
      );
    }

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found." },
        { status: 404 }
      );
    }

    const reply = {
      sender: "admin" as const,
      senderName: admin?.name || "ZeroArc Support",
      text: text.trim(),
      createdAt: new Date(),
    };

    ticket.replies.push(reply);
    // A reply from the team usually means work is underway.
    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }
    await ticket.save();

    await pusherServer.trigger(`ticket-${id}`, "new-reply", reply);

    return NextResponse.json({ success: true, reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN TICKET REPLY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reply." },
      { status: 500 }
    );
  }
}
