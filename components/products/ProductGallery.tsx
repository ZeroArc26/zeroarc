"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  url: string;
  alt?: string;
  isCover?: boolean;
  order?: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const sorted = [...images].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const active = sorted[activeIndex] ?? sorted[0];

  const goTo = (dir: "prev" | "next") => {
    setActiveIndex((prev) => {
      if (dir === "prev") return prev === 0 ? sorted.length - 1 : prev - 1;
      return prev === sorted.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className="flex gap-5">
      {/* Thumbnails */}
      <div className="flex w-20 flex-col gap-3 overflow-y-auto">
        {sorted.map((img, i) => (
          <button
            key={img.url + i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border-2 bg-zinc-100 transition ${
              activeIndex === i
                ? "border-violet-600"
                : "border-transparent hover:border-zinc-300"
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt || "Thumbnail"}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-zinc-100">
        {active && (
          <Image
            src={active.url}
            alt={active.alt || "Product"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        )}

        {sorted.length > 1 && (
          <>
            <button
              onClick={() => goTo("prev")}
              className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={() => goTo("next")}
              className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-zinc-700 shadow">
          <Maximize2 className="h-3.5 w-3.5" />
          Zoom
        </div>
      </div>
    </div>
  );
}