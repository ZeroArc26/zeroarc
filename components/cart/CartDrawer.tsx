"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

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
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-zinc-800 bg-gradient-to-b from-[#09090B] via-[#0D0D10] to-[#09090B] shadow-[0_0_60px_rgba(0,0,0,.55)]">

        {/* Header */}

<div className="border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-xl">

  <div className="flex items-center justify-between p-6">

    <div>

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400">

          <ShoppingBag size={22} />

        </div>

        <div>

          <h2 className="text-2xl font-black text-white">
            Shopping Cart
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {items.length} Item{items.length !== 1 ? "s" : ""}
          </p>

        </div>

      </div>

    </div>

    <button
      onClick={onClose}
      className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
    >
      <X size={22}/>
    </button>

  </div>

</div>

        {/* Cart Content */}
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

  </div>
) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={`${item.variantId}-${item.size}`}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}

<div className="border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">

  {/* Free Shipping */}

  <div className="border-b border-zinc-800 px-6 py-5">

    <div className="mb-3 flex items-center justify-between">

      <div>

        <p className="text-sm font-semibold text-white">
          FREE Shipping
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          All orders qualify for free delivery.
        </p>

      </div>

      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
        ACTIVE
      </span>

    </div>

    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

      <div className="h-full w-full rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"/>

    </div>

  </div>

          {/* Order Summary */}

<div className="m-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">

  <h3 className="mb-5 text-lg font-bold text-white">
    Order Summary
  </h3>

  <div className="space-y-4">

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

    <div className="flex items-center justify-between">

      <span className="text-zinc-400">
        Taxes
      </span>

      <span className="font-semibold text-white">
        Included
      </span>

    </div>

    <div className="border-t border-zinc-800 pt-5">

      <div className="flex items-center justify-between">

        <span className="text-xl font-bold text-white">
          Total
        </span>

        <span className="text-3xl font-black text-purple-400">
          ₹{totalPrice}
        </span>

      </div>

    </div>

  </div>

</div>

          {/* Actions */}

<div className="space-y-4 px-6 pb-6">

  {/* Continue Shopping */}

  <button
    onClick={onClose}
    className="w-full rounded-2xl border border-zinc-700 bg-transparent py-3.5 font-semibold text-white transition-all duration-300 hover:border-purple-500 hover:bg-zinc-900"
  >
    Continue Shopping
  </button>


  {/* Checkout */}

  <Link
    href="/checkout"
    onClick={onClose}
    className={`block w-full rounded-2xl py-4 text-center text-base font-bold transition-all duration-300 ${
      items.length === 0
        ? "pointer-events-none cursor-not-allowed bg-zinc-700 text-zinc-500"
        : "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-xl shadow-purple-900/40 hover:scale-[1.02] hover:shadow-purple-700/50"
    }`}
  >
    {items.length === 0
      ? "Add Items to Continue"
      : "Proceed to Secure Checkout"}
  </Link>


  {/* Security */}

  <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

    <div className="flex items-center justify-center gap-2">

      <span className="text-lg">
        🔒
      </span>

      <p className="text-sm font-medium text-green-300">
        Encrypted & Secure Checkout
      </p>

    </div>

    <p className="mt-2 text-center text-xs text-green-400/80">
      Your payment information is fully protected.
    </p>

  </div>

</div>

        </div>

{/* Premium Footer */}

<div className="border-t border-zinc-800 bg-zinc-950/80 px-6 py-4">

  <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">

    <span>🚚 Fast Delivery</span>

    <span>↩️ Easy Returns</span>

    <span>🛡️ Trusted</span>

  </div>

</div>

      </div>
    </>
  );
}