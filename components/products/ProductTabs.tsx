"use client";

import { useState } from "react";
import {
  Shirt,
  Layers,
  Sparkles,
  Droplet,
  Ruler,
  ArrowRight,
  PackageCheck,
  Truck,
  RotateCcw,
  PackageX,
  Ban,
  Wind,
  Flame,
} from "lucide-react";

const TABS = ["Description", "Details", "Size & Fit", "Shipping & Returns"] as const;

const SIZE_CHART = [
  { size: "S", chest: "38", length: "27", shoulder: "20" },
  { size: "M", chest: "40", length: "28", shoulder: "21" },
  { size: "L", chest: "42", length: "29", shoulder: "22" },
  { size: "XL", chest: "44", length: "30", shoulder: "23" },
  { size: "XXL", chest: "46", length: "31", shoulder: "24" },
  { size: "XXXL", chest: "48", length: "32", shoulder: "25" },
];

interface ProductTabsProps {
  description: string;
  fitType?: "slim" | "regular" | "oversized";
  fabric?: string;
  sleeveType?: string;
  neckType?: string;
  printType?: string;
  washCare?: string;
}

export default function ProductTabs({
  description,
  fitType,
  fabric,
  sleeveType,
  neckType,
  printType,
  washCare,
}: ProductTabsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");

  const specRows = [
    { label: "Fabric", value: fabric },
    { label: "Fit", value: fitType },
    { label: "Sleeve", value: sleeveType },
    { label: "Neck", value: neckType },
    { label: "Print Type", value: printType },
    { label: "Wash Care", value: washCare },
  ].filter((row) => !!row.value);

  const DETAILS = [
    {
      icon: Layers,
      title: fabric || "Premium Fabric",
      subtitle: "Soft, breathable & durable",
    },
    {
      icon: Shirt,
      title: fitType ? `${fitType[0].toUpperCase()}${fitType.slice(1)} Fit` : "Comfort Fit",
      subtitle: sleeveType || "Designed for everyday wear",
    },
    {
      icon: Sparkles,
      title: printType || "High Quality Print",
      subtitle: "Long-lasting & fade resistant",
    },
    {
      icon: Droplet,
      title: washCare || "Easy Care",
      subtitle: "Holds shape, wash after wash",
    },
  ];

  return (
    <div>
      {/* Tab headers */}
      <div className="flex gap-8 border-b border-zinc-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative pb-4 text-sm font-semibold uppercase tracking-wide transition ${
              active === tab ? "text-violet-600" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {tab}
            {active === tab && (
              <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-violet-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-8">
        {active === "Description" && (
          <p className="max-w-2xl leading-relaxed text-zinc-600">
            {description}
          </p>
        )}

        {active === "Details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DETAILS.map(({ icon: Icon, title, subtitle }) => (
                <div
                  key={title}
                  className="group flex items-start gap-4 rounded-2xl border border-zinc-200 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_8px_24px_-8px_rgba(139,92,246,0.25)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 transition-colors duration-200 group-hover:bg-violet-100">
                    <Icon className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec sheet — only shown if the admin has set at least one field */}
            {specRows.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 p-6">
                <p className="text-sm font-bold text-black">Specifications</p>

                <div className="mt-4 divide-y divide-zinc-100">
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="text-zinc-500">{row.label}</span>
                      <span className="font-medium capitalize text-black">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wash care icons */}
            <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-zinc-400" />
                <span className="text-xs text-zinc-500">Cold Wash</span>
              </div>
              <div className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-zinc-400" />
                <span className="text-xs text-zinc-500">Do Not Bleach</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-zinc-400" />
                <span className="text-xs text-zinc-500">Line Dry</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-zinc-400" />
                <span className="text-xs text-zinc-500">Iron Low Heat</span>
              </div>
            </div>
          </div>
        )}

        {active === "Size & Fit" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Fit description card */}
              <div className="rounded-2xl border border-zinc-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                      <Shirt className="h-5 w-5 text-violet-600" />
                    </div>
                    <p className="text-sm font-bold text-black">The Fit</p>
                  </div>

                  {fitType && (
                    <span className="rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      {fitType}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  This piece is designed with an oversized, relaxed fit — order
                  your usual size for a true streetwear silhouette, or size
                  down for a slightly more fitted look.
                </p>
              </div>

              {/* Model reference card */}
              <div className="rounded-2xl border border-zinc-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <Ruler className="h-5 w-5 text-violet-600" />
                  </div>
                  <p className="text-sm font-bold text-black">Model Reference</p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  Model is 6&apos;0&quot; (183cm) wearing size{" "}
                  <span className="font-semibold text-black">M</span>.
                </p>
              </div>
            </div>

            {/* Size chart */}
            <div className="rounded-2xl border border-zinc-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <Ruler className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">Size Guide</p>
                    <p className="text-xs text-zinc-500">
                      General reference chart, in inches
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      <th className="py-2 pr-4">Size</th>
                      <th className="py-2 pr-4">Chest</th>
                      <th className="py-2 pr-4">Length</th>
                      <th className="py-2">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART.map((row) => (
                      <tr key={row.size} className="border-b border-zinc-100 last:border-0">
                        <td className="py-2.5 pr-4 font-semibold text-black">{row.size}</td>
                        <td className="py-2.5 pr-4 text-zinc-600">{row.chest}&quot;</td>
                        <td className="py-2.5 pr-4 text-zinc-600">{row.length}&quot;</td>
                        <td className="py-2.5 text-zinc-600">{row.shoulder}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-zinc-400">
                Measurements are approximate and may vary by ±0.5&quot; due to
                fabric and manufacturing.
              </p>
            </div>
          </div>
        )}

        {active === "Shipping & Returns" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <PackageCheck className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Order Processing</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Every order is packed and dispatched within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <Truck className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Delivery Timeline</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Arrives in 2-5 business days depending on your location.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <RotateCcw className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">7-Day Returns</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Not the right fit? Returns are accepted within 7 days of delivery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <PackageX className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Return Condition</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Item must be unused, unwashed, and in original packaging with tags intact.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}