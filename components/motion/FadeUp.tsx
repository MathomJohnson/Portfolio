"use client";

import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  revealTransition,
  revealViewport,
  staggerDelay,
} from "@/lib/motion-tokens";
import { motionTags, type MotionTag } from "./tags";

interface FadeUpProps {
  children: ReactNode;
  as?: MotionTag;
  /** Extra delay in seconds, added on top of any stagger delay. */
  delay?: number;
  /** Position within a staggered group; multiplied by staggerBase. */
  staggerIndex?: number;
  trigger?: "mount" | "view";
  className?: string;
}

/**
 * FADE_UP — opacity fade plus an 8px rise, with optional per-index stagger.
 * Deliberately quiet: used for body copy, bullets and category eyebrows so they
 * do not compete with the page's signature interactions.
 *
 * Under reduced motion the rise is dropped and only opacity animates.
 */
export function FadeUp({
  children,
  as = "div",
  delay = 0,
  staggerIndex = 0,
  trigger = "view",
  className,
}: FadeUpProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const Component = motionTags[as];

  const hidden = { opacity: 0, y: prefersReducedMotion ? 0 : 8 };
  const shown = { opacity: 1, y: 0 };

  const animationProps =
    trigger === "mount"
      ? { animate: shown }
      : { whileInView: shown, viewport: revealViewport };

  return (
    <Component
      className={className}
      initial={hidden}
      transition={revealTransition(delay + staggerDelay(staggerIndex))}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
