"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const PRESETS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
];

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStart = searchParams.get("start") || "";
  const currentEnd = searchParams.get("end") || "";

  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(currentStart);
  const [customEnd, setCustomEnd] = useState(currentEnd);

  function applyPreset(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));

    router.push(
      `/admin/dashboard/analytics?start=${formatDate(start)}&end=${formatDate(end)}`
    );
    setCustomOpen(false);
  }

  function applyCustom() {
    if (!customStart || !customEnd) return;
    router.push(
      `/admin/dashboard/analytics?start=${customStart}&end=${customEnd}`
    );
  }

  const activeDays =
    currentStart && currentEnd
      ? Math.round(
          (new Date(currentEnd).getTime() - new Date(currentStart).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 30;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.days}
          onClick={() => applyPreset(preset.days)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeDays === preset.days && !customOpen
              ? "bg-violet-600 text-white"
              : "border border-zinc-700 text-zinc-300 hover:border-violet-500"
          }`}
        >
          {preset.label}
        </button>
      ))}

      <button
        onClick={() => setCustomOpen((v) => !v)}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          customOpen
            ? "bg-violet-600 text-white"
            : "border border-zinc-700 text-zinc-300 hover:border-violet-500"
        }`}
      >
        Custom
      </button>

      {customOpen && (
        <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 p-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
          />
          <span className="text-zinc-500">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
          />
          <button
            onClick={applyCustom}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}