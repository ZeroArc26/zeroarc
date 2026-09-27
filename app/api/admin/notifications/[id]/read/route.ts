import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import AdminNotification from "@/models/AdminNotification";
import { requireAdmin } from "@/lib/auth/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;
    await AdminNotification.findByIdAndUpdate(id, { read: true });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("MARK NOTIFICATION READ ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification." },
      { status: 500 }
    );
  }
}
