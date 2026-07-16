import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
}

interface WishlistStore {
  items: WishlistItem[];

  addToWishlist: (item: WishlistItem) => void;

  removeFromWishlist: (productId: number) => void;

  isInWishlist: (productId: number) => boolean;

  clearWishlist: () => void;

  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        const exists = get().items.some(
          (wishlistItem) =>
            wishlistItem.productId === item.productId
        );

        if (exists) return;

        set({
          items: [...get().items, item],
        });
      },

      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter(
            (item) => item.productId !== productId
          ),
        });
      },

      isInWishlist: (productId) => {
        return get().items.some(
          (item) => item.productId === productId
        );
      },

      clearWishlist: () => {
        set({
          items: [],
        });
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "zeroarc-wishlist",
    }
  )
);