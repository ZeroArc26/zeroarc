import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import WelcomeCouponBanner from "@/components/home/WelcomeCouponBanner";
import MenWomenSplit from "@/components/home/MenWomenSplit";
import NewArrivals from "@/components/home/NewArrivals";
import ExploreCollections from "@/components/home/ExploreCollections";
import FeaturesBar from "@/components/home/FeaturesBar";
import SiteTestimonials from "@/components/home/SiteTestimonials";
import SocialFollow from "@/components/home/SocialFollow";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import { getNewArrivalProducts } from "@/lib/actions/products/getNewArrivalProducts";

// Public, high-traffic page — full force-dynamic (re-render on every
// request) would add unnecessary DB load and latency for every
// visitor. ISR strikes the right balance: still served from cache for
// speed, but automatically regenerated in the background at most once
// a minute, so product data (images, prices, new arrivals) can never
// go stale for long.
export const revalidate = 60;

export default async function Home() {
  const products = await getNewArrivalProducts(10);

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <Hero />
      <WelcomeCouponBanner />
      <MenWomenSplit />
      <NewArrivals products={products} />
      <ExploreCollections />
      <FeaturesBar />
      <SiteTestimonials />
      <SocialFollow />
      <Newsletter />
      <Footer />
    </>
  );
}