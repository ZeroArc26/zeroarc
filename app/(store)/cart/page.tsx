"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  X,
  Heart,
  Trash2,
  Lock,
  ShieldCheck,
  RotateCcw,
  Gem,
} from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function CartPage() {
  const router = useRouter();

  const storeItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cart data is persisted in localStorage, which the server can't see.
  // Rendering an empty cart until mounted keeps the first client render
  // identical to the server render, avoiding a hydration mismatch.
  const items = mounted ? storeItems : [];

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleMoveToWishlist = (item: (typeof items)[number]) => {
    addToWishlist({
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      image: item.image,
      color: item.color,
      size: item.size,
      price: item.price,
      stock: item.stock,
    });
    removeFromCart(item.productId, item.color, item.size);
  };

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-14">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black uppercase text-black">
              Your Cart
              <span className="text-violet-600">({totalItems})</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Review your items and proceed to checkout.
            </p>
          </div>

          <Link
            href="/men"
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-16 text-center">
            <h2 className="text-xl font-bold text-black">
              Your cart is empty
            </h2>
            <p className="mt-2 text-zinc-500">
              Add some products to continue shopping.
            </p>
            <Link
              href="/men"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart items */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-zinc-200">
                {/* Table header */}
                <div className="hidden grid-cols-[2fr_100px_150px_100px_40px] gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-zinc-500 md:grid">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span />
                </div>

                {items.map((item) => {
                  const isLowStock = item.stock > 0 && item.stock <= 3;

                  return (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="grid grid-cols-1 gap-4 border-b border-zinc-100 px-6 py-6 last:border-0 md:grid-cols-[2fr_100px_150px_100px_40px] md:items-center"
                    >
                      {/* Product */}
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-black">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            Size: {item.size} • Color: {item.color}
                          </p>

                          <span
                            className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${
                              isLowStock ? "text-orange-500" : "text-emerald-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isLowStock ? "bg-orange-500" : "bg-emerald-500"
                              }`}
                            />
                            {isLowStock
                              ? `Low Stock (${item.stock} left)`
                              : "In Stock"}
                          </span>

                          <div className="mt-2 flex items-center gap-4 text-xs font-semibold">
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="flex items-center gap-1.5 text-zinc-500 transition hover:text-violet-600"
                            >
                              <Heart className="h-3.5 w-3.5" />
                              Move to Wishlist
                            </button>
                            <button
                              onClick={() =>
                                removeFromCart(item.productId, item.color, item.size)
                              }
                              className="flex items-center gap-1.5 text-zinc-500 transition hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-black">
                        ₹{item.price}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.color,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition hover:border-violet-400"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.color,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition hover:border-violet-400"
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-sm font-bold text-black">
                        ₹{item.price * item.quantity}
                      </div>

                      {/* Remove icon */}
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.color, item.size)
                        }
                        className="hidden h-8 w-8 items-center justify-center text-zinc-400 transition hover:text-violet-600 md:flex"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit space-y-5 rounded-2xl border border-zinc-200 p-6">
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-zinc-100">
                <Image
                  src="/images/cart/female-banner.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-sm font-bold uppercase tracking-wide text-black">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-black">₹{subtotal}</span>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">Total Amount</span>
                  <span className="text-xl font-black text-violet-600">
                    ₹{subtotal}
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-500">
                  Shipping charges and promo codes are calculated at checkout.
                </p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Lock className="h-4 w-4" />
                Proceed to Checkout
              </button>

              <div className="space-y-4 border-t border-zinc-100 pt-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "100% Secure Payments",
                    subtitle: "Safe & trusted checkout",
                  },
                  {
                    icon: RotateCcw,
                    title: "Easy Returns",
                    subtitle: "Hassle-free returns within 7 days",
                  },
                  {
                    icon: Gem,
                    title: "Premium Quality",
                    subtitle: "Original designs, top-notch quality",
                  },
                ].map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {title}
                      </p>
                      <p className="text-xs text-zinc-500">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}