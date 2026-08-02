import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import FeaturesBar from "@/components/home/FeaturesBar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import CollectionHero from "@/components/shop/CollectionHero";
import CollectionClient from "@/components/shop/CollectionClient";

import { DUMMY_PRODUCTS } from "@/constants/dummy-products";

// TODO (before launch): replace this dummy data with a real DB fetch, e.g.
//
// import connectDB from "@/lib/mongodb";
// import Product from "@/models/Product";
//
// await connectDB();
// const products = await Product.find({
//   "publish.status": "active",
//   "basicInfo.audience": { $in: ["men", "unisex"] },
// }).sort({ createdAt: -1 }).lean();
// const serialized = products.map((p: any) => ({ ...p, _id: p._id.toString() }));
//
// The shape of DUMMY_PRODUCTS matches the real schema exactly, so this
// is a drop-in swap — no component changes required.

export default function MenCollectionPage() {
  const products = DUMMY_PRODUCTS.filter(
    (p) => p.basicInfo.audience === "men" || p.basicInfo.audience === "unisex"
  );

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