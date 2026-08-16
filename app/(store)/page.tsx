import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import WelcomeCouponBanner from "@/components/home/WelcomeCouponBanner";
import MenWomenSplit from "@/components/home/MenWomenSplit";
import NewArrivals from "@/components/home/NewArrivals";
import ExploreCollections from "@/components/home/ExploreCollections";
import FeaturesBar from "@/components/home/FeaturesBar";
import SocialFollow from "@/components/home/SocialFollow";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import { getNewArrivalProducts } from "@/lib/actions/products/getNewArrivalProducts";

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
      <SocialFollow />
      <Newsletter />
      <Footer />
    </>
  );
}