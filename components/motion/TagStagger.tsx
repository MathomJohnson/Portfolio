"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { microTransition, staggerDelay } from "@/lib/motion-tokens";

interface TagStaggerProps {
  tags: string[];
  /** True while the parent card is hovered. */
  active: boolean;
  /** Accessible name for the tag list. */
  label: string;
}

/**
 * TAG_STAGGER — tech-stack tags cascade in one after another on card hover
 * rather than appearing all at once.
 *
 * On touch devices and under reduced motion the tags render statically with no
 * stagger, since there is no hover state to trigger them. The tags are always in
 * the DOM, so only their opacity and offset change.
 */
export function TagStagger({ tags, active, label }: TagStaggerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useFinePointer();

  const animated = isFinePointer && !prefersReducedMotion;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <motion.li
          key={tag}
          initial={false}
          animate={
            animated
              ? { opacity: active ? 1 : 0, y: active ? 0 : 4 }
              : { opacity: 1, y: 0 }
          }
          transition={microTransition(active ? staggerDelay(index) : 0)}
          className="rounded-full border border-hairline bg-surface-raised px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-secondary"
        >
          {tag}
        </motion.li>
      ))}
    </ul>
  );
}
