"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings/updateSettings";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi",
];

export default function TaxSection({ initial }: { initial: any }) {
  const [form, setForm] = useState({
    gstin: initial?.gstin || "",
    pan: initial?.pan || "",
    companyState: initial?.companyState || "West Bengal",
    defaultGstRate: initial?.defaultGstRate ?? 18,
    pricesIncludeTax: initial?.pricesIncludeTax ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateSettings("tax", form);
      setMessage(result.success ? "Saved successfully." : result.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <p className="text-sm text-zinc-500">
        Company State decides whether invoices calculate CGST+SGST
        (intrastate) or IGST (interstate) based on the customer&apos;s
        shipping address.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">GSTIN</label>
          <input
            value={form.gstin}
            onChange={(e) => setForm({ ...form, gstin: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">PAN</label>
          <input
            value={form.pan}
            onChange={(e) => setForm({ ...form, pan: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Company State</label>
          <select
            value={form.companyState}
            onChange={(e) => setForm({ ...form, companyState: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Default GST Rate (%)</label>
          <input
            type="number"
            value={form.defaultGstRate}
            onChange={(e) => setForm({ ...form, defaultGstRate: Number(e.target.value) })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div>
          <p className="text-sm font-semibold text-white">Prices Include Tax</p>
          <p className="text-xs text-zinc-500">
            If on, product prices are treated as GST-inclusive (tax is
            back-calculated, not added on top).
          </p>
        </div>
        <button
          onClick={() => setForm({ ...form, pricesIncludeTax: !form.pricesIncludeTax })}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            form.pricesIncludeTax
              ? "bg-violet-600 text-white"
              : "border border-zinc-700 text-zinc-400"
          }`}
        >
          {form.pricesIncludeTax ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-800 pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Tax Settings"}
        </button>
        {message && <p className="text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}