"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings/updateSettings";

export default function NotificationsSection({ initial }: { initial: any }) {
  const [form, setForm] = useState({
    newOrderEmail: initial?.newOrderEmail ?? true,
    lowStockEmail: initial?.lowStockEmail ?? true,
    globalLowStockThreshold: initial?.globalLowStockThreshold ?? 5,
    notifyEmail: initial?.notifyEmail || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateSettings("notifications", form);
      setMessage(result.success ? "Saved successfully." : result.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Notification Email
        </label>
        <input
          value={form.notifyEmail}
          onChange={(e) => setForm({ ...form, notifyEmail: e.target.value })}
          placeholder="admin@zeroarc.in"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div>
          <p className="text-sm font-semibold text-white">New Order Alerts</p>
          <p className="text-xs text-zinc-500">Get emailed whenever a new order is placed.</p>
        </div>
        <button
          onClick={() => setForm({ ...form, newOrderEmail: !form.newOrderEmail })}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            form.newOrderEmail
              ? "bg-violet-600 text-white"
              : "border border-zinc-700 text-zinc-400"
          }`}
        >
          {form.newOrderEmail ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div>
          <p className="text-sm font-semibold text-white">Low Stock Alerts</p>
          <p className="text-xs text-zinc-500">Get emailed when a variant falls below threshold.</p>
        </div>
        <button
          onClick={() => setForm({ ...form, lowStockEmail: !form.lowStockEmail })}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            form.lowStockEmail
              ? "bg-violet-600 text-white"
              : "border border-zinc-700 text-zinc-400"
          }`}
        >
          {form.lowStockEmail ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Global Low Stock Threshold (default for new variants)
        </label>
        <input
          type="number"
          value={form.globalLowStockThreshold}
          onChange={(e) =>
            setForm({ ...form, globalLowStockThreshold: Number(e.target.value) })
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white sm:w-64"
        />
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-800 pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Notification Settings"}
        </button>
        {message && <p className="text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}