"use client";

import { useCartStore } from "@/stores/cartStore";

export default function OrderSummary() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const shipping = totalPrice > 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between text-zinc-400">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>

        <div className="flex justify-between text-zinc-400">
          <span>Shipping</span>

          <span>
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <div className="flex justify-between text-xl font-bold text-white">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

      </div>

      <button
        className="mt-8 w-full rounded-2xl bg-purple-600 py-4 font-semibold text-white transition hover:bg-purple-500"
      >
        Place Order
      </button>
    </div>
  );
}