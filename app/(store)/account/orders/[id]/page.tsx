import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  MapPin,
  Download,
  MessageCircle,
} from "lucide-react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";

import { DUMMY_ORDERS } from "@/constants/dummy-orders";

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

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = DUMMY_ORDERS.find(
    (o) => o.id.toLowerCase() === id.toLowerCase()
  );

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            {/* Header */}
            <Link
              href="/account/orders"
              className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Orders
            </Link>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-black">
                    Order #{order.id}
                  </h1>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Placed on {order.orderDate}
                </p>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400">
                  <Download className="h-4 w-4" />
                  Invoice
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-violet-400">
                  <MessageCircle className="h-4 w-4" />
                  Need Help?
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
              {/* Left column */}
              <div className="space-y-6">
                {/* Timeline */}
                {order.status !== "Cancelled" && (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <h2 className="mb-6 font-bold text-black">
                      Order Tracking
                    </h2>

                    <div className="relative pl-2">
                      {order.timeline.map((step, i) => (
                        <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                          {i < order.timeline.length - 1 && (
                            <span
                              className={`absolute left-[9px] top-6 h-full w-0.5 ${
                                step.done ? "bg-violet-600" : "bg-zinc-200"
                              }`}
                            />
                          )}

                          {step.done ? (
                            <CheckCircle2 className="relative z-10 h-5 w-5 shrink-0 text-violet-600" />
                          ) : (
                            <Circle className="relative z-10 h-5 w-5 shrink-0 text-zinc-300" />
                          )}

                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                step.done ? "text-black" : "text-zinc-400"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-zinc-400">
                              {step.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.status === "Cancelled" && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-700">
                      This order was cancelled.
                    </p>
                    <p className="mt-1 text-xs text-red-500">
                      {order.statusDate}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 font-bold text-black">Items</h2>

                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black">
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-black">
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-bold text-black">
                    <MapPin className="h-4 w-4 text-violet-600" />
                    Shipping Address
                  </h2>
                  <p className="text-sm font-semibold text-black">
                    {order.shippingAddress.name}
                  </p>
                  {order.shippingAddress.lines.map((line) => (
                    <p key={line} className="text-sm text-zinc-500">
                      {line}
                    </p>
                  ))}
                  <p className="mt-1 text-sm text-zinc-500">
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Right column: Summary */}
              <div className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-black">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">
                      ₹{order.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Discount</span>
                      <span className="font-semibold text-emerald-600">
                        − ₹{order.discount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                  <span className="font-bold text-black">Total</span>
                  <span className="text-xl font-black text-violet-600">
                    ₹{order.total}
                  </span>
                </div>

                <div className="mt-4 border-t border-zinc-200 pt-4 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Payment Method</span>
                    <span className="font-semibold text-black">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {order.status === "Delivered" && (
                  <button className="mt-5 w-full rounded-xl border border-violet-300 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50">
                    Return / Exchange
                  </button>
                )}

                {(order.status === "Processing" ||
                  order.status === "Shipped") && (
                  <button className="mt-5 w-full rounded-xl border border-red-300 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}