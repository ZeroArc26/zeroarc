"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import {
  ArrowRight,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function OrderSuccessPage() {

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
}, [orderId]);

if (loading) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
      Loading...
    </main>
  );
}

if (!order) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
      Order not found.
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#09090B] px-6 py-32 text-white">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-10 backdrop-blur">

          {/* Success Icon */}

          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/10 p-6">
              <CheckCircle2
                size={80}
                className="text-green-400 animate-pulse"
              />
            </div>
          </div>

          {/* Heading */}

          <h1 className="mt-8 text-center text-4xl font-black">
            Order Placed Successfully!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
            Thank you for shopping with ZeroArc.
            <br />
            We've received your order and will start
            processing it shortly.
          </p>

          {/* Info Card */}

          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">

            <div className="flex items-center gap-4 border-b border-zinc-800 pb-5">
              <Package className="text-violet-400" />

              <div>
                <p className="font-semibold">
                  Order Confirmed
                </p>

                <p className="text-sm text-zinc-400">
                  Your order has been successfully placed.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">

  {/* Payment Status */}
  <div className="flex items-center justify-between">
    <span className="text-zinc-400">
      Payment Status
    </span>

    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-400">
      {order?.paymentStatus}
    </span>
  </div>

  {/* Payment Method */}
  <div className="flex items-center justify-between">
    <span className="text-zinc-400">
      Payment Method
    </span>

    <span className="font-semibold">
      {order?.paymentMethod}
    </span>
  </div>

  {/* Estimated Delivery */}
  <div className="flex items-center justify-between">
    <span className="text-zinc-400">
      Estimated Delivery
    </span>

    <span className="font-semibold">
      3–7 Business Days
    </span>
  </div>

  {/* Total Amount */}
  <div className="flex items-center justify-between">
    <span className="text-zinc-400">
      Total Amount
    </span>

    <span className="font-semibold">
      ₹{order?.total}
    </span>
  </div>

  {/* Order Status */}
  <div className="flex items-center justify-between">
    <span className="text-zinc-400">
      Order Status
    </span>

    <span className="font-semibold">
      {order?.status}
    </span>
  </div>

</div>
          </div>

          {/* Buttons */}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">

            <Link
              href="/"
              className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.02]"
            >
              Continue Shopping
            </Link>

            <Link
              href="/account/orders"
              className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 py-4 text-lg font-bold transition hover:border-violet-500"
            >
              View Orders
              <ArrowRight size={20} />
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}