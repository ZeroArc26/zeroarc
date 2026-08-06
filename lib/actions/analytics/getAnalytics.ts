"use server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";

interface GetAnalyticsOptions {
  startDate: string; // ISO date
  endDate: string; // ISO date
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getAnalytics({ startDate, endDate }: GetAnalyticsOptions) {
  try {
    await connectDB();

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    })
      .select(
        "orderInfo.status orderInfo.orderDate items pricing payment customer.email createdAt"
      )
      .lean<any[]>();

    // ---------- Summary ----------
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.pricing?.grandTotal || 0),
      0
    );
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // ---------- Revenue trend (daily buckets) ----------
    const dayCount =
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const revenueBuckets: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      revenueBuckets.push({ date: dateKey(d), revenue: 0, orders: 0 });
    }
    const bucketIndex = new Map(revenueBuckets.map((b, i) => [b.date, i]));

    orders.forEach((o) => {
      const key = dateKey(new Date(o.createdAt));
      const idx = bucketIndex.get(key);
      if (idx !== undefined) {
        revenueBuckets[idx].revenue += o.pricing?.grandTotal || 0;
        revenueBuckets[idx].orders += 1;
      }
    });

    // ---------- Orders by status ----------
    const statusCounts = new Map<string, number>();
    orders.forEach((o) => {
      const status = o.orderInfo?.status || "unknown";
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
    });
    const ordersByStatus = Array.from(statusCounts.entries()).map(
      ([status, count]) => ({ status, count })
    );

    // ---------- Top products ----------
    const productMap = new Map<string, { name: string; revenue: number; quantity: number }>();
    orders.forEach((o) => {
      (o.items || []).forEach((item: any) => {
        const key = item.name || "Unknown";
        const existing = productMap.get(key) || {
          name: key,
          revenue: 0,
          quantity: 0,
        };
        existing.revenue += item.totalAmount || 0;
        existing.quantity += item.quantity || 0;
        productMap.set(key, existing);
      });
    });
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    // ---------- Payment method split ----------
    const paymentMap = new Map<string, { count: number; revenue: number }>();
    orders.forEach((o) => {
      const method = (o.payment?.method || "unknown").toUpperCase();
      const existing = paymentMap.get(method) || { count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += o.pricing?.grandTotal || 0;
      paymentMap.set(method, existing);
    });
    const paymentBreakdown = Array.from(paymentMap.entries()).map(
      ([method, data]) => ({ method, ...data })
    );

    // ---------- Top categories (needs a Product lookup for category) ----------
    const Product = (await import("@/models/Product")).default;
    const productIds = [
      ...new Set(
        orders.flatMap((o) => (o.items || []).map((i: any) => i.productId?.toString()))
      ),
    ].filter(Boolean);

    const products = await Product.find({ _id: { $in: productIds } })
      .select("basicInfo.category")
      .lean<any[]>();

    const categoryByProductId = new Map(
      products.map((p: any) => [p._id.toString(), p.basicInfo?.category || "Uncategorized"])
    );

    const categoryMap = new Map<string, number>();
    orders.forEach((o) => {
      (o.items || []).forEach((item: any) => {
        const category =
          categoryByProductId.get(item.productId?.toString()) || "Uncategorized";
        categoryMap.set(
          category,
          (categoryMap.get(category) || 0) + (item.totalAmount || 0)
        );
      });
    });
    const topCategories = Array.from(categoryMap.entries())
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // ---------- Customer growth (new customers per day in range) ----------
    const newCustomers = await Customer.find({
      createdAt: { $gte: start, $lte: end },
    })
      .select("createdAt")
      .lean<any[]>();

    const customerBuckets: { date: string; newCustomers: number }[] = revenueBuckets.map(
      (b) => ({ date: b.date, newCustomers: 0 })
    );
    const customerBucketIndex = new Map(customerBuckets.map((b, i) => [b.date, i]));

    newCustomers.forEach((c) => {
      const key = dateKey(new Date(c.createdAt));
      const idx = customerBucketIndex.get(key);
      if (idx !== undefined) customerBuckets[idx].newCustomers += 1;
    });

    return {
      success: true,
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        newCustomersCount: newCustomers.length,
      },
      revenueTrend: revenueBuckets,
      ordersByStatus,
      topProducts,
      topCategories,
      paymentBreakdown,
      customerGrowth: customerBuckets,
    };
  } catch (error) {
    console.error("Get Analytics Error:", error);
    return {
      success: false,
      message: "Failed to fetch analytics.",
      summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, newCustomersCount: 0 },
      revenueTrend: [],
      ordersByStatus: [],
      topProducts: [],
      topCategories: [],
      paymentBreakdown: [],
      customerGrowth: [],
    };
  }
}