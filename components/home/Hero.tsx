"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import { DURATION, EASE_OUT } from "@/components/motion/config";

/** True at `lg` and above. Scroll-linked parallax is desktop-only —
 * mobile gets the entrance reveals but not the continuous scroll
 * transform, per the mobile motion guidelines.
 *
 * Uses useSyncExternalStore (not a useEffect+setState pair) since this
 * is exactly what it's for: subscribing to a browser API's current
 * value in a way that's safe across server/client renders. */
function subscribeToViewport(callback: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getIsDesktopSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getIsDesktopServerSnapshot() {
  return false;
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToViewport,
    getIsDesktopSnapshot,
    getIsDesktopServerSnapshot
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const modelY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  const parallaxActive = isDesktop && !reduceMotion;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[650px] h-[calc(100vh-140px)] overflow-hidden bg-black text-white"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={parallaxActive ? { scale: bgScale } : undefined}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.hero * 1.3, ease: EASE_OUT }}
          >
            <Image
              src="/images/hero/hero-bg.png"
              alt=""
              fill
              priority
              className="object-cover opacity-40"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
      </div>

      {/* Layered model cutout */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] w-full opacity-60 lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:w-[60%] lg:opacity-100">
        <motion.div
          className="relative h-full w-full"
          style={parallaxActive ? { y: modelY } : undefined}
        >
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0, scale: 1.05, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: DURATION.hero,
              delay: 0.15,
              ease: EASE_OUT,
            }}
          >
            <Image
              src="/images/hero/hero-main.png"
              alt="ZeroArc models"
              fill
              priority
              className="object-cover object-bottom lg:object-top"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-[1700px] items-center px-10 xl:px-20"
        style={parallaxActive ? { opacity: contentOpacity } : undefined}
      >
        {/* ================= LEFT ================= */}
        <div className="flex w-full max-w-2xl flex-col justify-center">
          <Reveal trigger="mount" delay={0.35} y={12}>
            <p className="mb-4 text-[20px] tracking-[0.28em] text-violet-500">
              次の物語を、着よう
            </p>
          </Reveal>

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
            <RevealText lines={["WEAR YOUR", "NEXT ARC"]} delay={0.55} />
          </h1>

          <Reveal trigger="mount" delay={0.95}>
            <p className="mt-6 max-w-[460px] text-[17px] leading-[1.7] text-zinc-300">
              Premium streetwear inspired by anime,
              <br />
              culture and limitless imagination.
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={1.05}>
            <div className="mt-8 flex gap-5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: DURATION.micro }}
                className="rounded-xl bg-violet-600 px-8 py-4 text-sm font-semibold tracking-[0.08em] transition-colors hover:bg-violet-500"
              >
                SHOP MEN →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: DURATION.micro }}
                className="rounded-xl border border-zinc-600 px-8 py-4 text-sm font-semibold tracking-[0.08em] transition-colors hover:bg-white hover:text-black"
              >
                SHOP WOMEN →
              </motion.button>
            </div>
          </Reveal>
        </div>
      </motion.div>

      {/* Scroll down */}
      <Reveal
        trigger="mount"
        delay={1.2}
        y={8}
        className="absolute bottom-10 right-10 z-10 hidden items-center gap-2 text-xs tracking-[0.2em] text-zinc-400 xl:flex"
      >
        SCROLL DOWN
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </Reveal>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent" />
    </section>
  );
}
