"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SavedAddress {
  _id: string;
  label: string;
  name: string;
  pincode: string;
  city: string;
  isDefault: boolean;
}

interface DeliveryPincodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (pincode: string, city: string) => void;
}

export default function DeliveryPincodeModal({
  open,
  onOpenChange,
  onSelect,
}: DeliveryPincodeModalProps) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [pincodeInput, setPincodeInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkedResult, setCheckedResult] = useState<{
    pincode: string;
    city: string;
    state: string;
  } | null>(null);

  const [selected, setSelected] = useState<{
    pincode: string;
    city: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    setLoadingAddresses(true);
    fetch("/api/account/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSavedAddresses(data.addresses);
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  }, [open]);

  async function handleCheck() {
    if (!/^\d{6}$/.test(pincodeInput)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    setChecking(true);
    setCheckedResult(null);

    try {
      const res = await fetch(`/api/pincode/${pincodeInput}`);
      const data = await res.json();

      if (!data.success) {
        toast.error("We don't recognize this pincode.");
        return;
      }

      setCheckedResult({
        pincode: pincodeInput,
        city: data.city,
        state: data.state,
      });
      setSelected({ pincode: pincodeInput, city: data.city });
    } catch (error) {
      console.error(error);
      toast.error("Failed to check pincode.");
    } finally {
      setChecking(false);
    }
  }

  function handleConfirm() {
    if (!selected) {
      toast.error("Please select or check a pincode first.");
      return;
    }

    onSelect(selected.pincode, selected.city);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-zinc-200 bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-black">
            Select Delivery Pincode
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <input
            value={pincodeInput}
            onChange={(e) =>
              setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter pincode"
            className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
          />
          <button
            onClick={handleCheck}
            disabled={checking}
            className="rounded-xl border border-zinc-300 px-5 text-sm font-semibold text-violet-600 transition hover:border-violet-400 disabled:opacity-50"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
          </button>
        </div>

        {checkedResult && (
          <p className="text-xs text-zinc-500">
            Delivers to {checkedResult.city}, {checkedResult.state}
          </p>
        )}

        {!loadingAddresses && savedAddresses.length > 0 && (
          <div>
            <h3 className="mb-2 mt-2 text-sm font-bold text-black">
              Saved Addresses
            </h3>

            <div className="space-y-2">
              {savedAddresses.map((addr) => (
                <button
                  key={addr._id}
                  onClick={() =>
                    setSelected({ pincode: addr.pincode, city: addr.city })
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                    selected?.pincode === addr.pincode &&
                    selected?.city === addr.city
                      ? "border-violet-600 bg-violet-50"
                      : "border-zinc-200 hover:border-violet-300"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-violet-600" />
                    <span className="font-medium text-black">
                      {addr.name}, {addr.pincode}
                    </span>
                    <span className="rounded-md border border-violet-200 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-600">
                      {addr.label}
                    </span>
                  </div>

                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      selected?.pincode === addr.pincode &&
                      selected?.city === addr.city
                        ? "border-violet-600 bg-violet-600"
                        : "border-zinc-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="mt-2 w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Select Pincode
        </button>
      </DialogContent>
    </Dialog>
  );
}
