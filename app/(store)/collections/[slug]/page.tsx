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
import { getCollectionBySlug } from "@/constants/collections";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
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

  const raw = await Product.find({
    "publish.status": "active",
    "basicInfo.tags": meta.tag,
  })
    .sort({ createdAt: -1 })
    .lean();

  const products = raw.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

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