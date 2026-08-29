import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import { requireAdmin } from "@/lib/auth/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;
    const ticket = await SupportTicket.findById(id).lean<any>();

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket: {
        _id: ticket._id.toString(),
        ticketNumber: ticket.ticketNumber,
        customerName: ticket.customerName,
        customerEmail: ticket.customerEmail,
        conversationId: ticket.conversationId?.toString(),
        status: ticket.status,
        createdAt: ticket.createdAt,
        mainProblem: ticket.mainProblem,
        transcript: ticket.transcript || [],
        replies: ticket.replies || [],
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN TICKET DETAIL ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load ticket." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;
    const { status } = await request.json();

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status." },
        { status: 400 }
      );
    }

    const ticket = await SupportTicket.findByIdAndUpdate(id, { status }, { new: true });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN TICKET UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update ticket." },
      { status: 500 }
    );
  }
}
