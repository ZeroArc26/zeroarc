"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
  _id: string;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  total: number;
  totalItems: number;

  status: string;

  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  function getStatusColor(status: string) {
    switch (status) {

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "Confirmed":
        return "bg-blue-500/20 text-blue-400";

      case "Packed":
        return "bg-purple-500/20 text-purple-400";

      case "Shipped":
        return "bg-cyan-500/20 text-cyan-400";

      case "Delivered":
        return "bg-green-500/20 text-green-400";

      case "Cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-zinc-700 text-white";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Loading Orders...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Orders
            </h1>

            <p className="mt-3 text-zinc-400">
              Manage customer orders.
            </p>

          </div>

        </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {orders.length === 0 ? (

            <div className="col-span-full rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">

              <h2 className="text-3xl font-bold">
                No Orders Found
              </h2>

              <p className="mt-3 text-zinc-400">
                Customer orders will appear here.
              </p>

            </div>

          ) : (

            orders.map((order) => (

              <div
                key={order._id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-violet-500"
              >

                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold">
                    {order.customer.firstName}{" "}
                    {order.customer.lastName}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>

                </div>

                <p className="mt-3 text-zinc-400">
                  {order.customer.email}
                </p>

                <p className="text-zinc-500">
                  {order.customer.phone}
                </p>

                <div className="mt-6 space-y-2">

                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span>{order.totalItems}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-bold text-violet-400">
                      ₹{order.total}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>
                                <div className="mt-8 flex gap-3">

                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="flex-1 rounded-xl bg-violet-600 py-3 text-center font-bold transition hover:bg-violet-700"
                  >
                    View Details
                  </Link>

                  <button
                    className="flex-1 rounded-xl bg-red-600 py-3 font-bold transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </main>

  );
}