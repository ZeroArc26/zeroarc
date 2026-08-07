"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface NewArrivalsProps {
  products: any[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-[1700px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-1 text-2xl font-black uppercase text-black">
            New Arrivals
            <span className="text-violet-600">+</span>
          </h2>

          <div className="flex items-center gap-4">
            <Link
              href="/new-arrivals"
              className="text-sm font-semibold text-violet-600 hover:underline"
            >
              VIEW ALL →
            </Link>

            <div className="hidden gap-2 md:flex">
              <button
                onClick={() => scroll("left")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 transition hover:bg-zinc-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => scroll("right")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 transition hover:bg-zinc-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => {
            const coverImage =
              product.images?.find((img: any) => img.isCover)?.url ||
              product.images?.[0]?.url ||
              "/products/default.webp";

            const badge = product.publish?.featured ? "FEATURED" : "NEW";

            return (
              <Link
                key={product._id}
                href={`/products/${product.basicInfo?.slug}`}
                className="group relative w-[220px] shrink-0 md:w-[240px]"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {badge}
                  </span>

                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 transition hover:text-pink-500"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  <Image
                    src={coverImage}
                    alt={product.basicInfo?.title}
                    fill
                    sizes="240px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
                    {product.basicInfo?.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-black">
                    ₹{product.pricing?.sellingPrice}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}