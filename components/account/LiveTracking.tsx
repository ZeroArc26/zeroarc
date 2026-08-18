"use client";

import { useEffect, useState } from "react";
import { PackageCheck, Truck, Loader2 } from "lucide-react";

interface Scan {
  ScanDetail: {
    ScanDateTime: string;
    Scan: string;
    ScannedLocation: string;
    Instructions: string;
  };
}

interface TrackingState {
  status: "loading" | "unavailable" | "available";
  currentStatus?: string;
  scans?: Scan[];
  message?: string;
}

export default function LiveTracking({ orderId }: { orderId: string }) {
  const [state, setState] = useState<TrackingState>({ status: "loading" });

  useEffect(() => {
    fetch(`/api/orders/${orderId}/track`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setState({ status: "unavailable", message: data.message });
          return;
        }

        const shipment = data.raw?.ShipmentData?.[0]?.Shipment;
        const scans: Scan[] = shipment?.Scans || [];

        if (scans.length === 0) {
          setState({
            status: "unavailable",
            message: "No live scan updates from the courier yet.",
          });
          return;
        }

        setState({
          status: "available",
          currentStatus: shipment?.Status?.Status,
          // Delhivery returns oldest-first — flip so the newest scan
          // (most relevant to the customer) shows at the top.
          scans: [...scans].reverse(),
        });
      })
      .catch(() => {
        setState({
          status: "unavailable",
          message: "Couldn't reach the courier's tracking service.",
        });
      });
  }, [orderId]);

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking live courier tracking...
      </div>
    );
  }

  if (state.status === "unavailable") {
    // Not an error to show alarmingly — this is expected until the
    // order actually ships. The order's own internal timeline (shown
    // separately) still covers order-placed/confirmed milestones.
    return null;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-black">
          <Truck className="h-4 w-4 text-violet-600" />
          Live Courier Tracking
        </h2>
        {state.currentStatus && (
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase text-violet-700">
            {state.currentStatus}
          </span>
        )}
      </div>

      <div className="relative pl-2">
        {state.scans!.map((scan, i) => (
          <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
            {i < state.scans!.length - 1 && (
              <span className="absolute left-[9px] top-6 h-full w-0.5 bg-zinc-200" />
            )}

            <PackageCheck
              className={`relative z-10 h-5 w-5 shrink-0 ${
                i === 0 ? "text-violet-600" : "text-zinc-300"
              }`}
            />

            <div>
              <p className="text-sm font-semibold text-black">
                {scan.ScanDetail.Instructions || scan.ScanDetail.Scan}
              </p>
              {scan.ScanDetail.ScannedLocation && (
                <p className="text-xs text-zinc-500">
                  {scan.ScanDetail.ScannedLocation}
                </p>
              )}
              {scan.ScanDetail.ScanDateTime && (
                <p className="text-xs text-zinc-400">
                  {new Date(scan.ScanDetail.ScanDateTime).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
