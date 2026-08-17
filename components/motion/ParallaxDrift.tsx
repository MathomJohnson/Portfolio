"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode, RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ParallaxDriftProps {
  children: ReactNode;
  /** The section whose scroll progress drives the drift. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Total vertical travel across the section's scroll span, in pixels. */
  range?: [number, number];
  className?: string;
}

/**
 * PARALLAX_DRIFT — the wrapped column drifts vertically across its section's own
 * scroll span, creating depth without 3D.
 *
 * Progress is scoped to sectionRef rather than the page, so the offset stays
 * correct regardless of where the section sits on the page. Under reduced motion
 * the element is static.
 */
export function ParallaxDrift({
  children,
  sectionRef,
  range = [-40, 40],
  className,
}: ParallaxDriftProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Zeroing the range rather than dropping the style keeps a transform present
  // in both cases, so the resolved preference cannot change the rendered markup.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : range,
  );

  return (
    <motion.div className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
