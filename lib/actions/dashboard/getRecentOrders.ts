import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function getRecentOrders() {
  await connectDB();

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return orders.map((order: any) => ({
    id: order.orderInfo?.orderNumber ?? String(order._id).slice(-8).toUpperCase(),
    customer: order.customer?.name || "Guest",
    amount: order.pricing?.grandTotal ?? 0,
    status: order.orderInfo?.status ?? "pending",
  }));
}