import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function getRevenueAnalytics() {
  await connectDB();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    createdAt: { $gte: sevenDaysAgo },
  })
    .select("pricing.grandTotal createdAt")
    .lean();

  // Build a 7-day bucket, oldest to newest.
  const buckets: { name: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    buckets.push({ name: DAY_LABELS[date.getDay()], revenue: 0 });
  }

  orders.forEach((order: any) => {
    const orderDate = new Date(order.createdAt);
    const diffDays = Math.floor(
      (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const bucketIndex = 6 - diffDays;
    if (bucketIndex >= 0 && bucketIndex < 7) {
      buckets[bucketIndex].revenue += order.pricing?.grandTotal ?? 0;
    }
  });

  const totalRevenue = buckets.reduce((sum, b) => sum + b.revenue, 0);

  return { data: buckets, totalRevenue };
}