"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import { useCartStore } from "@/stores/cartStore";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/motion/Reveal";

const TRUST_BADGES = [
  { icon: Truck, title: "Fast Delivery", subtitle: "Your order will be shipped soon" },
  { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% safe & secure transactions" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle-free returns within 7 days" },
];

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

  const isPaid = order.payment?.status === "paid";

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto grid max-w-[1700px] items-center gap-10 px-6 py-10 md:px-14 lg:grid-cols-2 lg:py-14">
        {/* Left — order confirmation */}
        <Reveal trigger="mount">
          {/* Success Icon */}
          <div className="flex justify-center lg:justify-start">
            <div className="rounded-full bg-emerald-50 p-5">
              <CheckCircle2 size={56} className="text-emerald-500" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-center text-3xl font-black uppercase text-black lg:text-left">
            Order <span className="text-violet-600">Successful!</span>
          </h1>

          <p className="mt-3 text-center text-zinc-500 lg:text-left">
            Thank you for choosing ZeroArc.
            <br />
            Your order has been placed successfully.
          </p>

          {/* Order Info */}
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Order ID</p>
                  <p className="font-semibold text-black">
                    #{order.orderInfo?.orderNumber || order._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Date</p>
                <p className="font-semibold text-black">
                  {order.orderInfo?.orderDate
                    ? new Date(order.orderInfo.orderDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) +
                      ", " +
                      new Date(order.orderInfo.orderDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500">Payment Method</p>
                <p className="font-semibold uppercase text-black">
                  {order.payment?.method}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Payment Status</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isPaid ? "Paid Successfully" : order.payment?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary + Items */}
          <div className="mt-6 rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 font-bold uppercase text-black">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-black">
                  ₹{order.pricing?.subtotal}
                </span>
              </div>

              {(order.pricing?.shipping ?? 0) > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-black">
                    ₹{order.pricing.shipping}
                  </span>
                </div>
              )}

              {(order.pricing?.discount ?? 0) > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-600">
                    − ₹{order.pricing.discount}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-t border-zinc-200 pt-2 text-base">
                <span className="font-bold text-black">Total Amount</span>
                <span className="font-black text-violet-600">
                  ₹{order.pricing?.grandTotal}
                </span>
              </div>
            </div>

            {order.items?.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-zinc-200 pt-5">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-black">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {[item.color, item.size].filter(Boolean).join(" • ")}
                        {item.quantity ? ` • Qty: ${item.quantity}` : ""}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-black">
                      ₹{item.totalAmount ?? item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/account/orders/${order._id}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 py-3.5 text-sm font-semibold text-black transition hover:border-violet-400"
            >
              Track Your Order
              <Truck className="h-4 w-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-3">
            {TRUST_BADGES.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-black">
                    {title}
                  </p>
                  <p className="text-xs text-zinc-500">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right — editorial image, desktop only */}
        <Reveal trigger="mount" className="relative hidden lg:block">
          <div className="pointer-events-none absolute -right-10 top-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />

          <Image
            src="/images/order-success/female-model.png"
            alt="ZeroArc model wearing the brand's signature streetwear"
            width={1536}
            height={1024}
            priority
            className="relative z-10 h-auto w-full max-w-2xl"
          />
        </Reveal>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}
