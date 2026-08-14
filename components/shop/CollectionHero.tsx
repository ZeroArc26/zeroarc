import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Reveal from "@/components/motion/Reveal";

interface CollectionHeroProps {
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  imagePosition?: string;
  possessive?: boolean;
}

export default function CollectionHero({
  title,
  highlight,
  subtitle,
  image,
  imagePosition = "object-[80%_15%]",
  possessive = true,
}: CollectionHeroProps) {
  return (
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          priority
          className={`object-cover opacity-90 ${imagePosition}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
      </div>

      <Reveal
        trigger="mount"
        y={10}
        duration={0.4}
        className="relative z-10 mx-auto max-w-[1700px] px-6 py-14 md:px-14"
      >
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">{highlight}</span>
        </nav>

        <h1 className="font-[family:var(--font-space)] text-4xl font-black uppercase leading-none text-white md:text-6xl">
          <span className="text-violet-500">{highlight}</span>
          {possessive ? "'S " : " "}
          {title}
        </h1>

        <p className="mt-4 max-w-md text-zinc-400">{subtitle}</p>
      </Reveal>
    </div>
  );
}
