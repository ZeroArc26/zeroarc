import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import FeaturesBar from "@/components/home/FeaturesBar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import CollectionHero from "@/components/shop/CollectionHero";
import CollectionClient from "@/components/shop/CollectionClient";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function MenCollectionPage() {
  await connectDB();

  const raw = await Product.find({
    "publish.status": "active",
    "basicInfo.audience": { $in: ["men", "unisex"] },
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
        title="Collection"
        highlight="Men"
        subtitle="Streetwear that defines your attitude. Inspired by anime. Designed for everyday legends."
        image="/images/hero/hero-model-2.png"
      />

      <CollectionClient products={products} />

      <FeaturesBar />
      <Newsletter />
      <Footer />
    </main>
  );
}