"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";

export async function deleteOrder(orderId: string) {
  await connectDB();

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  // Keep the Customer collection's denormalized totals in sync. This is
  // exactly the mismatch that happens if an order is ever removed
  // directly in the database instead of through this action —
  // totalOrders/totalSpent are stored counters on Customer, not values
  // computed live from the Order collection.
  const email = (order.customer?.email || "").toLowerCase();

  if (email) {
    const customer = await Customer.findOne({ email });

    if (customer) {
      customer.totalOrders = Math.max(
        (customer.totalOrders || 0) - 1,
        0
      );
      customer.totalSpent = Math.max(
        (customer.totalSpent || 0) - (order.pricing?.grandTotal || 0),
        0
      );
      await customer.save();
    }
  }

  await Order.findByIdAndDelete(orderId);

  return {
    success: true,
    message: "Order deleted successfully.",
  };
}
