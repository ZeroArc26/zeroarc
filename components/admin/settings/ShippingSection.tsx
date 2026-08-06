"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings/updateSettings";

export default function ShippingSection({ initial }: { initial: any }) {
  const [form, setForm] = useState({
    freeShippingThreshold: initial?.freeShippingThreshold ?? 999,
    standardShippingRate: initial?.standardShippingRate ?? 0,
    expressShippingRate: initial?.expressShippingRate ?? 149,
    codCharge: initial?.codCharge ?? 99,
    codAvailable: initial?.codAvailable ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateSettings("shipping", form);
      setMessage(result.success ? "Saved successfully." : result.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Free Shipping Threshold (₹)
          </label>
          <input
            type="number"
            value={form.freeShippingThreshold}
            onChange={(e) =>
              setForm({ ...form, freeShippingThreshold: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Standard Shipping Rate (₹)
          </label>
          <input
            type="number"
            value={form.standardShippingRate}
            onChange={(e) =>
              setForm({ ...form, standardShippingRate: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Express Shipping Rate (₹)
          </label>
          <input
            type="number"
            value={form.expressShippingRate}
            onChange={(e) =>
              setForm({ ...form, expressShippingRate: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">COD Charge (₹)</label>
          <input
            type="number"
            value={form.codCharge}
            onChange={(e) => setForm({ ...form, codCharge: Number(e.target.value) })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div>
          <p className="text-sm font-semibold text-white">Cash on Delivery</p>
          <p className="text-xs text-zinc-500">Allow customers to pay on delivery.</p>
        </div>
        <button
          onClick={() => setForm({ ...form, codAvailable: !form.codAvailable })}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            form.codAvailable
              ? "bg-violet-600 text-white"
              : "border border-zinc-700 text-zinc-400"
          }`}
        >
          {form.codAvailable ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-800 pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Shipping Settings"}
        </button>
        {message && <p className="text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}