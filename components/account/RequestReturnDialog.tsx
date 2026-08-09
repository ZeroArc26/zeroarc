"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  RotateCcw,
  X,
  PackageX,
  AlertTriangle,
  HelpCircle,
  Ban,
  MoreHorizontal,
  ImagePlus,
  Loader2,
} from "lucide-react";

const REASONS = [
  { value: "Wrong size ordered", icon: PackageX },
  { value: "Product damaged/defective", icon: AlertTriangle },
  { value: "Product not as described", icon: HelpCircle },
  { value: "Received wrong item", icon: Ban },
  { value: "No longer needed", icon: MoreHorizontal },
];

const MAX_IMAGES = 5;

export default function RequestReturnDialog({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setUploading(true);
    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          setImages((prev) => [...prev, data.url]);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload one or more images.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit() {
    if (!reason) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, comments, images }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to submit return request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
      >
        <RotateCcw className="h-4 w-4" />
        Return / Exchange
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50">
                  <RotateCcw className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black">Request a Return</h3>
                  <p className="text-xs text-zinc-500">
                    Returns accepted within 7 days of delivery
                  </p>
                </div>
              </div>
              <button
                onClick={() => !submitting && setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  What's the reason?
                </label>
                <div className="space-y-2">
                  {REASONS.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReason(value)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${
                        reason === value
                          ? "border-violet-600 bg-violet-50 text-violet-700"
                          : "border-zinc-200 text-zinc-700 hover:border-violet-300"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          reason === value ? "text-violet-600" : "text-zinc-400"
                        }`}
                      />
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Additional comments
                  <span className="ml-1.5 font-normal normal-case text-zinc-400">(optional)</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  placeholder="Tell us more about the issue..."
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Photos
                  <span className="ml-1.5 font-normal normal-case text-zinc-400">
                    (optional, up to {MAX_IMAGES})
                  </span>
                </label>

                <div className="flex flex-wrap gap-3">
                  {images.map((url) => (
                    <div
                      key={url}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-200"
                    >
                      <Image src={url} alt="Return photo" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-300 text-zinc-400 transition hover:border-violet-400 hover:text-violet-500">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <ImagePlus className="h-5 w-5" />
                          <span className="text-[10px] font-medium">Add</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  Photos help us process your return faster, especially for damaged
                  or incorrect items.
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-zinc-100 bg-zinc-50 px-6 py-4">
              <button
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="flex-1 rounded-xl border border-zinc-300 bg-white py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !reason || uploading}
                className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}