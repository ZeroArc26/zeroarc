"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Star, ChevronLeft, ChevronRight, Grid3x3, List } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import { DURATION, EASE_OUT } from "@/components/motion/config";

interface NewArrivalProduct {
  _id: string;
  basicInfo: {
    title: string;
    slug: string;
    category: string;
  };
  pricing: {
    sellingPrice: number;
  };
  images: { url: string; alt?: string }[];
  variants: { size: string; colorHex?: string; color: string }[];
  averageRating?: number;
  reviewCount?: number;
}

interface NewArrivalsClientProps {
  products: NewArrivalProduct[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

const PAGE_SIZE = 12;

export default function NewArrivalsClient({ products }: NewArrivalsClientProps) {
  const reduceMotion = useReducedMotion();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      map.set(p.basicInfo.category, (map.get(p.basicInfo.category) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.size)));
    return Array.from(set);
  }, [products]);

  const allColors = useMemo(() => {
    const map = new Map<string, string | undefined>();
    products.forEach((p) =>
      p.variants.forEach((v) => {
        if (!map.has(v.color)) map.set(v.color, v.colorHex);
      })
    );
    return Array.from(map.entries());
  }, [products]);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 5000 };
    const prices = products.map((p) => p.pricing.sellingPrice);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const toggleCategory = (cat: string) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.basicInfo.category));
    }
    if (selectedSize) {
      list = list.filter((p) => p.variants.some((v) => v.size === selectedSize));
    }
    if (selectedColor) {
      list = list.filter((p) => p.variants.some((v) => v.color === selectedColor));
    }
    if (maxPrice !== null) {
      list = list.filter((p) => p.pricing.sellingPrice <= maxPrice);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.pricing.sellingPrice - b.pricing.sellingPrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.pricing.sellingPrice - a.pricing.sellingPrice);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    }

    return list;
  }, [products, selectedCategories, selectedSize, selectedColor, maxPrice, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedSize(null);
    setSelectedColor(null);
    setMaxPrice(null);
    setPage(1);
  };

  // Changes whenever the *visible result set* changes — drives the
  // crossfade below so switching filters/sort/page never snaps
  // abruptly. No filtering/sorting logic depends on this.
  const gridKey = `${selectedCategories.join(",")}|${selectedSize}|${selectedColor}|${maxPrice}|${sortBy}|${page}|${view}`;

  // Scroll the results back into view on page change only (not on
  // initial mount) — without this, switching pages left the viewport
  // at whatever scroll position it was already at.
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resultsTopRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [page, reduceMotion]);

  return (
    <div className="mx-auto max-w-[1700px] px-6 py-10 md:px-14">
        {/* Category pills row */}
      <Reveal className="mb-8 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            selectedCategories.length === 0
              ? "bg-violet-600 text-white"
              : "border border-zinc-300 text-zinc-600 hover:border-violet-400"
          }`}
        >
          All
        </motion.button>

        {categories.map(([cat]) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPage(1);
              setSelectedCategories(
                selectedCategories.length === 1 && selectedCategories[0] === cat
                  ? []
                  : [cat]
              );
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
              selectedCategories.includes(cat) && selectedCategories.length === 1
                ? "bg-violet-600 text-white"
                : "border border-zinc-300 text-zinc-600 hover:border-violet-400"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </Reveal>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <Reveal as="aside">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">
              Filters
            </h3>
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-violet-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
              Categories
            </p>
            <div className="space-y-2.5">
              <label className="flex cursor-pointer items-center justify-between text-sm text-zinc-700">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === 0}
                    onChange={clearAll}
                    className="h-4 w-4 rounded accent-violet-600"
                  />
                  All Categories
                </span>
                <span className="text-xs text-zinc-400">({products.length})</span>
              </label>

              {categories.map(([cat, count]) => (
                <label
                  key={cat}
                  className="flex cursor-pointer items-center justify-between text-sm text-zinc-700"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="h-4 w-4 rounded accent-violet-600"
                    />
                    {cat}
                  </span>
                  <span className="text-xs text-zinc-400">({count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          {allSizes.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      setPage(1);
                      setSelectedSize((prev) => (prev === size ? null : size));
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                      selectedSize === size
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-zinc-300 text-zinc-700 hover:border-violet-400"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {allColors.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                Color
              </p>
              <div className="flex flex-wrap gap-2.5">
                {allColors.map(([color, hex]) => (
                  <motion.button
                    key={color}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      setPage(1);
                      setSelectedColor((prev) => (prev === color ? null : color));
                    }}
                    title={color}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      selectedColor === color ? "border-violet-600" : "border-zinc-200"
                    }`}
                    style={{ backgroundColor: hex || "#000" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          {priceBounds.max > priceBounds.min && (
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                Price Range
              </p>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={maxPrice ?? priceBounds.max}
                onChange={(e) => {
                  setPage(1);
                  setMaxPrice(Number(e.target.value));
                }}
                className="w-full accent-violet-600"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>₹{priceBounds.min}</span>
                <span>₹{maxPrice ?? priceBounds.max}</span>
              </div>
            </div>
          )}

          {/* Promo card */}
          <div className="relative mt-8 min-h-[320px] overflow-hidden rounded-2xl bg-black p-6 text-white">
            <div className="absolute inset-0">
              <Image
                src="/images/new/promo-male-model.png"
                alt=""
                fill
                className="object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
            </div>

            <div className="relative z-10 flex h-full min-h-[272px] flex-col justify-end">
              <p className="text-xl font-black uppercase leading-tight">
                Be The
                <br />
                First One
              </p>
              <p className="mt-2 text-xs text-zinc-300">
                New drops every week. Stay ahead.
              </p>
              <Link
                href="/signup"
                className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-violet-500"
              >
                Join the Arc →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Product grid */}
        <div>
          <div ref={resultsTopRef} />
          <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">{filtered.length} Products</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setPage(1);
                    setSortBy(e.target.value as (typeof SORT_OPTIONS)[number]["value"]);
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-black outline-none transition-colors focus:border-violet-500"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-1 rounded-lg border border-zinc-300 p-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setView("grid")}
                  className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                    view === "grid" ? "bg-violet-600 text-white" : "text-zinc-500"
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setView("list")}
                  className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                    view === "list" ? "bg-violet-600 text-white" : "text-zinc-500"
                  }`}
                >
                  <List className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </Reveal>

          {paginated.length === 0 ? (
            <Reveal>
              <p className="py-20 text-center text-zinc-500">
                No products match these filters.
              </p>
            </Reveal>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={gridKey}
                initial="hidden"
                animate="show"
                exit={{
                  opacity: 0,
                  transition: { duration: reduceMotion ? 0.1 : 0.15 },
                }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.025,
                    },
                  },
                }}
                className={
                  view === "grid"
                    ? "grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col gap-4"
                }
              >
                {paginated.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={{
                      hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: reduceMotion ? 0.15 : 0.35,
                          ease: EASE_OUT,
                        },
                      },
                    }}
                    whileHover={{ y: reduceMotion ? 0 : -3 }}
                    transition={{ duration: DURATION.micro }}
                  >
                    <Link
                      href={`/products/${product.basicInfo.slug}`}
                      className={`group relative block ${view === "list" ? "flex gap-4" : ""}`}
                    >
                      <div
                        className={`relative overflow-hidden rounded-2xl bg-zinc-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl ${
                          view === "list" ? "h-32 w-32 shrink-0" : "aspect-square"
                        }`}
                      >
                        <span className="absolute left-3 top-3 z-10 rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                          New
                        </span>

                        <motion.button
                          onClick={(e) => e.preventDefault()}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.85 }}
                          transition={{ duration: DURATION.micro }}
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-sm backdrop-blur-sm transition-colors hover:text-pink-500"
                        >
                          <Heart className="h-4 w-4" />
                        </motion.button>

                        <Image
                          src={product.images[0]?.url || "/placeholder.png"}
                          alt={product.images[0]?.alt || product.basicInfo.title}
                          fill
                          sizes="280px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      <div className="mt-3.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                        <h3 className="line-clamp-1 text-sm font-semibold uppercase tracking-wide text-black">
                          {product.basicInfo.title}
                        </h3>
                        <p className="mt-1.5 text-base font-bold text-violet-600">
                          ₹{product.pricing.sellingPrice}
                        </p>

                        {(product.reviewCount ?? 0) > 0 && (
                          <div className="mt-1 flex items-center gap-1">
                            <div className="flex text-violet-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.round(product.averageRating ?? 0)
                                      ? "fill-violet-500"
                                      : "fill-none"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-zinc-400">
                              ({product.reviewCount})
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage(i + 1)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    page === i + 1
                      ? "bg-violet-600 text-white"
                      : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
