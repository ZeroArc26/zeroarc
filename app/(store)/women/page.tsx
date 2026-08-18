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

export default async function WomenCollectionPage() {
  await connectDB();

  const raw = await Product.find({
    "publish.status": "active",
    "publish.visibility": { $ne: "hidden" },
    "basicInfo.audience": { $in: ["women", "unisex"] },
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
  highlight="Women"
  subtitle="Style that empowers, you every day. Anime-inspired pieces with an edge."
  image="/images/newsletter/newsletter-character.png"
  imagePosition="object-[75%_20%]"
/>

      <CollectionClient products={products} />

      <FeaturesBar />
      <Newsletter />
      <Footer />
    </main>
  );
}