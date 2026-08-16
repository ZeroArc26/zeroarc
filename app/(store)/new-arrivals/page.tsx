import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import FeaturesBar from "@/components/home/FeaturesBar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import NewArrivalsHero from "@/components/shop/NewArrivalsHero";
import NewArrivalsClient from "@/components/shop/NewArrivalsClient";

import { getNewArrivalsFull } from "@/lib/actions/products/getNewArrivalsFull";

// Matches the existing pattern on /men, /women, /unisex,
// /collections/[slug] — a product listing page must never serve
// stale cached data (wrong images, prices, stock).
export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  const products = await getNewArrivalsFull();

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <NewArrivalsHero />

      <NewArrivalsClient products={products} />

      <FeaturesBar />
      <Newsletter />
      <Footer />
    </main>
  );
}