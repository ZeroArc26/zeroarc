"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function generateInvoice(orderId: string) {
  await connectDB();

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (!order.invoiceInfo?.invoiceNumber) {
    throw new Error("Invoice number has not been generated.");
  }

  return {
    success: true,
    order,
  };
}