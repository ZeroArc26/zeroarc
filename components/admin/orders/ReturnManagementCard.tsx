"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RotateCcw, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReturnInfo {
  status: string;
  reason?: string;
  comments?: string;
  images?: string[];
  requestedAt?: string;
  pickupDate?: string;
  pickupAwb?: string;
  pickupCourier?: string;
  refundAmount?: number;
  refundedAt?: string;
  adminNotes?: string;
}

interface Props {
  orderId: string;
  returnInfo: ReturnInfo;
  grandTotal: number;
}

const STATUS_OPTIONS = [
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "pickup_scheduled", label: "Pickup Scheduled" },
  { value: "picked_up", label: "Picked Up" },
  { value: "refunded", label: "Refunded" },
];

export default function ReturnManagementCard({
  orderId,
  returnInfo,
  grandTotal,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(returnInfo.status);
  const [pickupDate, setPickupDate] = useState(
    returnInfo.pickupDate ? returnInfo.pickupDate.slice(0, 10) : ""
  );
  const [refundAmount, setRefundAmount] = useState(
    returnInfo.refundAmount ?? grandTotal
  );
  const [adminNotes, setAdminNotes] = useState(returnInfo.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  async function handleUpdate() {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          pickupDate: pickupDate || undefined,
          refundAmount: status === "refunded" ? refundAmount : undefined,
          adminNotes,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update return.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        <RotateCcw className="h-5 w-5 text-violet-400" />
        Return / Refund Management
      </h2>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="text-xs font-medium text-zinc-500">Customer's Reason</p>
        <p className="mt-1 text-sm text-white">{returnInfo.reason || "—"}</p>
        {returnInfo.comments && (
          <>
            <p className="mt-3 text-xs font-medium text-zinc-500">Comments</p>
            <p className="mt-1 text-sm text-zinc-300">{returnInfo.comments}</p>
          </>
        )}
        {returnInfo.requestedAt && (
          <p className="mt-3 text-xs text-zinc-500">
            Requested on{" "}
            {new Date(returnInfo.requestedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}

        {returnInfo.images && returnInfo.images.length > 0 && (
          <>
            <p className="mt-4 text-xs font-medium text-zinc-500">
              Photos ({returnInfo.images.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {returnInfo.images.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setZoomedImage(url)}
                  className="relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-700 transition hover:border-violet-500"
                >
                  <Image src={url} alt="Return photo" fill className="object-cover" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-300">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-zinc-700 bg-zinc-950 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {returnInfo.pickupAwb && (
          <div className="rounded-2xl border border-emerald-800 bg-emerald-950/30 p-4">
            <p className="text-xs font-medium text-emerald-400">
              Reverse Pickup Booked with {returnInfo.pickupCourier}
            </p>
            <p className="mt-1 font-mono text-sm text-white">
              AWB: {returnInfo.pickupAwb}
            </p>
          </div>
        )}

        {status === "pickup_scheduled" && (
          <div className="space-y-2">
            <Label className="text-zinc-300">Pickup Date</Label>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="border-zinc-700 bg-zinc-950 text-white"
            />
          </div>
        )}

        {status === "refunded" && (
          <div className="space-y-2">
            <Label className="text-zinc-300">Refund Amount (₹)</Label>
            <Input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              className="border-zinc-700 bg-zinc-950 text-white"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-zinc-300">Admin Notes (internal)</Label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
          />
        </div>

        <Button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-500"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? "Updating..." : "Update Return Status"}
        </Button>
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[80vh] w-full max-w-2xl">
            <Image
              src={zoomedImage}
              alt="Return photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}