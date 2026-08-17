"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { hoverSpring } from "@/lib/motion-tokens";

export interface WaveHoverItem {
  id: string;
  content: ReactNode;
}

interface WaveHoverGroupProps {
  items: WaveHoverItem[];
  /** Accessible name for the list. */
  label: string;
  /** Peak lift in pixels for the directly hovered item. */
  amplitude?: number;
  className?: string;
}

/** Ripple falloff: neighbours lift less the further they are from the pointer. */
function offsetFor(index: number, active: number | null, amplitude: number) {
  if (active === null) return 0;
  const distance = Math.abs(index - active);
  return -amplitude * Math.pow(0.45, distance);
}

/**
 * WAVE_HOVER — hovering one item in a row lifts it and ripples a smaller,
 * spring-offset lift across its siblings. Focus drives the same effect so
 * keyboard users get equivalent feedback.
 *
 * Under reduced motion the offsets resolve to zero; the row's colour hover
 * states are CSS and remain.
 */
export function WaveHoverGroup({
  items,
  label,
  amplitude = 8,
  className,
}: WaveHoverGroupProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul
      aria-label={label}
      className={className}
      onPointerLeave={() => setActive(null)}
      onBlur={() => setActive(null)}
    >
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          onPointerEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          animate={{
            y: prefersReducedMotion
              ? 0
              : offsetFor(index, active, amplitude),
          }}
          transition={hoverSpring}
          style={{ willChange: prefersReducedMotion ? undefined : "transform" }}
        >
          {item.content}
        </motion.li>
      ))}
    </ul>
  );
}
