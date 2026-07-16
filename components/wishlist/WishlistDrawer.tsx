"use client";

import { X } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistItem from "./WishlistItem";

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({
  open,
  onClose,
}: WishlistDrawerProps) {
  const items = useWishlistStore((state) => state.items);

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
            Wishlist
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">
                  Wishlist is empty
                </h3>

                <p className="mt-2 text-zinc-400">
                  Save your favorite products here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
  {items.map((item) => (
    <WishlistItem
      key={item.productId}
      item={item}
    />
  ))}
</div>
          )}
        </div>
      </div>
    </>
  );
}