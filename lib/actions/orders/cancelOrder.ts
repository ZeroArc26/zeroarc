"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { cancelDelhiveryShipment } from "@/lib/delhivery";

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

  // If a real Delhivery shipment exists, try to cancel it too (best
  // effort — Delhivery only allows this before pickup).
  const label = order.shippingLabel;
  let courierNote = "";
  if (
    label?.courierPartner === "Delhivery" &&
    label?.awbNumber &&
    !label?.isProvisionalAwb
  ) {
    const result = await cancelDelhiveryShipment(label.awbNumber);
    courierNote = result.success
      ? " Delhivery shipment cancelled."
      : ` Delhivery shipment could NOT be cancelled automatically (${result.message}) - cancel it in the Delhivery panel.`;
  }

  order.orderInfo.status = "cancelled";

  order.timeline.push({
    event: "Order Cancelled",
    date: new Date(),
  });

  await order.save();

  return {
    success: true,
    message: `Order cancelled successfully.${courierNote}`,
  };
}
