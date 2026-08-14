"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const TESTIMONIALS = [
  {
    name: "Rohit Verma",
    quote: "The quality is insane! ZeroArc is now my go-to brand.",
    color: "bg-violet-600",
  },
  {
    name: "Arjun Singh",
    quote: "Oversized fit is perfect and the prints are top-notch.",
    color: "bg-fuchsia-600",
  },
  {
    name: "Karan Uchiha",
    quote: "Finally a streetwear brand that understands anime culture!",
    color: "bg-blue-600",
  },
  {
    name: "Neha Yadav",
    quote: "Love the fabric and the packaging. Super premium feel.",
    color: "bg-pink-600",
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-zinc-50 px-6 py-16 md:px-14">
      {/* Header + cards share ONE viewport trigger (anchored at the
          header's position) so cards never wait on their own, physically
          lower, separate intersection check — that gap was what read as
          a blank pause before. */}
      <StaggerGroup gap={0.04} className="mx-auto max-w-[1700px]">
        {/* Header */}
        <StaggerItem className="mb-10 flex items-center justify-between">
          <h2 className="flex items-center gap-1 text-2xl font-black uppercase text-black">
            What Our Customers Say
            <span className="text-violet-600">+</span>
          </h2>

          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition hover:bg-zinc-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition hover:bg-zinc-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </StaggerItem>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name} className="w-[280px] shrink-0">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="mb-3 flex gap-1 text-violet-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-violet-500" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-zinc-700">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-black">
                    – {t.name}
                  </span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </div>
      </StaggerGroup>
    </section>
  );
}

