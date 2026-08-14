"use client";

import { motion, useReducedMotion } from "framer-motion";

import { DURATION, EASE_OUT } from "./config";

interface RevealTextProps {
  lines: string[];
  className?: string;
  delay?: number;
  lineStagger?: number;
}

/**
 * Premium editorial text reveal: each line sits inside an
 * overflow-hidden mask and slides up into place, staggered line by
 * line. Used for the Hero headline — not a generic per-letter effect,
 * kept to line-level so it reads as confident typography rather than
 * an animation demo.
 */
export default function RevealText({
  lines,
  className,
  delay = 0,
  lineStagger = 0.09,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={className}
            style={{ display: "block" }}
            initial={{
              y: reduceMotion ? 0 : "100%",
              opacity: reduceMotion ? 1 : 0,
            }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0.25 : DURATION.hero * 0.7,
              delay: reduceMotion ? 0 : delay + i * lineStagger,
              ease: EASE_OUT,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
