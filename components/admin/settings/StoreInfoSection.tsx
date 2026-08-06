"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

import { updateSettings } from "@/lib/actions/settings/updateSettings";

export default function StoreInfoSection({ initial }: { initial: any }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    tagline: initial?.tagline || "",
    logo: initial?.logo || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    website: initial?.website || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "store");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        setForm((f) => ({ ...f, logo: data.url }));
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateSettings("store", form);
      setMessage(result.success ? "Saved successfully." : result.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">Store Logo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800">
            {form.logo ? (
              <Image src={form.logo} alt="Logo" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                No Logo
              </div>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:border-violet-500">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Change Logo"}
            <input type="file" accept="image/*" onChange={handleLogoChange} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Store Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Support Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Support Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">Website</label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
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
          {saving ? "Saving..." : "Save Store Info"}
        </button>
        {message && <p className="text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}