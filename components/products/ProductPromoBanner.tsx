"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles } from "lucide-react";

// Same welcome offer shown on the homepage — reused here so it's
// consistent everywhere, not a separate/duplicate promo to maintain.
const COUPON_CODE = "ARCBEGINS";
const DISCOUNT_LABEL = "15% OFF";

export default function ProductPromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions/unsupported browser) — the
      // code is still visible either way, so no error UI needed.
    }
  };

  return (
    <div className="relative flex h-full min-h-[280px] flex-col justify-center overflow-hidden rounded-2xl bg-black px-6 py-8 text-center">
      <Image
        src="/images/promo/promo.png"
        alt=""
        fill
        className="object-cover opacity-70"
      />

      {/* Darkening overlay so the text stays fully readable over the artwork */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      {/* Subtle violet glow accents */}
      <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-400">
          <Sparkles className="h-6 w-6" />
        </div>

        <h3 className="mt-4 font-[family:var(--font-space)] text-xl font-black uppercase leading-tight text-white">
          Get {DISCOUNT_LABEL}
          <br />
          on your first order
        </h3>

        <p className="mt-2 text-xs text-zinc-400">
          Use the code below at checkout.
        </p>

        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="mx-auto mt-5 flex items-center gap-2.5 rounded-xl border-2 border-dashed border-violet-500/50 bg-violet-600/10 px-4 py-3 transition-colors hover:border-violet-400"
        >
          <span className="font-[family:var(--font-space)] text-base font-black tracking-[0.1em] text-white">
            {COUPON_CODE}
          </span>

          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-violet-400">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
