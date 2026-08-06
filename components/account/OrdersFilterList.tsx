"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

import { statusLabel, statusStyle } from "@/lib/orderStatus";

interface OrderRow {
  id: string;
  status: string;
  orderDate: string;
  title: string;
  extraCount: number;
  image: string;
  size?: string;
  qty: number;
  price: number;
  paymentMethod: string;
}

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export default function OrdersFilterList({ orders }: { orders: OrderRow[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "all" || order.status === activeTab;
      const matchesQuery =
        query.trim() === "" ||
        order.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        order.id?.toLowerCase().includes(query.trim().toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [orders, activeTab, query]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-56 rounded-xl border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-6 border-b border-zinc-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative pb-3 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "text-violet-600"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-violet-600" />
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
          <p className="text-zinc-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-violet-300 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                {order.image && (
                  <Image
                    src={order.image}
                    alt={order.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-black">Order #{order.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusStyle(
                      order.status
                    )}`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-700">
                  {order.title}
                  {order.extraCount > 0 && ` + ${order.extraCount} more`}
                </p>
                <p className="text-xs text-zinc-500">
                  {order.size ? `Size: ${order.size} • ` : ""}Qty: {order.qty}
                </p>
              </div>

              <div className="flex items-center gap-6 sm:gap-10">
                <div className="text-sm">
                  <p className="text-zinc-500">Order Date</p>
                  <p className="font-semibold text-black">
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="text-zinc-500">Payment Method</p>
                  <p className="font-semibold text-black">
                    {order.paymentMethod} • ₹{order.price}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-black">₹{order.price}</p>
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
    </>
  );
}