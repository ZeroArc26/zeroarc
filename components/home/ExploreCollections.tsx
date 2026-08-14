import Image from "next/image";
import Link from "next/link";

import { COLLECTIONS } from "@/constants/collections";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export default function ExploreCollections() {
  // Homepage preview shows the first 3 collections; "VIEW ALL" links to
  // /collections for the full set. Data comes from constants/collections.ts,
  // the single source of truth also used by /collections and
  // /collections/[slug] — no slugs are hardcoded here.
  const preview = COLLECTIONS.slice(0, 3);

  return (
    <section className="bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-[1700px]">
        {/* Header */}
        <Reveal className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-1 text-2xl font-black uppercase text-black">
            Explore Collections
            <span className="text-violet-600">+</span>
          </h2>

          <Link
            href="/collections"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            VIEW ALL →
          </Link>
        </Reveal>

        {/* Grid */}
        <StaggerGroup gap={0.05} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((col) => (
            <StaggerItem key={col.slug}>
              <Link
                href={`/collections/${col.slug}`}
                className="group relative flex h-[380px] items-end overflow-hidden rounded-2xl bg-zinc-900"
              >
                <Image
                  src={col.image}
                  alt={`${col.name} collection`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/95" />

                <div className="relative z-10 p-7">
                  <h3 className="text-2xl font-black uppercase leading-tight text-white transition-transform duration-500 group-hover:-translate-y-1">
                    {col.name}
                    <br />
                    <span className="font-semibold tracking-[0.15em]">
                      {col.subtitle}
                    </span>
                  </h3>

                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-violet-400 transition group-hover:gap-3">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
