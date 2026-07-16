"use client";

import { X } from "lucide-react";
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
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-zinc-800 bg-[#09090B] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white">
            Shopping Cart
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

                {/* Cart Content */}
<div className="flex-1 overflow-y-auto p-6">
  {items.length === 0 ? (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">
          Your cart is empty
        </h3>

        <p className="mt-2 text-zinc-400">
          Add your favorite products to get started.
        </p>
      </div>
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
<div className="border-t border-zinc-800 bg-[#0D0D10] p-6">

  {/* Price Summary */}
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

    <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
      <span className="text-lg font-bold text-white">
        Total
      </span>

      <span className="text-2xl font-black text-purple-400">
        ₹{totalPrice}
      </span>
    </div>

  </div>

  {/* Buttons */}
  <div className="mt-6 space-y-3">

    <button
      onClick={onClose}
      className="w-full rounded-2xl border border-zinc-700 py-3 font-semibold text-white transition hover:border-purple-500 hover:bg-zinc-900"
    >
      Continue Shopping
    </button>

    <button
      className="w-full rounded-2xl bg-purple-600 py-4 font-semibold text-white transition hover:bg-purple-500"
    >
      Secure Checkout
    </button>

  </div>

</div>
      </div>
    </>
  );
}