import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import AdminNotification from "@/models/AdminNotification";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST() {
  try {
    await requireAdmin();
    await connectDB();

    await AdminNotification.updateMany({ read: false }, { $set: { read: true } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("MARK ALL NOTIFICATIONS READ ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notifications." },
      { status: 500 }
    );
  }
}
