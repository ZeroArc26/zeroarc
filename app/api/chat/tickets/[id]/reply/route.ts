import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import { getCurrentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";
import { createAdminNotification } from "@/lib/notifications/createAdminNotification";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply text is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const ticket = await SupportTicket.findOne({ _id: id, userId: currentUser.id });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found." },
        { status: 404 }
      );
    }

    const reply = {
      sender: "customer" as const,
      senderName: currentUser.fullName || "Customer",
      text: text.trim(),
      createdAt: new Date(),
    };

    ticket.replies.push(reply);
    await ticket.save();

    await pusherServer.trigger(`ticket-${id}`, "new-reply", reply);
    await pusherServer.trigger("admin-tickets", "ticket-followup", {
      ticketId: id,
      ticketNumber: ticket.ticketNumber,
    });

    await createAdminNotification({
      type: "ticket",
      title: "Ticket Follow-up",
      message: `#${ticket.ticketNumber} — ${currentUser.fullName || "Customer"} added: "${text.trim().slice(0, 60)}"`,
      link: `/admin/dashboard/tickets`,
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("CUSTOMER TICKET REPLY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reply." },
      { status: 500 }
    );
  }
}
