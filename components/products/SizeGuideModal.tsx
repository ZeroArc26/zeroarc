"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, Sparkles, ArrowRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SIZE_CHARTS } from "@/lib/constants/sizeCharts";

// Same calculation as /size-guide's full calculator, kept in sync
// intentionally — this modal is a quick in-context version of it.
const WEIGHT_MIDPOINTS = [50, 60, 70, 80, 90, 102.5, 117.5];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const HEIGHTS = [
  "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"",
  "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"",
  "6'2\"", "6'3\"", "6'4\"", "6'5\"",
];
const WEIGHTS = Array.from({ length: 19 }, (_, i) => 40 + i * 5);
const FIT_PREFERENCES = ["Oversized", "Regular", "Slim"];

function heightToInches(height: string) {
  const match = height.match(/(\d+)'(\d+)"/);
  if (!match) return 67;
  return parseInt(match[1]) * 12 + parseInt(match[2]);
}

function calculateSize(h: string, w: string, fit: string) {
  if (!h || !w) return null;

  const weightNum = parseInt(w);
  const heightIn = heightToInches(h);

  let closestIndex = 0;
  let smallestDiff = Infinity;
  WEIGHT_MIDPOINTS.forEach((mid, i) => {
    const diff = Math.abs(weightNum - mid);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = i;
    }
  });

  const lowerMid = WEIGHT_MIDPOINTS[closestIndex - 1];
  const upperMid = WEIGHT_MIDPOINTS[closestIndex + 1];

  if (upperMid !== undefined && weightNum > (WEIGHT_MIDPOINTS[closestIndex] + upperMid) / 2 - 3) {
    if (heightIn >= 70) closestIndex = Math.min(closestIndex + 1, SIZES.length - 1);
  } else if (lowerMid !== undefined && weightNum < (WEIGHT_MIDPOINTS[closestIndex] + lowerMid) / 2 + 3) {
    if (heightIn <= 63) closestIndex = Math.max(closestIndex - 1, 0);
  }

  if (fit === "Regular") closestIndex -= 1;
  if (fit === "Slim") closestIndex -= 2;

  closestIndex = Math.max(0, Math.min(closestIndex, SIZES.length - 1));

  return SIZES[closestIndex];
}

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFit?: "Oversized" | "Regular";
}

export default function SizeGuideModal({
  open,
  onOpenChange,
  defaultFit = "Oversized",
}: SizeGuideModalProps) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitPref, setFitPref] = useState<string>(defaultFit);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setResult(calculateSize(height, weight, fitPref));
  }, [height, weight, fitPref]);

  // The "Slim" calculator preference has no dedicated chart data yet —
  // fall back to showing the Regular chart alongside it for now.
  const activeChart = fitPref === "Oversized" ? SIZE_CHARTS.oversized : SIZE_CHARTS.regular;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border border-zinc-200 bg-white text-black sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-black">Size Guide</DialogTitle>
        </DialogHeader>

        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Showing: {fitPref === "Oversized" ? "Oversized" : "Regular"} Fit chart
          {" "}— change this in the calculator below.
        </p>

        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-violet-50 text-left">
                <th className="px-3 py-2.5 font-bold text-black">Size</th>
                <th className="px-3 py-2.5 font-bold text-black">Chest (in)</th>
                <th className="px-3 py-2.5 font-bold text-black">Length (in)</th>
                <th className="px-3 py-2.5 font-bold text-black">Shoulder (in)</th>
              </tr>
            </thead>
            <tbody>
              {activeChart.map((row) => (
                <tr key={row.size} className="border-b border-zinc-100 last:border-0">
                  <td className="px-3 py-2.5 font-bold text-black">{row.size}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{row.chest}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{row.length}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-xl border border-zinc-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-black">
            <Sparkles className="h-4 w-4 text-violet-600" />
            Quick Size Calculator
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-black outline-none focus:border-violet-500"
            >
              <option value="">Height</option>
              {HEIGHTS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-black outline-none focus:border-violet-500"
            >
              <option value="">Weight</option>
              {WEIGHTS.map((w) => (
                <option key={w} value={w}>{w} kg</option>
              ))}
            </select>

            <select
              value={fitPref}
              onChange={(e) => setFitPref(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-black outline-none focus:border-violet-500"
            >
              {FIT_PREFERENCES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {result && (
            <div className="mt-3 rounded-lg bg-violet-50 p-3 text-center">
              <p className="text-xs text-zinc-500">Recommended Size</p>
              <p className="text-xl font-black text-violet-600">{result}</p>
            </div>
          )}

          <div className="mt-3 flex items-start gap-2 text-xs text-zinc-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
            Approximate recommendation — size may vary ±0.5-1 inch.
          </div>
        </div>

        <Link
          href="/size-guide"
          target="_blank"
          className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-violet-600 hover:underline"
        >
          View full size & fit guide
          <ArrowRight className="h-4 w-4" />
        </Link>
      </DialogContent>
    </Dialog>
  );
}
