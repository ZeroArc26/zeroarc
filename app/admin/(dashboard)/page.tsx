"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RevenueChart from "@/components/admin/RevenueChart";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    lowStockProducts: number;
  };

  recentOrders: any[];

  lowStockProducts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/admin/dashboard");

      const dashboard = await res.json();

      if (dashboard.success) {
        setData(dashboard);
      }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">
          Loading Dashboard...
        </h1>
      </main>
    );
  }

  if (!data) return null;
    return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-zinc-400">
              Welcome back! Here's your store overview.
            </p>

          </div>

          <Link
            href="/admin/products/add"
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 font-bold transition hover:scale-105"
          >
            + Add Product
          </Link>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Revenue
            </p>

            <h2 className="mt-3 text-4xl font-black text-green-400">
              ₹{data.stats.totalRevenue}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {data.stats.totalOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Total Products
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {data.stats.totalProducts}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
            <p className="text-zinc-400">
              Low Stock
            </p>

            <h2 className="mt-3 text-4xl font-black text-red-400">
              {data.stats.lowStockProducts}
            </h2>
          </div>

        </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-2">

          {/* Recent Orders */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-3xl font-bold">
              Recent Orders
            </h2>

            <div className="mt-8 space-y-4">

              {data.recentOrders.length === 0 ? (

                <p className="text-zinc-500">
                  No recent orders.
                </p>

              ) : (

                data.recentOrders.map((order: any) => (

                  <div
                    key={order._id}
                    className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4"
                  >

                    <div>

                      <p className="font-bold">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {order.customer.email}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-violet-400">
                        ₹{order.total}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {order.status}
                      </p>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

          {/* Low Stock */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-3xl font-bold">
              Low Stock Products
            </h2>

            <div className="mt-8 space-y-4">

              {data.lowStockProducts.length === 0 ? (

                <p className="text-zinc-500">
                  No low stock products 🎉
                </p>

              ) : (

                data.lowStockProducts.map((product: any) => (

                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4"
                  >

                    <div>

                      <p className="font-bold">
                        {product.title}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {product.category}
                      </p>

                    </div>

                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                      {product.stock} Left
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

      <div className="mt-12">
  <RevenueChart />
</div>

    </main>
  );
}