"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const getTotalPrice = useCartStore(
    (state) => state.getTotalPrice
  );

  const getTotalItems = useCartStore(
    (state) => state.getTotalItems
  );

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const shipping = totalPrice >= 999 ? 0 : 99;

  const grandTotal = totalPrice + shipping;

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-black">
          Shopping Cart
        </h1>

        <p className="mt-4 text-zinc-400">
          {totalItems} item(s) in your cart
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_420px]">

          {/* Cart Items */}

          <div className="space-y-6">

            {items.length === 0 ? (

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">

                <h2 className="text-2xl font-bold">
                  Your cart is empty
                </h2>

                <p className="mt-3 text-zinc-400">
                  Add some products to continue shopping.
                </p>

              </div>

            ) : (

              items.map((item) => (

                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
                >

                  <div className="flex items-center gap-5">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-28 w-28 rounded-xl object-cover"
                    />

                    <div>

                      <h3 className="text-xl font-bold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-zinc-400">
                        {item.color} • {item.size}
                      </p>

                      <p className="mt-2 font-semibold text-purple-400">
                        ₹{item.price}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <div className="mb-4 flex items-center justify-end gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.color,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="h-9 w-9 rounded-lg border border-zinc-700 hover:border-purple-500"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.color,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="h-9 w-9 rounded-lg border border-zinc-700 hover:border-purple-500"
                      >
                        +
                      </button>

                    </div>

                    <p className="text-2xl font-black">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.productId,
                          item.color,
                          item.size
                        )
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* Order Summary */}

          <div className="sticky top-28 h-fit rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Items
                </span>

                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Subtotal
                </span>

                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Shipping
                </span>

                <span>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t border-zinc-800 pt-5">

                <div className="flex justify-between text-xl font-bold">

                  <span>Total</span>

                  <span className="text-purple-400">
                    ₹{grandTotal}
                  </span>

                </div>

              </div>

            </div>

            <button
              onClick={() => router.push("/checkout")}
              disabled={items.length === 0}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
            </button>

            <p className="mt-5 text-center text-sm text-zinc-500">
              Free Shipping above ₹999
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}