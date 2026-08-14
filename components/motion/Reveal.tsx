"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION, EASE_OUT, VIEWPORT } from "./config";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  /**
   * "viewport" (default): reveals when scrolled into view — use for
   * anything below the fold.
   * "mount": reveals immediately on load — use for above-the-fold content
   * (announcement bar, navbar, hero) so the page doesn't feel like it's
   * waiting for a scroll to show its own first screen.
   */
  trigger?: "viewport" | "mount";
  /** Semantic element to render — defaults to div. Use "aside" for
   * sidebars etc. so accessibility/semantics aren't lost to motion. */
  as?: "div" | "aside" | "section";
}

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  duration = DURATION.section,
  trigger = "viewport",
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const distance = reduceMotion ? 0 : y;
  const finalDuration = reduceMotion ? Math.min(duration, 0.25) : duration;

  const transition: Transition = {
    duration: finalDuration,
    delay: reduceMotion ? 0 : delay,
    ease: EASE_OUT,
  };

  const MotionTag =
    as === "aside" ? motion.aside : as === "section" ? motion.section : motion.div;

  if (trigger === "mount") {
    return (
      <MotionTag
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={className}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={transition}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
