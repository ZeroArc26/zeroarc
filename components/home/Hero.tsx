"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SLIDES = ["01", "02", "03", "04"];

export default function Hero() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative min-h-[650px] h-[calc(100vh-140px)] overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1700px] items-center px-10 xl:px-20">
        {/* ================= LEFT ================= */}
        <div className="flex w-full max-w-2xl flex-col justify-center">
          <p className="mb-4 text-[20px] tracking-[0.28em] text-violet-500">
            次の物語を、着よう
          </p>

          <h1
            className="
              font-[family:var(--font-space)]
              uppercase
              font-bold
              leading-[0.92]
              tracking-[-0.05em]
              text-[clamp(3.5rem,5.2vw,5.5rem)]
            "
          >
            WEAR YOUR
            <br />
            NEXT ARC
          </h1>

          <p className="mt-6 max-w-[460px] text-[17px] leading-[1.7] text-zinc-300">
            Premium streetwear inspired by anime,
            <br />
            culture and limitless imagination.
          </p>

          <div className="mt-8 flex gap-5">
            <button className="rounded-xl bg-violet-600 px-8 py-4 text-sm font-semibold tracking-[0.08em] transition hover:bg-violet-500">
              SHOP MEN →
            </button>
            <button className="rounded-xl border border-zinc-600 px-8 py-4 text-sm font-semibold tracking-[0.08em] transition hover:bg-white hover:text-black">
              SHOP WOMEN →
            </button>
          </div>
        </div>

        {/* ================= RIGHT (layered model) ================= */}
        

        {/* Slide numbers */}
        <div className="absolute right-6 top-[18%] hidden flex-col items-end gap-6 xl:flex">
          {SLIDES.map((num, i) => (
            <button
              key={num}
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 text-sm font-semibold tracking-widest transition ${
                active === i ? "text-white" : "text-zinc-600"
              }`}
            >
              {active === i && <span className="h-[2px] w-6 bg-violet-500" />}
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll down */}
      <div className="absolute bottom-10 right-10 z-10 hidden items-center gap-2 text-xs tracking-[0.2em] text-zinc-400 xl:flex">
        SCROLL DOWN
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent" />
    </section>
  );
}