"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION, EASE_OUT, STAGGER_GAP, VIEWPORT } from "./config";

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}

/** Wraps a list of <StaggerItem> children and reveals them in sequence
 * when the group scrolls into view. */
export function StaggerGroup({
  children,
  className,
  gap = STAGGER_GAP,
  delay = 0,
}: StaggerGroupProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduceMotion ? 0 : gap,
            delayChildren: reduceMotion ? 0 : delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className,
  y = 14,
  duration = DURATION.section,
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  const transition: Transition = {
    duration: reduceMotion ? 0.25 : duration,
    ease: EASE_OUT,
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : y },
        show: { opacity: 1, y: 0, transition },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
