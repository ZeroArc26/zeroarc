"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

const TABS = [
  "All Orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

const STATUS_MAP: Record<string, string> = {
  pending: "Processing",
  confirmed: "Processing",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

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

export default function OrdersListClient({ orders }: { orders: any[] }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All Orders");
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const displayStatus = STATUS_MAP[order.orderInfo?.status] || "Processing";

      const matchesTab = activeTab === "All Orders" || displayStatus === activeTab;

      const matchesQuery =
        query.trim() === "" ||
        order.orderInfo?.orderNumber?.toLowerCase().includes(query.trim().toLowerCase()) ||
        order.items?.some((i: any) =>
          i.name?.toLowerCase().includes(query.trim().toLowerCase())
        );

      return matchesTab && matchesQuery;
    });
  }, [orders, activeTab, query]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
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
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 text-sm font-semibold transition ${
              activeTab === tab ? "text-violet-600" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-violet-600" />
            )}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
          <p className="text-zinc-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const displayStatus = STATUS_MAP[order.orderInfo?.status] || "Processing";
            const firstItem = order.items?.[0];
            const extraCount = (order.items?.length || 1) - 1;

            return (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-violet-300 sm:flex-row sm:items-center"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  {firstItem?.image && (
                    <Image
                      src={firstItem.image}
                      alt={firstItem.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-black">
                      Order #{order.orderInfo?.orderNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusStyle(
                        displayStatus
                      )}`}
                    >
                      {displayStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700">
                    {firstItem?.name}
                    {extraCount > 0 && ` + ${extraCount} more item${extraCount > 1 ? "s" : ""}`}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Size: {firstItem?.size} • Qty: {firstItem?.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="text-sm">
                    <p className="text-zinc-500">Order Date</p>
                    <p className="font-semibold text-black">
                      {new Date(order.orderInfo?.orderDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="text-zinc-500">Payment Method</p>
                    <p className="font-semibold text-black uppercase">
                      {order.payment?.method}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-black">
                      ₹{order.pricing?.grandTotal}
                    </p>
                    <span className="text-xs font-semibold text-violet-600 hover:underline">
                      View Details
                    </span>
                  </div>

                  <ChevronRight className="hidden h-5 w-5 text-zinc-300 sm:block" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}