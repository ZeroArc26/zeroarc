"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lock, Truck, Check } from "lucide-react";

import { EASE_OUT } from "@/components/motion/config";

export type OrderButtonStatus = "idle" | "loading" | "success";

interface OrderButtonProps {
  status: OrderButtonStatus;
  onClick: () => void;
  idleLabel?: string;
}

/**
 * Checkout submit button with a 3-stage sequence:
 * idle (full-width "Proceed to Payment")
 * -> loading (shrinks to a small centered pill; a truck glyph slides
 *    back and forth inside it, echoing a delivery-in-progress state)
 * -> success (expands back out, morphs to green, "Order Placed" + check).
 *
 * The width change between stages is a `layout` animation (Framer
 * Motion's FLIP-based technique) — that shrink/expand is what makes the
 * transition read as dynamic rather than a static color/text swap.
 *
 * Presentation only — status is driven entirely by the caller (checkout
 * page owns the real order-placement logic); this component never makes
 * its own network calls or decisions about when the order is "done".
 */
export default function OrderButton({
  status,
  onClick,
  idleLabel = "Proceed to Payment",
}: OrderButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-5 flex w-full justify-center">
      <motion.button
        layout
        type="button"
        onClick={onClick}
        disabled={status !== "idle"}
        animate={{
          backgroundColor: status === "success" ? "#059669" : "#7c3aed",
        }}
        transition={{
          layout: { duration: reduceMotion ? 0.2 : 0.45, ease: EASE_OUT },
          backgroundColor: { duration: 0.35 },
        }}
        className={`relative flex h-[52px] items-center justify-center overflow-hidden rounded-xl text-sm font-semibold text-white disabled:cursor-not-allowed ${
          status === "loading" ? "w-20" : "w-full"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Lock className="h-4 w-4" />
              {idleLabel}
            </motion.span>
          )}

          {status === "loading" && (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex h-full w-full items-center justify-center"
            >
              {reduceMotion ? (
                <Truck className="h-5 w-5" />
              ) : (
                <motion.span
                  className="absolute flex items-center"
                  animate={{ x: [4, 44, 4] }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Truck className="h-5 w-5" />
                </motion.span>
              )}
            </motion.span>
          )}

          {status === "success" && (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Check className="h-4 w-4" />
              Order Placed
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
