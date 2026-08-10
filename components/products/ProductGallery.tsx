"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

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

  // Hover-to-magnify (desktop)
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = imageBoxRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  // Click-to-fullscreen (desktop + mobile)
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
      <div
        ref={imageBoxRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-zinc-100"
      >
        {active && (
          <Image
            src={active.url}
            alt={active.alt || "Product"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover transition-transform duration-150 ease-out"
            style={
              isHovering
                ? {
                    transform: "scale(1.8)",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        )}

        {sorted.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo("prev");
              }}
              className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo("next");
              }}
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

      {/* Fullscreen lightbox */}
      {lightboxOpen && active && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close zoom"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {sorted.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo("prev");
                }}
                className="absolute left-6 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo("next");
                }}
                className="absolute right-6 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-full max-h-[85vh] w-full max-w-3xl"
          >
            <Image
              src={active.url}
              alt={active.alt || "Product"}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}