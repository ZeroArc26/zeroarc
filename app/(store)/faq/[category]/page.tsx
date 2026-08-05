import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import FaqLayout from "@/components/faq/FaqLayout";

import { FAQ_CATEGORIES } from "@/constants/faq-data";

interface FaqCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function FaqCategoryPage({
  params,
}: FaqCategoryPageProps) {
  const { category } = await params;

  const data = FAQ_CATEGORIES.find((c) => c.slug === category);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <FaqLayout
        activeSlug={data.slug}
        icon={data.icon}
        title={data.name}
        subtitle={data.subtitle}
        questions={data.questions}
      />

      <Newsletter />
      <Footer />
    </main>
  );
}