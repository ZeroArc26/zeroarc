import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  slug: string;
  name: string;

  variantId: string;
  sku: string;
  color: string;
  size: string;

  image: string;

  price: number;
  quantity: number;

  availableStock: number;

  addedAt: string;
}

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (
    variantId: string,
    size: string
  ) => void;

  updateQuantity: (
    variantId: string,
    size: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  getTotalItems: () => number;

  getTotalPrice: () => number;
}
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const existingItem = get().items.find(
          (cartItem) =>
            cartItem.variantId === item.variantId &&
            cartItem.size === item.size
        );

        if (existingItem) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.variantId === item.variantId &&
              cartItem.size === item.size
                ? {
                    ...cartItem,
                    quantity: Math.min(
                      cartItem.quantity + item.quantity,
                      cartItem.availableStock
                    ),
                  }
                : cartItem
            ),
          });

          return;
        }

        set({
          items: [...get().items, item],
        });
      },

      removeFromCart: (variantId, size) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.variantId === variantId &&
                item.size === size
              )
          ),
        });
      },
            updateQuantity: (variantId, size, quantity) => {
        set({
          items: get().items.map((item) => {
            if (
              item.variantId === variantId &&
              item.size === size
            ) {
              return {
                ...item,
                quantity: Math.max(
                  1,
                  Math.min(quantity, item.availableStock)
                ),
              };
            }

            return item;
          }),
        });
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "zeroarc-cart",
    }
  )
);