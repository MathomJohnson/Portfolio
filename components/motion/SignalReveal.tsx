"use client";

import { motion, useInView } from "motion/react";
import { createElement, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { revealTransition, revealViewport } from "@/lib/motion-tokens";
import type { MotionTag } from "./tags";

interface SignalRevealProps {
  children: ReactNode;
  as?: MotionTag;
  delay?: number;
  trigger?: "mount" | "view";
  className?: string;
  id?: string;
}

/**
 * SIGNAL_REVEAL — clip-path inset() unmask, left to right.
 *
 * Three details are load-bearing:
 *
 * 1. The observed element and the masked element are different. An element
 *    clipped to zero area reports an intersectionRatio of 0 even when its box
 *    is fully on screen, so observing the masked element itself would deadlock:
 *    it could never be seen, so it could never be revealed. The outer element
 *    is never clipped and carries the ref.
 * 2. Every inset uses the same unit. Motion interpolates clip-path
 *    componentwise and cannot animate a percentage to an em.
 * 3. The negative vertical insets keep ascenders and descenders from being
 *    clipped mid-animation.
 *
 * Under reduced motion this resolves to a plain opacity fade with no mask.
 */
export function SignalReveal({
  children,
  as = "div",
  delay = 0,
  trigger = "view",
  className,
  id,
}: SignalRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, revealViewport);

  const masked = "inset(-15% 100% -15% 0%)";
  const unmasked = "inset(-15% -2% -15% 0%)";

  // The reduced-motion states keep the mask fully open and animate opacity only.
  // They must still name clipPath: the server renders the masked state, because
  // the preference is not known until after mount, and only an animation that
  // includes clipPath will clear that inline value once it resolves.
  const hidden = prefersReducedMotion
    ? { clipPath: unmasked, opacity: 0 }
    : { clipPath: masked, opacity: 1 };

  const shown = { clipPath: unmasked, opacity: 1 };

  const show = trigger === "mount" || isInView;

  return createElement(
    as,
    { ref, id, className },
    <motion.span
      className="block"
      initial={hidden}
      animate={show ? shown : hidden}
      transition={revealTransition(delay)}
    >
      {children}
    </motion.span>,
  );
}
