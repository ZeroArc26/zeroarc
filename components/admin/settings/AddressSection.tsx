"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings/updateSettings";

export default function AddressSection({ initial }: { initial: any }) {
  const [form, setForm] = useState({
    line1: initial?.line1 || "",
    line2: initial?.line2 || "",
    city: initial?.city || "",
    state: initial?.state || "",
    pincode: initial?.pincode || "",
    country: initial?.country || "India",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateSettings("address", form);
      setMessage(result.success ? "Saved successfully." : result.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <p className="text-sm text-zinc-500">
        This is your warehouse/pickup address — it appears on invoices and
        shipping labels.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">Address Line 1</label>
          <input
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">Address Line 2 (Optional)</label>
          <input
            value={form.line2}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">City</label>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">State</label>
          <input
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Pincode</label>
          <input
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Country</label>
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-800 pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
        {message && <p className="text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}