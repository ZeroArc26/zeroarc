"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filteredOrders = orders.filter((order) => {

    const matchesSearch =
      `${order.customer.firstName} ${order.customer.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;

  });

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

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

        {/* Header */}

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

        {/* Stats */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <p className="text-zinc-500">
              Total Orders
            </p>

            <h2 className="mt-3 text-5xl font-black">
              {totalOrders}
            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <p className="text-zinc-500">
              Revenue
            </p>

            <h2 className="mt-3 text-5xl font-black text-green-400">
              ₹{totalRevenue.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <p className="text-zinc-500">
              Pending
            </p>

            <h2 className="mt-3 text-5xl font-black text-yellow-400">
              {pendingOrders}
            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <p className="text-zinc-500">
              Delivered
            </p>

            <h2 className="mt-3 text-5xl font-black text-violet-400">
              {deliveredOrders}
            </h2>

          </div>

        </div>

        {/* Search & Filter */}

        <div className="mt-10 flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pl-14 pr-6 outline-none transition focus:border-violet-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none transition focus:border-violet-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {/* Orders Grid */}

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {filteredOrders.length === 0 ? (

            <div className="col-span-full rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">

              <h2 className="text-3xl font-bold">
                No Orders Found
              </h2>

              <p className="mt-3 text-zinc-400">
                Try changing the search or filter.
              </p>

            </div>

          ) : (

            filteredOrders.map((order) => (

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