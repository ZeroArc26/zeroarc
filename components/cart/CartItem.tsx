"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";

import {
  CartItem as CartItemType,
  useCartStore,
} from "@/stores/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({
  item,
}: CartItemProps) {
  const updateQuantity = useCartStore(
  (state) => state.updateQuantity
);

const removeFromCart = useCartStore(
  (state) => state.removeFromCart
);
    console.log("Cart Image:", item.image);
  return (
    <div className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">

      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-950">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain p-2"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-white">
          {item.name}
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          {item.color} • {item.size}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          SKU: {item.sku}
        </p>

        <p className="mt-3 text-lg font-bold text-purple-400">
          ₹{item.price}
        </p>
        <div className="mt-4 flex items-center justify-between">
  {/* Quantity */}
  <div className="flex items-center gap-3 rounded-xl border border-zinc-700 px-3 py-2">
    <button
  type="button"
  onClick={() =>
    updateQuantity(
      item.variantId,
      item.size,
      item.quantity - 1
    )
  }
  className="text-zinc-400 transition hover:text-white"
>
  <Minus size={16} />
</button>

    <span className="min-w-6 text-center font-semibold text-white">
      {item.quantity}
    </span>

    <button
  type="button"
  onClick={() =>
    updateQuantity(
      item.variantId,
      item.size,
      item.quantity + 1
    )
  }
  className="text-zinc-400 transition hover:text-white"
>
  <Plus size={16} />
</button>
  </div>

  {/* Remove */}
  <button
  type="button"
  onClick={() =>
    removeFromCart(
      item.variantId,
      item.size
    )
  }
  className="text-red-500 transition hover:text-red-400"
>
  <Trash2 size={18} />
</button>
</div>
      </div>
    </div>
  );
}