"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionTokens } from "@/lib/motion-tokens";

interface OrbitRingProps {
  children: ReactNode;
  /** Adds a slow rotating arc after the ring finishes drawing. */
  ambient?: boolean;
  className?: string;
}

/** Circumference of the r=49 circle in the 100x100 viewBox, for the arc dash. */
const CIRCUMFERENCE = 2 * Math.PI * 49;
const ARC_LENGTH = 16;

/**
 * ORBIT_RING — an SVG ring draws itself around the element on mount via
 * stroke-dasharray, then an optional short amber arc orbits it slowly.
 *
 * Under reduced motion the ring appears at its static end state and the ambient
 * arc is not rendered.
 */
export function OrbitRing({
  children,
  ambient = true,
  className = "",
}: OrbitRingProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {children}

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[5%] size-auto overflow-visible"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--accent-signal-dim)"
          strokeWidth="0.4"
          initial={{ opacity: 1, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{
            duration: prefersReducedMotion
              ? 0
              : motionTokens.durationReveal * 1.6,
            ease: motionTokens.easeSignal,
          }}
          style={{ rotate: -90, transformBox: "view-box", transformOrigin: "center" }}
        />

        {/* The ambient arc is hidden with CSS rather than removed from the tree,
            so the markup does not change once the motion preference resolves. */}
        {ambient && (
          <motion.g
            className="motion-reduce:hidden"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          >
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="var(--accent-signal)"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
