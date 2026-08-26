"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  hoverSpring,
  microTransition,
  revealTransition,
  revealViewport,
  staggerDelay,
} from "@/lib/motion-tokens";

interface IconLiftProps {
  icon: ReactNode;
  label: string;
  /** Position in the row, used for the staggered entrance. */
  index: number;
  /**
   * Touch-only: whether this icon's caption chip is open. Fine-pointer
   * devices ignore this and keep the hover tooltip.
   */
  open?: boolean;
  /** Touch-only: tap handler that opens or switches the caption chip. */
  onToggle?: () => void;
  /** When false, taps open a chip instead of relying on hover. */
  finePointer?: boolean;
}

const circleClasses =
  "flex size-12 items-center justify-center rounded-full border border-hairline bg-surface text-tertiary transition-tint group-hover:border-signal-dim group-hover:text-signal";

/**
 * ICON_LIFT — staggered entrance, then on hover a 4px lift, a colour shift from
 * --text-tertiary to --accent-signal, and a small label tooltip.
 *
 * The label is always in the DOM so assistive technology always reads it. On
 * pointer-fine devices it is positioned and revealed as a tooltip. On touch the
 * in-flow caption is hidden; tapping the icon opens a chip (owned by the
 * parent so only one is visible). Closed chips use `display: none` so a
 * `whitespace-nowrap` label cannot widen the page. Under reduced motion the
 * lift and stagger are dropped and only opacity animates.
 */
export function IconLift({
  icon,
  label,
  index,
  open = false,
  onToggle,
  finePointer = false,
}: IconLiftProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition(staggerDelay(index))}
    >
      {finePointer ? (
        <motion.span
          aria-hidden="true"
          className={circleClasses}
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          transition={hoverSpring}
        >
          {icon}
        </motion.span>
      ) : (
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          onClick={onToggle}
          className={`${circleClasses} ${open ? "border-signal-dim text-signal" : ""}`}
        >
          {icon}
        </button>
      )}

      {finePointer ? (
        <span className="mono-label absolute top-full mt-2 whitespace-nowrap text-center text-[0.6875rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:text-secondary">
          {label}
        </span>
      ) : (
        <motion.span
          aria-hidden="true"
          className={`mono-label pointer-events-none absolute top-full z-10 mt-2 whitespace-nowrap rounded-lg border border-hairline bg-surface px-3 py-1.5 text-[0.6875rem] ${open ? "" : "hidden"}`}
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={microTransition()}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
