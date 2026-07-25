"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
        Loading Orders...
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
        No Orders Found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-5xl font-black">
          My Orders
        </h1>

        <p className="mt-3 text-zinc-400">
          Track all your orders here.
        </p>

        <div className="mt-12 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-zinc-300">
                    Products: {order.totalItems}
                  </p>

                  <p className="text-zinc-300">
                    Total: ₹{order.total}
                  </p>

                  <p className="text-zinc-300">
                    Payment Method: {order.paymentMethod}
                  </p>

                  <p className="text-zinc-300">
                    Payment Status: {order.paymentStatus}
                  </p>

                  <p className="text-zinc-300">
                    Order Status: {order.status}
                  </p>
                </div>

                <Link
                  href={`/account/orders/${order._id}`}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-center font-bold transition hover:scale-105"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}