import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { COLLECTIONS } from "@/constants/collections";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Reveal from "@/components/motion/Reveal";

// Only these 3 collections show here — their products only, no banner
// images, laid out side by side in one row, in this exact order.
const FEATURED_SLUGS = ["arc-graphics", "arc-anime", "arc-gaming"];

interface PreviewProduct {
  _id: string;
  basicInfo: { title: string; slug: string };
  pricing: { sellingPrice: number };
  images?: { url: string; alt?: string }[];
  reviewCount?: number;
  averageRating?: number;
}

async function getPreviewProducts(tag: string): Promise<PreviewProduct[]> {
  await connectDB();

  const raw = await Product.find({
    "publish.status": "active",
    "publish.visibility": { $ne: "hidden" },
    "basicInfo.tags": tag,
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return JSON.parse(JSON.stringify(raw));
}

export default async function ExploreCollections() {
  const featuredCollections = FEATURED_SLUGS.map((slug) =>
    COLLECTIONS.find((col) => col.slug === slug)
  ).filter((col): col is (typeof COLLECTIONS)[number] => Boolean(col));

  const productsByCollection: Record<string, Awaited<ReturnType<typeof getPreviewProducts>>> = {};
  for (const col of featuredCollections) {
    productsByCollection[col.slug] = await getPreviewProducts(col.tag);
  }

  return (
    <section className="bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-[1700px]">
        {/* Header */}
        <Reveal className="mb-10">
          <h2 className="flex items-center gap-1 text-2xl font-black uppercase text-black">
            Explore Collections
            <span className="text-violet-600">+</span>
          </h2>
        </Reveal>

        {/* Each collection is its own full-width row */}
        <div className="space-y-16">
          {featuredCollections.map((col) => (
            <div key={col.slug}>
              <h3 className="mb-6 text-xl font-black uppercase text-black">
                {col.name}
              </h3>

              {productsByCollection[col.slug]?.length > 0 ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {productsByCollection[col.slug].map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.basicInfo.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                        <Image
                          src={product.images?.[0]?.url || "/placeholder.png"}
                          alt={product.images?.[0]?.alt || product.basicInfo.title}
                          fill
                          sizes="(max-width: 640px) 45vw, 22vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3.5">
                        <h4 className="line-clamp-1 text-sm font-semibold uppercase tracking-wide text-black">
                          {product.basicInfo.title}
                        </h4>
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
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  No products in this collection yet.
                </p>
              )}

              <div className="mt-6">
                <Link
                  href={`/collections/${col.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black transition hover:bg-black hover:text-white"
                >
                  View More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Link to the full collections page, after all featured rows */}
        <div className="mt-16 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-800"
          >
            View All Collections →
          </Link>
        </div>
      </div>
    </section>
  );
}
