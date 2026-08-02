"use client";

import { useState } from "react";
import { Shirt, Layers, Sparkles, Droplet } from "lucide-react";

const TABS = ["Description", "Details", "Size & Fit", "Shipping & Returns"] as const;

const DETAILS = [
  {
    icon: Layers,
    title: "240 GSM Premium Cotton",
    subtitle: "Soft, breathable & durable",
  },
  {
    icon: Shirt,
    title: "Oversized Fit",
    subtitle: "Drop shoulders, relaxed fit",
  },
  {
    icon: Sparkles,
    title: "High Quality Print",
    subtitle: "Long-lasting & fade resistant",
  },
  {
    icon: Droplet,
    title: "Pre-shrunk Fabric",
    subtitle: "Holds shape, wash after wash",
  },
];

interface ProductTabsProps {
  description: string;
}

export default function ProductTabs({ description }: ProductTabsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");

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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <p className="leading-relaxed text-zinc-600">{description}</p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {DETAILS.map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                  <div>
                    <p className="text-sm font-semibold text-black">{title}</p>
                    <p className="text-xs text-zinc-500">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "Details" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DETAILS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                <div>
                  <p className="text-sm font-semibold text-black">{title}</p>
                  <p className="text-xs text-zinc-500">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "Size & Fit" && (
          <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-zinc-600">
            <p>
              This piece is designed with an oversized, relaxed fit — order your
              usual size for a true streetwear silhouette, or size down for a
              slightly more fitted look.
            </p>
            <p>
              Model is 6&apos;0&quot; (183cm) wearing size M. Refer to the size
              guide for detailed chest and length measurements.
            </p>
          </div>
        )}

        {active === "Shipping & Returns" && (
          <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-zinc-600">
            <p>
              Orders are processed within 1-2 business days and delivered in
              2-5 business days depending on your location.
            </p>
            <p>
              Not the right fit? Returns are accepted within 7 days of
              delivery, provided the item is unused and in original packaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}