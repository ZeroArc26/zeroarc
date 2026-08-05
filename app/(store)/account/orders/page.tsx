"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ChevronRight } from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";

// TODO (before launch): replace this dummy order history with a real
// fetch from the Order model, scoped to the logged-in user.
const ORDERS = [
  {
    id: "ZA8765",
    status: "Delivered",
    title: "Limitless Aura Oversized T-Shirt (Black)",
    size: "M",
    qty: 1,
    price: 999,
    orderDate: "10 May 2024",
    statusDate: "Delivered on 12 May 2024",
    paymentMethod: "UPI",
    image: "/images/products/chaos-control/chaos-control-black.webp",
  },
  {
    id: "ZA8643",
    status: "Delivered",
    title: "Violet Void Oversized T-Shirt (White)",
    size: "L",
    qty: 1,
    price: 999,
    orderDate: "26 Apr 2024",
    statusDate: "Delivered on 28 Apr 2024",
    paymentMethod: "UPI",
    image: "/images/products/future-unknown/future-unknown-black.webp",
  },
  {
    id: "ZA8521",
    status: "Shipped",
    title: "Shadow Ronin Hoodie (Black)",
    size: "M",
    qty: 1,
    price: 1499,
    orderDate: "16 Apr 2024",
    statusDate: "Shipped on 18 Apr 2024",
    paymentMethod: "Cards",
    image: "/images/products/shadow-within/shadow-within-black.webp",
  },
  {
    id: "ZA8432",
    status: "Processing",
    title: "Eclipse Drift Oversized T-Shirt (White)",
    size: "S",
    qty: 1,
    price: 999,
    orderDate: "14 May 2024",
    statusDate: "Order placed on 14 May 2024",
    paymentMethod: "UPI",
    image: "/images/products/arc-beginning/arc-beginning-black.webp",
  },
  {
    id: "ZA8321",
    status: "Cancelled",
    title: "Phantom Blade Oversized T-Shirt (Black)",
    size: "L",
    qty: 1,
    price: 999,
    orderDate: "04 Apr 2024",
    statusDate: "Cancelled on 05 Apr 2024",
    paymentMethod: "UPI",
    image: "/images/products/chaos-control/chaos-control-black.webp",
  },
];

const TABS = [
  "All Orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
] as const;

function statusStyle(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-100 text-emerald-700";
    case "Shipped":
      return "bg-violet-100 text-violet-700";
    case "Processing":
      return "bg-amber-100 text-amber-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("All Orders");
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      const matchesTab =
        activeTab === "All Orders" || order.status === activeTab;

      const matchesQuery =
        query.trim() === "" ||
        order.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        order.id.toLowerCase().includes(query.trim().toLowerCase());

      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black uppercase text-black">
                  Orders
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Track, view and manage all your orders.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search orders..."
                    className="w-56 rounded-xl border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                  />
                </div>

                <button className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex flex-wrap gap-6 border-b border-zinc-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "text-violet-600"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-violet-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
                <p className="text-zinc-500">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-violet-300 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={order.image}
                        alt={order.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-black">
                          Order #{order.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-700">
                        {order.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Size: {order.size} • Qty: {order.qty}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {order.statusDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-10">
                      <div className="text-sm">
                        <p className="text-zinc-500">Order Date</p>
                        <p className="font-semibold text-black">
                          {order.orderDate}
                        </p>
                      </div>

                      <div className="text-sm">
                        <p className="text-zinc-500">Payment Method</p>
                        <p className="font-semibold text-black">
                          {order.paymentMethod} • ₹{order.price}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-black">
                          ₹{order.price}
                        </p>
                        <span className="text-xs font-semibold text-violet-600 hover:underline">
                          View Details
                        </span>
                      </div>

                      <ChevronRight className="hidden h-5 w-5 text-zinc-300 sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 text-zinc-400 transition hover:bg-zinc-100">
                ‹
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    n === 1
                      ? "bg-violet-600 text-white"
                      : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="px-1 text-zinc-400">…</span>
              <button className="flex h-9 items-center gap-1 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100">
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}