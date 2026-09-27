import connectDB from "@/lib/mongodb";
import AdminNotification from "@/models/AdminNotification";
import { pusherServer } from "@/lib/pusher/server";

interface CreateNotificationInput {
  type: "order" | "low_stock" | "customer" | "chat" | "ticket";
  title: string;
  message: string;
  link?: string;
}

/**
 * Creates a persistent admin notification and pushes it live to any
 * open admin panel tabs. Never throws — a notification failing to
 * send should never block the real action (order/ticket/etc.) that
 * triggered it, so callers can safely fire-and-forget this.
 */
export async function createAdminNotification(input: CreateNotificationInput) {
  try {
    await connectDB();

    const notification = await AdminNotification.create({
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link || "",
    });

    const payload = {
      _id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      read: false,
      createdAt: notification.createdAt,
    };

    await pusherServer.trigger("admin-notifications", "new-notification", payload);

    return notification;
  } catch (error) {
    console.error("createAdminNotification failed (non-blocking):", error);
    return null;
  }
}
