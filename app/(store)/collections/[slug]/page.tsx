import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import FeaturesBar from "@/components/home/FeaturesBar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import CollectionHero from "@/components/shop/CollectionHero";
import CollectionClient from "@/components/shop/CollectionClient";

import { DUMMY_PRODUCTS } from "@/constants/dummy-products";

const COLLECTION_META: Record<string, { name: string; tag: string; subtitle: string; image: string; imagePosition?: string }> = {
    
  anime: {
    name: "Anime",
    tag: "anime",
    subtitle: "Bold anime graphics for true otaku energy.",
    image: "/images/collections/collection-anime.png",
    imagePosition: "object-[70%_20%]",
  },
  oversized: {
    name: "Oversized",
    tag: "oversized",
    subtitle: "Relaxed, drop-shoulder fits built for comfort.",
    image: "/images/collections/collection-oversized.png",
    imagePosition: "object-[70%_15%]",
  },
  minimal: {
    name: "Minimal",
    tag: "minimal",
    subtitle: "Clean, understated designs for everyday wear.",
    image: "/images/collections/collection-minimal.png",
    imagePosition: "object-[70%_15%]",
  },
  limited: {
    name: "Limited",
    tag: "limited",
    subtitle: "Rare drops. Once they're gone, they're gone.",
    image: "/images/hero/hero-model-1.png",
  },
};

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const meta = COLLECTION_META[slug];

  if (!meta) {
    notFound();
  }

  const products = DUMMY_PRODUCTS.filter((p) =>
    p.basicInfo.tags.includes(meta.tag)
  );

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        title="Collection"
        highlight={meta.name}
        subtitle={meta.subtitle}
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