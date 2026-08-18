import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;

  slug: string;
  title: string;

  image: string;

  color: string;
  size: string;

  price: number;

  /** Original (pre-discount) price, if the product had one — powers
   * the "you're saving ₹X" display on the cart page. */
  comparePrice?: number;

  quantity: number;

  stock: number;

  addedAt: string;
}

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (
  productId: string,
  color: string,
  size: string
) => void;

  updateQuantity: (
  productId: string,
  color: string,
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
    cartItem.productId === item.productId &&
    cartItem.color === item.color &&
    cartItem.size === item.size
);

        if (existingItem) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.productId === item.productId &&
cartItem.color === item.color &&
cartItem.size === item.size
                ? {
                    ...cartItem,
                    quantity: Math.min(
                      cartItem.quantity + item.quantity,
                      cartItem.stock
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

      removeFromCart: (productId, color, size) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
item.color === color &&
item.size === size
              )
          ),
        });
      },
            updateQuantity: (
  productId,
  color,
  size,
  quantity
) => {
        set({
          items: get().items.map((item) => {
            if (
              item.productId === productId &&
item.color === color &&
item.size === size
            ) {
              return {
                ...item,
                quantity: Math.max(
                  1,
                  Math.min(quantity, item.stock)
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