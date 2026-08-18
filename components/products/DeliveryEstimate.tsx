"use client";

import { useState } from "react";
import { MapPin, Truck, Zap, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface EstimateResult {
  serviceable: boolean;
  message?: string;
  codAvailable?: boolean;
  standard?: { from: string; to: string };
  express?: { from: string; to: string };
}

export default function DeliveryEstimate() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);

  async function handleCheck() {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({
        serviceable: false,
        message: "Please enter a valid 6-digit pincode.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/delivery-estimate/${pincode}`);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({
        serviceable: false,
        message: "Couldn't check delivery right now. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-black">
        <MapPin className="h-4 w-4 text-violet-600" />
        Check Delivery Date
      </p>

      <div className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) =>
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Enter pincode"
          className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading}
          className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </div>

      {result && !result.serviceable && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-600">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {result.message}
        </div>
      )}

      {result && result.serviceable && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Delivers to your area
            {result.codAvailable && " · Cash on Delivery available"}
          </div>

          {result.standard && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Truck className="h-4 w-4 shrink-0 text-zinc-400" />
              <span>
                <span className="font-medium text-black">Standard:</span>{" "}
                {result.standard.from} – {result.standard.to}
              </span>
            </div>
          )}

          {result.express && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Zap className="h-4 w-4 shrink-0 text-zinc-400" />
              <span>
                <span className="font-medium text-black">Express:</span>{" "}
                {result.express.from} – {result.express.to}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
