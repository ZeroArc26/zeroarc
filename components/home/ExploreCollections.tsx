import Image from "next/image";
import Link from "next/link";

const COLLECTIONS = [
  {
    name: "Anime",
    subtitle: "Collection",
    image: "/images/collections/collection-anime.png",
    href: "/collections/anime",
  },
  {
    name: "Oversized",
    subtitle: "Collection",
    image: "/images/collections/collection-oversized.png",
    href: "/collections/oversized",
  },
  {
    name: "Minimal",
    subtitle: "Collection",
    image: "/images/collections/collection-minimal.png",
    href: "/collections/minimal",
  },
];

export default function ExploreCollections() {
  return (
    <section className="bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-[1700px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
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
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.name}
              href={col.href}
              className="group relative flex h-[380px] items-end overflow-hidden rounded-2xl bg-zinc-900"
            >
              <Image
                src={col.image}
                alt={`${col.name} collection`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="relative z-10 p-7">
                <h3 className="text-2xl font-black uppercase leading-tight text-white">
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
          ))}
        </div>
      </div>
    </section>
  );
}