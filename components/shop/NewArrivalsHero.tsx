import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Sparkles, Gem } from "lucide-react";

export default function NewArrivalsHero() {
  return (
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src="/images/new/male-model.png"
          alt=""
          fill
          priority
          className="object-cover object-[75%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
      </div>

      {/* Decorative right-side overlay */}
      <div className="absolute right-8 top-24 z-10 hidden flex-col items-center gap-1 text-violet-400/70 lg:flex">
        {"新着".split("").map((char, i) => (
          <span key={i} className="text-2xl font-bold">
            {char}
          </span>
        ))}
      </div>

      <div className="absolute bottom-10 right-8 z-10 hidden text-right lg:block">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-300/80">
          New Energy
        </p>
        <div className="mt-3 flex items-end gap-[2px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="bg-white/30"
              style={{
                width: 1.5,
                height: 8 + ((i * 7) % 20),
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] px-6 py-14 md:px-14">
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">New Arrivals</span>
        </nav>

        <h1 className="font-[family:var(--font-space)] text-4xl font-black uppercase leading-none text-white md:text-6xl">
          <span className="text-violet-500">New</span> Arrivals
        </h1>

        <p className="mt-4 max-w-md text-zinc-400">
          Fresh drops. New energy.
          <br />
          The latest anime streetwear, just landed.
        </p>

        {/* Feature icons row, inside the dark hero */}
        <div className="mt-10 flex flex-wrap gap-8">
          {[
            { icon: Clock, title: "Latest Drops", subtitle: "Updated Weekly" },
            { icon: Sparkles, title: "Limited Stock", subtitle: "Don't Miss Out" },
            { icon: Gem, title: "Premium Quality", subtitle: "Built to Last" },
          ].map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                <Icon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-zinc-400">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}