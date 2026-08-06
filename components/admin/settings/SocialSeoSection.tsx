"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings/updateSettings";

export default function SocialSeoSection({
  initialSocial,
  initialSeo,
}: {
  initialSocial: any;
  initialSeo: any;
}) {
  const [social, setSocial] = useState({
    instagram: initialSocial?.instagram || "",
    facebook: initialSocial?.facebook || "",
    twitter: initialSocial?.twitter || "",
  });
  const [seo, setSeo] = useState({
    metaTitle: initialSeo?.metaTitle || "",
    metaDescription: initialSeo?.metaDescription || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const [r1, r2] = await Promise.all([
        updateSettings("social", social),
        updateSettings("seo", seo),
      ]);
      setMessage(
        r1.success && r2.success ? "Saved successfully." : "Failed to save some settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
        <h3 className="text-lg font-bold text-white">Social Links</h3>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Instagram</label>
            <input
              value={social.instagram}
              onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
              placeholder="https://instagram.com/zeroarc"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Facebook</label>
            <input
              value={social.facebook}
              onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Twitter / X</label>
            <input
              value={social.twitter}
              onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
        <h3 className="text-lg font-bold text-white">SEO Defaults</h3>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Meta Title</label>
          <input
            value={seo.metaTitle}
            onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Meta Description</label>
          <textarea
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Social & SEO"}
        </button>
        {message && <p className="text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
}