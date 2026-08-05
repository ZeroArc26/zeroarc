"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Package } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function OrderSuccessContent() {
  const clearCart = useCartStore((state) => state.clearCart);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
          clearCart();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-zinc-500">
        Loading...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-center">
        <p className="text-lg font-semibold text-black">Order not found.</p>
        <Link
          href="/"
          className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-14 md:px-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-50 p-6">
              <CheckCircle2 size={72} className="text-emerald-500" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-center text-3xl font-black uppercase text-black">
            Order Placed Successfully!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-center text-zinc-500">
            Thank you for shopping with ZeroArc.
            <br />
            We&apos;ve received your order and will start processing it shortly.
          </p>

          {/* Order Info */}
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex items-center gap-4 border-b border-zinc-200 pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-black">Order Confirmed</p>
                <p className="text-sm text-zinc-500">
                  Your order has been successfully placed.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
  <span className="text-zinc-500">Order ID</span>
  <span className="font-semibold text-black">
    {order.orderInfo?.orderNumber || order._id?.slice(-8).toUpperCase()}
  </span>
</div>

<div className="flex items-center justify-between">
  <span className="text-zinc-500">Payment Status</span>
  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700">
    {order.payment?.status}
  </span>
</div>

<div className="flex items-center justify-between">
  <span className="text-zinc-500">Payment Method</span>
  <span className="font-semibold uppercase text-black">
    {order.payment?.method}
  </span>
</div>

<div className="flex items-center justify-between">
  <span className="text-zinc-500">Estimated Delivery</span>
  <span className="font-semibold text-black">
    3–7 Business Days
  </span>
</div>

<div className="flex items-center justify-between border-t border-zinc-200 pt-4">
  <span className="font-bold text-black">Total Amount</span>
  <span className="text-lg font-black text-violet-600">
    ₹{order.pricing?.grandTotal}
  </span>
</div>

<div className="flex items-center justify-between">
  <span className="text-zinc-500">Order Status</span>
  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase text-violet-700">
    {order.orderInfo?.status}
  </span>
</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/"
              className="flex items-center justify-center rounded-xl bg-violet-600 py-4 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Continue Shopping
            </Link>

            <Link
              href="/account/orders"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 py-4 text-sm font-semibold text-black transition hover:border-violet-400"
            >
              View Orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}