import Image from "next/image";
import Link from "next/link";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import FeaturesBar from "@/components/home/FeaturesBar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import CollectionHero from "@/components/shop/CollectionHero";

import { COLLECTIONS } from "@/constants/collections";

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
  title="Collections"
  highlight="All"
  subtitle="Explore every ZeroArc drop — from bold anime prints to minimal everyday essentials."
  image="/images/hero/hero-bg.png"
  imagePosition="object-center"
/>

      <div className="mx-auto max-w-[1700px] px-6 py-16 md:px-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative flex h-[420px] items-end overflow-hidden rounded-2xl bg-zinc-900"
            >
              <Image
                src={col.image}
                alt={`${col.name} collection`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="relative z-10 p-8">
                <h3 className="text-3xl font-black uppercase leading-tight text-white">
                  {col.name}
                  <br />
                  <span className="font-semibold tracking-[0.15em]">
                    {col.subtitle}
                  </span>
                </h3>

                <p className="mt-3 max-w-[280px] text-sm text-zinc-300">
                  {col.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-violet-400 transition group-hover:gap-3">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <FeaturesBar />
      <Newsletter />
      <Footer />
    </main>
  );
}