"use client";

import { useEffect, useState } from "react";
import RevenueChart from "@/components/admin/RevenueChart";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

interface RecentOrder {
  _id: string;

  customer: {
    firstName: string;
    lastName: string;
  };

  total: number;

  status: string;

  createdAt: string;
}

interface MonthlyRevenue {
  _id: {
    month: number;
  };

  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const [monthlyRevenue, setMonthlyRevenue] = useState<
    MonthlyRevenue[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");

        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
          setMonthlyRevenue(data.monthlyRevenue);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "Confirmed":
        return "bg-blue-500/20 text-blue-400";

      case "Packed":
        return "bg-purple-500/20 text-purple-400";

      case "Shipped":
        return "bg-orange-500/20 text-orange-400";

      case "Delivered":
        return "bg-green-500/20 text-green-400";

      case "Cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-zinc-700 text-white";
    }
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-black">
          Dashboard
        </h1>

        <p className="mt-3 text-zinc-400">
          Welcome to ZeroArc Admin Panel
        </p>

                {/* Stats Cards */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Revenue
            </p>

            <h2 className="mt-3 text-4xl font-black text-purple-400">
              {loading ? "..." : `₹${stats.totalRevenue}`}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {loading ? "..." : stats.totalOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Products
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {loading ? "..." : stats.totalProducts}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Users
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {loading ? "..." : stats.totalUsers}
            </h2>
          </div>

        </div>

        {/* Revenue Chart */}

        <div className="mt-16">

          <RevenueChart
            data={monthlyRevenue.map((item) => ({
              month: [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][item._id.month],

              revenue: item.revenue,
            }))}
          />

        </div>

        {/* Recent Orders */}

        <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-3xl font-black">
            Recent Orders
          </h2>

          <div className="mt-8 space-y-4">

            {loading ? (

              <p className="text-zinc-400">
                Loading...
              </p>

            ) : recentOrders.length === 0 ? (

              <p className="text-zinc-500">
                No orders found.
              </p>

            ) : (

              recentOrders.map((order) => (

                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                >

                  <div>

                    <h3 className="font-bold text-white">
                      {order.customer.firstName}{" "}
                      {order.customer.lastName}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xl font-black text-purple-400">
                      ₹{order.total}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>
              </div>
    </main>
  );
}