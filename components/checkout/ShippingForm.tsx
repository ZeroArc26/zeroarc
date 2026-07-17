"use client";

export default function ShippingForm() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Shipping Address
      </h2>

      <div className="grid gap-5">

        <input
          type="text"
          placeholder="Full Name"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
        />

        <textarea
          rows={4}
          placeholder="Full Address"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="City"
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
          />

          <input
            type="text"
            placeholder="State"
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
          />

        </div>

        <input
          type="text"
          placeholder="PIN Code"
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-purple-500"
        />

      </div>
    </div>
  );
}