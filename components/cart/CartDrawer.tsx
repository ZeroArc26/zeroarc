"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import CartItem from "./CartItem";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {

  const items = useCartStore(
    (state) => state.items
  );

  const totalPrice = useCartStore(
    (state) => state.getTotalPrice()
  );

  if (!open) return null;

  return (
    <>

      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />



      {/* Drawer */}

      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col overflow-hidden border-l border-zinc-800 bg-[#09090B] shadow-2xl">



        {/* ================= HEADER ================= */}

        <div className="sticky top-0 z-20 border-b border-zinc-800 bg-[#09090B]/95 backdrop-blur-xl">

          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/15">

                <ShoppingBag
                  size={24}
                  className="text-purple-400"
                />

              </div>

              <div>

                <h2 className="text-2xl font-black text-white">
                  Shopping Cart
                </h2>

                <div className="mt-2 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">

                  {items.length} Item
                  {items.length !== 1 ? "s" : ""}

                </div>

              </div>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
            >

              <X size={22} />

            </button>

          </div>

        </div>



        {/* ================= CONTENT ================= */}

        <div className="flex-1 overflow-y-auto px-6 py-5">
                      {items.length === 0 ? (

            <div className="flex h-full flex-col items-center justify-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900">

                <ShoppingBag
                  size={42}
                  className="text-zinc-700"
                />

              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Your cart is empty
              </h3>

              <p className="mt-3 max-w-xs text-center text-zinc-500">
                Looks like you haven't added anything yet.
              </p>

              <button
                onClick={onClose}
                className="mt-8 rounded-2xl bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-500"
              >
                Explore Collection
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {items.map((item) => (

                <CartItem
                  key={`${item.productId}-${item.color}-${item.size}`}
                  item={item}
                />

              ))}

            </div>

          )}

        </div>



        {/* ================= FOOTER ================= */}

        <div className="border-t border-zinc-800 bg-[#09090B] p-6">

          <div className="space-y-3">

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Subtotal
              </span>

              <span className="font-semibold text-white">
                ₹{totalPrice}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Shipping
              </span>

              <span className="font-semibold text-green-400">
                FREE
              </span>

            </div>

            <div className="border-t border-zinc-800 pt-3">

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-white">
                  Total
                </span>

                <span className="text-2xl font-black text-purple-400">
                  ₹{totalPrice}
                </span>

              </div>

            </div>

          </div>
                    {/* Actions */}

          <div className="mt-6 space-y-4">

            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-zinc-700 py-3.5 font-semibold text-white transition-all duration-300 hover:border-purple-500 hover:bg-zinc-900"
            >
              Continue Shopping
            </button>

            <Link
              href="/checkout"
              onClick={onClose}
              className={`block w-full rounded-2xl py-4 text-center text-base font-bold transition-all duration-300 ${
                items.length === 0
                  ? "pointer-events-none cursor-not-allowed bg-zinc-800 text-zinc-500"
                  : "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-600/30"
              }`}
            >
              {items.length === 0
                ? "Add Items to Continue"
                : "Proceed to Secure Checkout"}
            </Link>

            <div className="flex items-center justify-center gap-2 pt-2">

              <span className="text-green-400">
                🔒
              </span>

              <p className="text-xs text-zinc-500">
                Secure payment • Fast delivery • Easy returns
              </p>

            </div>

          </div>

        </div>
              </div>

    </>
  );
}