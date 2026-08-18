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

export default async function ShopPage() {
  await connectDB();

  const raw = await Product.find({
    "publish.status": "active",
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
        title="Shop"
        highlight="Everything"
        subtitle="Every drop, every design — the complete ZeroArc collection in one place."
        image="/images/hero/hero-model-1.png"
      />

      <CollectionClient products={products} />

      <FeaturesBar />
      <Newsletter />
      <Footer />
    </main>
  );
}
