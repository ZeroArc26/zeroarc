import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import FeaturesBar from "@/components/home/FeaturesBar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import CollectionHero from "@/components/shop/CollectionHero";
import CollectionClient from "@/components/shop/CollectionClient";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getCollectionBySlug } from "@/constants/collections";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * "Bestsellers" is automatic — no manual tagging needed. A product
 * qualifies by actually having sold units (real orders, excluding
 * cancelled ones) and, once it has reviews, by keeping a decent
 * rating. Ranked by units sold, boosted by rating so two similarly-
 * selling products favor the better-reviewed one.
 */
async function getBestsellerProducts() {
  const salesAgg = await Order.aggregate([
    { $match: { "orderInfo.status": { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" },
      },
    },
  ]);

  const soldMap = new Map<string, number>(
    salesAgg.map((s) => [String(s._id), s.totalSold])
  );

  if (soldMap.size === 0) return [];

  const raw = await Product.find({
    "publish.status": "active",
    "publish.visibility": { $ne: "hidden" },
    _id: { $in: Array.from(soldMap.keys()) },
  }).lean();

  const MIN_RATING = 3.5; // quality gate — only applies once a product has reviews

  const ranked = raw
    .map((p: any) => {
      const totalSold = soldMap.get(String(p._id)) || 0;
      const rating = p.averageRating || 0;
      const reviewCount = p.reviewCount || 0;
      // Rating boosts the score but never dominates it — real sales
      // volume is still the main signal for "bestseller".
      const score = totalSold * (1 + rating / 5);
      return { product: p, totalSold, rating, reviewCount, score };
    })
    .filter((p) => p.totalSold > 0 && (p.reviewCount === 0 || p.rating >= MIN_RATING))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((p) => p.product);

  return ranked;
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const meta = getCollectionBySlug(slug);

  if (!meta) {
    notFound();
  }

  await connectDB();

  let raw;

  if (slug === "bestsellers") {
    raw = await getBestsellerProducts();
  } else {
    raw = await Product.find({
      "publish.status": "active",
      "publish.visibility": { $ne: "hidden" },
      "basicInfo.tags": meta.tag,
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  const products = JSON.parse(JSON.stringify(raw));

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        title={meta.subtitle}
        highlight={meta.name}
        subtitle={meta.description}
        image={meta.image}
        imagePosition={meta.imagePosition}
      />

      <CollectionClient products={products} />

      <FeaturesBar />
      <Newsletter />
      <Footer />
    </main>
  );
}