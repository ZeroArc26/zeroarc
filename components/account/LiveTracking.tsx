"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  Loader2,
  CircleCheck,
  ChevronDown,
} from "lucide-react";

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

const COLLAPSED_COUNT = 4;

function ScanStatusIcon({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const t = text.toLowerCase();

  if (t.includes("deliver")) return <CircleCheck className={className} />;
  if (t.includes("out for")) return <Truck className={className} />;
  if (t.includes("transit") || t.includes("dispatch"))
    return <Truck className={className} />;
  if (t.includes("pick")) return <Package className={className} />;
  return <MapPin className={className} />;
}

export default function LiveTracking({ orderId }: { orderId: string }) {
  const [state, setState] = useState<TrackingState>({ status: "loading" });
  const [expanded, setExpanded] = useState(false);

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
      <div className="flex items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
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

  const scans = state.scans!;
  const visibleScans = expanded ? scans : scans.slice(0, COLLAPSED_COUNT);
  const latest = scans[0];
  const latestText = latest.ScanDetail.Instructions || latest.ScanDetail.Scan;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {/* Hero status */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-800 p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <p className="relative text-xs font-semibold uppercase tracking-wide text-violet-200">
          Live Courier Tracking
        </p>

        <div className="relative mt-2 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <ScanStatusIcon text={latestText} className="h-[18px] w-[18px] text-white" />
          </div>
          <p className="text-lg font-black text-white">
            {state.currentStatus ||
              latest.ScanDetail.Instructions ||
              latest.ScanDetail.Scan}
          </p>
        </div>

        {latest.ScanDetail.ScannedLocation && (
          <p className="relative mt-4 flex items-center gap-1.5 text-xs text-violet-200">
            <MapPin className="h-3 w-3" />
            {latest.ScanDetail.ScannedLocation}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          {visibleScans.map((scan, i) => {
            const scanText = scan.ScanDetail.Instructions || scan.ScanDetail.Scan;
            const isLatest = i === 0;

            return (
              <div key={i} className="relative flex gap-4 pb-7 last:pb-0">
                {i < visibleScans.length - 1 && (
                  <span className="absolute left-[13px] top-7 h-full w-px bg-zinc-200" />
                )}

                <div
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    isLatest
                      ? "border-violet-600 bg-violet-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <ScanStatusIcon
                    text={scanText}
                    className={`h-3.5 w-3.5 ${
                      isLatest ? "text-violet-600" : "text-zinc-400"
                    }`}
                  />
                </div>

                <div className="pt-0.5">
                  <p
                    className={`text-sm font-semibold ${
                      isLatest ? "text-black" : "text-zinc-700"
                    }`}
                  >
                    {scan.ScanDetail.Instructions || scan.ScanDetail.Scan}
                  </p>
                  {scan.ScanDetail.ScannedLocation && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {scan.ScanDetail.ScannedLocation}
                    </p>
                  )}
                  {scan.ScanDetail.ScanDateTime && (
                    <p className="mt-0.5 text-xs text-zinc-400">
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
            );
          })}
        </div>

        {scans.length > COLLAPSED_COUNT && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:underline"
          >
            {expanded
              ? "Show less"
              : `Show ${scans.length - COLLAPSED_COUNT} earlier update${
                  scans.length - COLLAPSED_COUNT !== 1 ? "s" : ""
                }`}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
