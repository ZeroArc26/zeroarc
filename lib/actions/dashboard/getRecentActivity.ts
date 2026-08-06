import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export async function getRecentActivity() {
  await connectDB();

  const [recentOrders, recentProducts] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(4).lean(),
    Product.find().sort({ createdAt: -1 }).limit(2).lean(),
  ]);

  const orderActivities = recentOrders.map((order: any) => ({
    type: "order" as const,
    title: "New order received",
    description: `Order ${order.orderInfo?.orderNumber ?? "#" + String(order._id).slice(-6)} placed by ${order.customer?.name || "Guest"}`,
    time: timeAgo(new Date(order.createdAt)),
    date: new Date(order.createdAt).getTime(),
  }));

  const productActivities = recentProducts.map((product: any) => ({
    type: "product" as const,
    title: "Product added",
    description: product.basicInfo?.title || "New product",
    time: timeAgo(new Date(product.createdAt)),
    date: new Date(product.createdAt).getTime(),
  }));

  return [...orderActivities, ...productActivities]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);
}