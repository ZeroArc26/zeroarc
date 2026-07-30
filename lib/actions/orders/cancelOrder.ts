"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function cancelOrder(orderId: string) {
  await connectDB();

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const currentStatus = order.orderInfo.status;

  // Already cancelled
  if (currentStatus === "cancelled") {
    throw new Error("Order is already cancelled.");
  }

  // Delivered orders cannot be cancelled
  if (currentStatus === "delivered") {
    throw new Error("Delivered orders cannot be cancelled.");
  }

  order.orderInfo.status = "cancelled";

  order.timeline.push({
    event: "Order Cancelled",
    date: new Date(),
  });

  await order.save();

  return {
    success: true,
    message: "Order cancelled successfully.",
  };
}