import Image from "next/image";
import Link from "next/link";

export default function MenWomenSplit() {
  return (
    <section className="grid grid-cols-1 bg-white md:grid-cols-2">
      {/* ================= MEN ================= */}
      <Link
        href="/men"
        className="group relative block min-h-[420px] overflow-hidden md:min-h-[520px]"
      >
        <Image
          src="/images/banners/mens-banner.png"
          alt="Men's collection"
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>

      {/* ================= WOMEN ================= */}
      <Link
        href="/women"
        className="group relative block min-h-[420px] overflow-hidden md:min-h-[520px]"
      >
        <Image
          src="/images/banners/women-banner.png"
          alt="Women's collection"
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
    </section>
  );
}