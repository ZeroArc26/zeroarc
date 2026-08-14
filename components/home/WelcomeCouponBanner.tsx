"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import { DURATION } from "@/components/motion/config";

const COUPON_CODE = "ARCBEGINS";
const DISCOUNT_LABEL = "15% OFF";

export default function WelcomeCouponBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions/unsupported browser) — the
      // code is still visible on the banner either way, so no error UI.
    }
  };

  return (
    <Reveal className="relative overflow-hidden bg-black px-6 py-10 md:px-14">
      {/* Subtle violet glow accents */}
      <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-4">
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-400 md:flex">
            <Sparkles className="h-7 w-7" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
              新しい物語へようこそ
            </p>
            <h3 className="mt-1 font-[family:var(--font-space)] text-2xl font-black uppercase leading-tight text-white md:text-3xl">
              Get {DISCOUNT_LABEL} on your first order
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Welcome to ZeroArc — use the code below at checkout.
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: DURATION.micro }}
          className="flex shrink-0 items-center gap-3 rounded-2xl border-2 border-dashed border-violet-500/50 bg-violet-600/10 px-6 py-4 transition-colors hover:border-violet-400"
        >
          <span className="font-[family:var(--font-space)] text-xl font-black tracking-[0.15em] text-white">
            {COUPON_CODE}
          </span>

          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-violet-400">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </span>
        </motion.button>
      </div>
    </Reveal>
  );
}
