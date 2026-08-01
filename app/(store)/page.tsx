import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import MenWomenSplit from "@/components/home/MenWomenSplit";
import NewArrivals from "@/components/home/NewArrivals";
import ExploreCollections from "@/components/home/ExploreCollections";
import FeaturesBar from "@/components/home/FeaturesBar";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <Hero />
      <MenWomenSplit />
      <NewArrivals />
      <ExploreCollections />
      <FeaturesBar />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}