import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function getOrdersByCustomerEmail(email: string) {
  await connectDB();

  const orders = await Order.find({ "customer.email": email })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(orders));
}