"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Printer, Truck, Loader2, Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  orderId: string;
  trackingId?: string;
  hasShippingLabel?: boolean;
  courierPartner?: string;
  awbNumber?: string;
  isProvisionalAwb?: boolean;
}

export default function ShippingLabelActions({
  orderId,
  trackingId,
  hasShippingLabel = false,
  courierPartner = "",
  awbNumber = "",
  isProvisionalAwb = false,
}: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formAwb, setFormAwb] = useState(awbNumber);
  const [formCourier, setFormCourier] = useState(courierPartner || "Delhivery");
  const [formTracking, setFormTracking] = useState(trackingId || "");

  const previewClass = !hasShippingLabel
    ? "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-sm font-medium text-white transition pointer-events-none cursor-not-allowed opacity-40"
    : "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-sm font-medium text-white transition hover:border-violet-500 hover:bg-zinc-800";

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch(
        `/api/orders/${orderId}/shipping-label/generate`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (data.warning) {
        alert(data.warning);
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to generate shipping label.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveEdit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/shipping-label`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          awbNumber: formAwb,
          courierPartner: formCourier,
          trackingId: formTracking,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update shipping label.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    const win = window.open(
      `/api/orders/${orderId}/shipping-label`,
      "_blank"
    );
    win?.addEventListener("load", () => win.print());
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        <Truck className="h-5 w-5 text-violet-400" />
        Shipping Label
      </h2>

      {/* Tracking Information */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Tracking ID</p>
          {isProvisionalAwb && hasShippingLabel && (
            <span className="rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-yellow-400">
              Provisional AWB
            </span>
          )}
        </div>
        <p className="mt-1 break-all font-mono text-sm text-white">
          {trackingId ?? "Not Generated"}
        </p>
        {hasShippingLabel && (
          <p className="mt-2 break-all text-xs text-zinc-500">
            {courierPartner} — AWB: {awbNumber || "Not set"}
          </p>
        )}
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

        {hasShippingLabel && (
          <button
            onClick={() => setEditOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-sm font-medium text-white transition hover:border-violet-500 hover:bg-zinc-800"
          >
            <Pencil className="h-4 w-4" />
            Edit AWB / Courier Details
          </button>
        )}

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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Edit AWB / Courier Details</DialogTitle>
          </DialogHeader>

          <p className="text-xs text-zinc-400">
            Use this to enter the real AWB number after manually creating the
            shipment on the Delhivery dashboard. This will mark the label as
            non-provisional.
          </p>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Courier Partner</Label>
              <Input
                value={formCourier}
                onChange={(e) => setFormCourier(e.target.value)}
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>AWB Number</Label>
              <Input
                value={formAwb}
                onChange={(e) => setFormAwb(e.target.value)}
                placeholder="Real AWB from Delhivery dashboard"
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Tracking ID (internal, optional to change)</Label>
              <Input
                value={formTracking}
                onChange={(e) => setFormTracking(e.target.value)}
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="bg-violet-600 hover:bg-violet-500">
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}