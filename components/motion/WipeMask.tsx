"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { revealTransition, revealViewport } from "@/lib/motion-tokens";

interface WipeMaskProps {
  children: ReactNode;
  direction?: "diagonal" | "horizontal";
  delay?: number;
  className?: string;
}

/**
 * WIPE_MASK — a directional clip-path wipe used to reveal images on scroll. The
 * diagonal variant keeps a slanted leading edge by interpolating between two
 * four-point polygons with matching units.
 *
 * As in SIGNAL_REVEAL, the observed element and the masked element are separate:
 * an element clipped to zero area reports an intersectionRatio of 0 even when it
 * is on screen, so observing the masked element would leave the image
 * permanently hidden. Under reduced motion this becomes an opacity fade.
 */
const clipPaths = {
  diagonal: {
    hidden: "polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)",
    shown: "polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)",
  },
  horizontal: {
    hidden: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    shown: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
} as const;

export function WipeMask({
  children,
  direction = "diagonal",
  delay = 0,
  className,
}: WipeMaskProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, revealViewport);
  const paths = clipPaths[direction];

  // As in SIGNAL_REVEAL, the reduced-motion states still name clipPath so the
  // masked value the server rendered is cleared once the preference resolves.
  const hidden = prefersReducedMotion
    ? { clipPath: paths.shown, opacity: 0 }
    : { clipPath: paths.hidden, opacity: 1 };

  const shown = { clipPath: paths.shown, opacity: 1 };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={hidden}
        animate={isInView ? shown : hidden}
        transition={revealTransition(delay)}
      >
        {children}
      </motion.div>
    </div>
  );
}
