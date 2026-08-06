"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Printer, Truck, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  trackingId?: string;
  hasShippingLabel?: boolean;
}

export default function ShippingLabelActions({
  orderId,
  trackingId,
  hasShippingLabel = false,
}: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch(
        `/api/orders/${orderId}/shipping-label/generate`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to generate shipping label.");
    } finally {
      setGenerating(false);
    }
  }

  function handlePrint() {
    const win = window.open(
      `/api/orders/${orderId}/shipping-label`,
      "_blank"
    );
    win?.addEventListener("load", () => win.print());
  }

  const previewClass = !hasShippingLabel
    ? "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-sm font-medium text-white transition pointer-events-none cursor-not-allowed opacity-40"
    : "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-sm font-medium text-white transition hover:border-violet-500 hover:bg-zinc-800";

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        <Truck className="h-5 w-5 text-violet-400" />
        Shipping Label
      </h2>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="text-xs font-medium text-zinc-500">Tracking ID</p>
        <p className="mt-1 break-all font-mono text-sm text-white">
          {trackingId ?? "Not Generated"}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating && <Loader2 className="h-4 w-4 animate-spin" />}
          {generating ? "Generating..." : "Generate Label"}
        </button>

        <a href={`/api/orders/${orderId}/shipping-label`} target="_blank" rel="noopener noreferrer" className={previewClass}>
          <Eye className="h-4 w-4" />
          Preview Label
        </a>

        <a href={`/api/orders/${orderId}/shipping-label?download=1`} className={previewClass}>
          <Download className="h-4 w-4" />
          Download PDF
        </a>

        <button
          onClick={handlePrint}
          disabled={!hasShippingLabel}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-sm font-medium text-white transition hover:border-violet-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Printer className="h-4 w-4" />
          Print Label
        </button>
      </div>
    </div>
  );
}