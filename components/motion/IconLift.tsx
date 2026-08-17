"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  hoverSpring,
  revealTransition,
  revealViewport,
  staggerDelay,
} from "@/lib/motion-tokens";

interface IconLiftProps {
  icon: ReactNode;
  label: string;
  /** Position in the row, used for the staggered entrance. */
  index: number;
}

/**
 * ICON_LIFT — staggered entrance, then on hover a 4px lift, a colour shift from
 * --text-tertiary to --accent-signal, and a small label tooltip.
 *
 * The label is always in the DOM so assistive technology always reads it. On
 * pointer-fine devices it is positioned and revealed as a tooltip; on touch it
 * stays a visible caption, since there is no hover state to reveal it. Under
 * reduced motion the lift and stagger are dropped and only opacity animates.
 */
export function IconLift({ icon, label, index }: IconLiftProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="group flex flex-col items-center gap-2 pointer-fine:relative"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition(staggerDelay(index))}
    >
      <motion.span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full border border-hairline bg-surface text-tertiary transition-tint group-hover:border-signal-dim group-hover:text-signal"
        whileHover={prefersReducedMotion ? undefined : { y: -4 }}
        transition={hoverSpring}
      >
        {icon}
      </motion.span>

      <span className="mono-label whitespace-nowrap text-center text-[0.6875rem] transition-opacity duration-200 group-hover:text-secondary pointer-fine:absolute pointer-fine:top-full pointer-fine:mt-2 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100">
        {label}
      </span>
    </motion.div>
  );
}
