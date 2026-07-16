"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";

import {
  WishlistItem as WishlistItemType,
  useWishlistStore,
} from "@/stores/wishlistStore";

import { useCartStore } from "@/stores/cartStore";

interface WishlistItemProps {
  item: WishlistItemType;
}

export default function WishlistItem({
  item,
}: WishlistItemProps) {
    const removeFromWishlist = useWishlistStore(
  (state) => state.removeFromWishlist
);

const addToCart = useCartStore(
  (state) => state.addToCart
);
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">

      <div className="flex gap-4">

        {/* Product Image */}
        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-950">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-2"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between">

          <div>
            <h3 className="font-semibold text-white">
              {item.name}
            </h3>

            <p className="mt-2 text-lg font-bold text-purple-400">
              ₹{item.price}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">

            {/* Move to Cart */}
            <button
  onClick={() => {
    addToCart({
      productId: item.productId,
      slug: item.slug,
      name: item.name,

      variantId: item.variantId,
      sku: item.sku,
      color: item.color,
      size: item.size,

      image: item.image,

      price: item.price,
      quantity: 1,

      availableStock: item.availableStock,

      addedAt: new Date().toISOString(),
    });

    removeFromWishlist(item.productId);

    alert("Moved to Cart!");
  }}
  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
>
  <ShoppingBag size={16} />
  Move to Cart
</button>

            {/* Remove */}
            <button
  onClick={() => {
    removeFromWishlist(item.productId);
    alert("Removed from Wishlist!");
  }}
  className="rounded-xl border border-red-500/30 p-2.5 text-red-500 transition hover:bg-red-500/10"
>
              <Heart
                size={18}
                fill="currentColor"
              />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}