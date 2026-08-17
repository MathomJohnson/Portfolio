"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CursorTrace } from "@/components/motion/CursorTrace";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

/**
 * Site-wide motion setup: the reduced-motion policy, the smooth scroll and
 * ScrollTrigger synchronisation, and the single CURSOR_TRACE mount.
 *
 * MotionConfig's reducedMotion="user" covers transform and layout animations
 * only. Effects built on clip-path, GSAP, or custom rAF loops handle the
 * preference themselves via useReducedMotion or gsap.matchMedia.
 */
export function ClientMotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        {children}
        <CursorTrace />
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
