"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/stores/cartStore";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const getTotalItems = useCartStore(
    (state) => state.getTotalItems
  );

  const getTotalPrice = useCartStore(
    (state) => state.getTotalPrice
  );

const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

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

  paymentMethod: "ONLINE",
});

const totalItems = getTotalItems();
const subtotal = getTotalPrice();

const shipping =
  formData.paymentMethod === "ONLINE"
    ? 0
    : 99;

const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
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
      toast.error("Please fill all required fields.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email.");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return false;
    }

    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(formData.pincode)) {
      toast.error("Please enter a valid pincode.");
      return false;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    return true;
  }

    async function handleCheckout() {
    if (!validateForm()) return;

    setLoading(true);

    try {
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

          paymentMethod: formData.paymentMethod,

          products: items,

          totalItems,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await res.json();

if (!data.success) {
  throw new Error(data.message);
}

toast.success("Order Placed Successfully!");

// clearCart();

router.push(`/order-success?orderId=${data.order._id}`);

    } catch (error) {
      console.error(error);

      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
  return null;
}

  return (

        <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-black">
          Checkout
        </h1>

        <p className="mt-3 text-zinc-400">
          Complete your order.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">

          {/* Billing Form */}

          <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <div className="grid gap-6 md:grid-cols-2">

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
              />

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
              />

            </div>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              rows={3}
              placeholder="Address"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
            />

            <div className="grid gap-6 md:grid-cols-3">

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
              />

              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
              />

              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none"
              />

            </div>

            {/* Payment Method */}

<div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
  <h2 className="text-xl font-bold mb-5">
    Payment Method
  </h2>

  <div className="space-y-4">

    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-700 p-4 hover:border-violet-500">

      <div>
        <p className="font-semibold">
          Online Payment
        </p>

        <p className="text-sm text-green-400">
          FREE Shipping 🎉
        </p>
      </div>

      <input
        type="radio"
        name="paymentMethod"
        value="ONLINE"
        checked={formData.paymentMethod === "ONLINE"}
        onChange={handleChange}
      />

    </label>

    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-700 p-4 hover:border-violet-500">

      <div>
        <p className="font-semibold">
          Cash on Delivery
        </p>

        <p className="text-sm text-yellow-400">
          ₹99 Shipping Charge
        </p>
      </div>

      <input
        type="radio"
        name="paymentMethod"
        value="COD"
        checked={formData.paymentMethod === "COD"}
        onChange={handleChange}
      />

    </label>

  </div>
</div>

          </div>

          {/* Order Summary */}

          <div className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

            <div className="mt-8 space-y-4">

              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
  <span>Shipping</span>

  <span>
    {formData.paymentMethod === "ONLINE" ? (
      <span className="font-semibold text-green-400">
        FREE 🎉
      </span>
    ) : (
      `₹${shipping}`
    )}
  </span>
</div>

{formData.paymentMethod === "ONLINE" && (
  <p className="text-sm text-green-400">
    🎉 You saved ₹99 by choosing Online Payment.
  </p>
)}

              <div className="border-t border-zinc-800 pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold transition hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}