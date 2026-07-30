"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const TIMELINE_EVENTS: Record<OrderStatus, string> = {
  pending: "Order Created",
  confirmed: "Order Confirmed",
  processing: "Order Processing Started",
  shipped: "Order Shipped",
  delivered: "Order Delivered",
  cancelled: "Order Cancelled",
};

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  await connectDB();

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const currentStatus = order.orderInfo.status as OrderStatus;

  // Prevent duplicate update
  if (currentStatus === status) {
    throw new Error(`Order is already "${status}".`);
  }

  // Validate transition
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus];

  if (!allowedTransitions.includes(status)) {
    throw new Error(
      `Cannot change order status from "${currentStatus}" to "${status}".`
    );
  }

  // Update status
  order.orderInfo.status = status;

  // Add timeline event
  order.timeline.push({
    event: TIMELINE_EVENTS[status],
    date: new Date(),
  });

  await order.save();

  return {
    success: true,
    message: `Order marked as ${status}.`,
    status,
  };
}