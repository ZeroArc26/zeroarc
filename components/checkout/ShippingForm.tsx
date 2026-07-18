"use client";

import { ChangeEvent } from "react";
import { useShippingStore } from "@/stores/shippingStore";

export default function ShippingForm() {
  const shipping = useShippingStore((state) => state.shipping);
  const setShipping = useShippingStore((state) => state.setShipping);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <div className="mb-8">
        <h2 className="text-2xl font-black text-white">
          Shipping Details
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Where should we deliver your ZEROARC order?
        </p>
      </div>

      <div className="grid gap-5">

        <input
          type="text"
          name="fullName"
          autoComplete="name"
          value={shipping.fullName}
          onChange={handleChange}
          placeholder="Full Name *"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={shipping.phone}
          onChange={handleChange}
          placeholder="Phone Number *"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

        <input
          type="email"
          name="email"
          autoComplete="email"
          value={shipping.email}
          onChange={handleChange}
          placeholder="Email Address *"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

        <input
          type="text"
          name="house"
          autoComplete="address-line1"
          value={shipping.house}
          onChange={handleChange}
          placeholder="House / Flat No. *"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

        <input
          type="text"
          name="street"
          autoComplete="address-line2"
          value={shipping.street}
          onChange={handleChange}
          placeholder="Street / Area *"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

        <input
          type="text"
          name="landmark"
          value={shipping.landmark}
          onChange={handleChange}
          placeholder="Landmark (Optional)"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            value={shipping.city}
            onChange={handleChange}
            placeholder="City *"
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
          />

          <input
            type="text"
            name="state"
            autoComplete="address-level1"
            value={shipping.state}
            onChange={handleChange}
            placeholder="State *"
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
          />

                    <input
            type="text"
            name="pincode"
            autoComplete="postal-code"
            value={shipping.pincode}
            onChange={handleChange}
            placeholder="PIN Code *"
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
          />

        </div>

        <input
          type="text"
          name="country"
          value={shipping.country}
          readOnly
          className="cursor-not-allowed rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-zinc-400 outline-none"
        />

        <textarea
          rows={3}
          name="instructions"
          value={shipping.instructions}
          onChange={handleChange}
          placeholder="Delivery Instructions (Optional)"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-purple-500"
        />

      </div>

    </div>
  );
}