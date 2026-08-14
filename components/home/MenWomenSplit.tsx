import Image from "next/image";
import Link from "next/link";

import Reveal from "@/components/motion/Reveal";

export default function MenWomenSplit() {
  return (
    <section className="grid grid-cols-1 bg-white md:grid-cols-2">
      {/* ================= MEN ================= */}
      <Reveal y={16}>
        <Link
          href="/men"
          className="group relative block aspect-[3/2] w-full overflow-hidden md:aspect-auto md:min-h-[520px]"
        >
          <Image
            src="/images/banners/mens-banner.png"
            alt="Men's collection"
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
        </Link>
      </Reveal>

      {/* ================= WOMEN ================= */}
      <Reveal y={16} delay={0.08}>
        <Link
          href="/women"
          className="group relative block aspect-[3/2] w-full overflow-hidden md:aspect-auto md:min-h-[520px]"
        >
          <Image
            src="/images/banners/women-banner.png"
            alt="Women's collection"
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
        </Link>
      </Reveal>
    </section>
  );
}
