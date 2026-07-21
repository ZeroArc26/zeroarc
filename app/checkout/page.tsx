"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/stores/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const router = useRouter();

const clearCart = useCartStore(
  (state) => state.clearCart
);

const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
});

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

  const getTotalItems = useCartStore(
    (state) => state.getTotalItems
  );
  const getTotalPrice = useCartStore(
    (state) => state.getTotalPrice
  );

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-black">
          Checkout
        </h1>

        <p className="mt-3 text-zinc-400">
          Complete your order securely.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">

          {/* LEFT */}

          <div className="space-y-8">

            {/* Customer */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="text-2xl font-bold">
                Customer Details
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                <input
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
  placeholder="First Name"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
/>

                <input
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
  placeholder="Last Name"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
/>

                <input
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Email"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500 md:col-span-2"
/>

                <input
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Phone Number"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500 md:col-span-2"
/>

              </div>

            </div>

            {/* Shipping */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="text-2xl font-bold">
                Shipping Address
              </h2>

              <div className="mt-8 grid gap-5">

                <input
  name="address"
  value={formData.address}
  onChange={handleChange}
  placeholder="Street Address"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
/>

                <div className="grid gap-5 md:grid-cols-2">

                  <input
  name="city"
  value={formData.city}
  onChange={handleChange}
  placeholder="City"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
/>

                  <input
  name="state"
  value={formData.state}
  onChange={handleChange}
  placeholder="State"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
/>

                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <input
  name="pincode"
  value={formData.pincode}
  onChange={handleChange}
  placeholder="Pincode"
  className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
/>

                  <input
                   name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-purple-500"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="sticky top-28 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="mt-8 space-y-5">

                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}`}
                    className="flex items-center justify-between"
                  >
                    <div>

                      <p className="font-semibold">
                        {item.title}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {item.color} • {item.size}
                      </p>

                    </div>

                    <p className="font-bold">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>
                ))}

                <div className="border-t border-zinc-800 pt-5">

                  <div className="flex justify-between">

                    <span className="text-zinc-400">
                      Items
                    </span>

                    <span>
                      {totalItems}
                    </span>

                  </div>

                  <div className="mt-4 flex justify-between">

                    <span className="text-zinc-400">
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal}
                    </span>

                  </div>

                  <div className="mt-4 flex justify-between">

                    <span className="text-zinc-400">
                      Shipping
                    </span>

                    <span>
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping}`}
                    </span>

                  </div>

                  <div className="mt-6 flex justify-between border-t border-zinc-800 pt-6 text-xl font-bold">

                    <span>Total</span>

                    <span className="text-purple-400">
                      ₹{total}
                    </span>

                  </div>

                </div>

              </div>

              <button
  onClick={async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },

          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
          },

          products: items,

          totalItems,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error();
      }

      toast.success("Order placed successfully!");

      clearCart();

      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.02] disabled:opacity-60"
>
  {loading ? "Placing Order..." : "Place Order"}
</button>

              <p className="mt-5 text-center text-sm text-zinc-500">
                Secure Checkout • Razorpay Integration Coming Next
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}