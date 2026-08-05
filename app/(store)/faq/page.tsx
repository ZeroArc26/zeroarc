import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import FaqLayout from "@/components/faq/FaqLayout";

import { FAQ_ALL_POPULAR } from "@/constants/faq-data";

export default function AllFaqsPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <FaqLayout
        activeSlug=""
        icon="LayoutGrid"
        title="All FAQs"
        subtitle="Browse the most popular questions across every topic, all in one place."
        questions={FAQ_ALL_POPULAR}
      />

      <Newsletter />
      <Footer />
    </main>
  );
}