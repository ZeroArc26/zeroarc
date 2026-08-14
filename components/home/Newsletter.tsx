"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { DURATION } from "@/components/motion/config";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-black px-6 py-14 md:px-14">
      {/* Illustration + content share ONE viewport trigger instead of two
          independently-positioned ones, so nothing waits on its own
          separate check. */}
      <StaggerGroup gap={0.03}>
        {/* Character illustration */}
        <StaggerItem
          y={10}
          duration={0.4}
          className="pointer-events-none absolute -bottom-4 left-0 hidden h-[280px] w-[220px] opacity-90 md:block"
        >
          <Image
            src="/images/newsletter/newsletter-character.png"
            alt=""
            fill
            className="object-contain object-bottom"
          />
        </StaggerItem>

        <StaggerItem className="relative z-10 mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-6 md:flex-row md:pl-40">
          <div className="text-center md:text-left">
            <h2 className="font-[family:var(--font-space)] text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
              Join The ZeroArc Community
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Get exclusive drops, offers and updates straight to your inbox.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-sm text-white placeholder:text-zinc-500 transition-colors focus:border-violet-500 focus:outline-none"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: DURATION.micro }}
              className="shrink-0 rounded-xl bg-violet-600 px-7 py-4 text-sm font-semibold tracking-[0.05em] text-white transition-colors hover:bg-violet-500"
            >
              SUBSCRIBE
            </motion.button>
          </form>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}

