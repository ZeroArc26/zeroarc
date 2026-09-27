import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import AdminNotification from "@/models/AdminNotification";
import { requireAdmin } from "@/lib/auth/admin";

interface NotificationLean {
  _id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const notifications = await AdminNotification.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean<NotificationLean[]>();

    const unreadCount = await AdminNotification.countDocuments({ read: false });

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: notifications.map((n) => ({
        _id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        read: n.read,
        createdAt: n.createdAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    if (message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    console.error("ADMIN NOTIFICATIONS LIST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load notifications." },
      { status: 500 }
    );
  }
}
