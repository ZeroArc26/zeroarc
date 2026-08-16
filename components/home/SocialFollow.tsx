"use client";

import { motion } from "framer-motion";

import Reveal from "@/components/motion/Reveal";
import { DURATION } from "@/components/motion/config";

const INSTAGRAM_URL = "https://instagram.com/zeroarc.wear";
const INSTAGRAM_HANDLE = "@zeroarc.wear";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialFollow() {
  return (
    <section className="bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-[1700px]">
        {/* Header — same pattern as every other homepage section */}
        <Reveal className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-1 text-2xl font-black uppercase text-black">
            Follow The Arc
            <span className="text-violet-600">+</span>
          </h2>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            {INSTAGRAM_HANDLE} →
          </a>
        </Reveal>

        {/* Dark accent card, matching the coupon banner's treatment */}
        <Reveal className="relative overflow-hidden rounded-2xl bg-black px-8 py-14 text-center md:px-16">
          <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />

          <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-400">
              <InstagramIcon className="h-6 w-6" />
            </div>

            <h3 className="mt-5 font-[family:var(--font-space)] text-2xl font-black uppercase leading-tight text-white md:text-3xl">
              Join The <span className="text-violet-500">Arc</span> On Instagram
            </h3>

            <p className="mt-3 text-sm text-zinc-400">
              New drops, styling inspo, and behind-the-scenes — follow{" "}
              {INSTAGRAM_HANDLE} before everyone else does.
            </p>

            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: DURATION.micro }}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              <InstagramIcon className="h-4 w-4" />
              Follow {INSTAGRAM_HANDLE}
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
