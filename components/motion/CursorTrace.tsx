"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { microTransition, motionTokens } from "@/lib/motion-tokens";

const DOT_SIZE = 6;
const RING_SIZE = 34;

/**
 * CURSOR_TRACE — a small amber dot at the pointer with a spring-lagged ring
 * trailing behind it. Mounted once in the root layout and active for the whole
 * page.
 *
 * Fully disabled (not simplified) on touch devices and under reduced motion.
 * Position is driven by motion values written from an rAF-throttled pointer
 * handler, so it never triggers a React render.
 */
export function CursorTrace() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useFinePointer();
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(dotX, motionTokens.springMagnetic);
  const ringY = useSpring(dotY, motionTokens.springMagnetic);

  const enabled = isFinePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let latestX = 0;
    let latestY = 0;

    const apply = () => {
      frame = 0;
      dotX.set(latestX);
      dotY.set(latestY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestX = event.clientX;
      latestY = event.clientY;
      setVisible(true);
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const handlePointerLeave = () => setVisible(false);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [dotX, dotY, enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      {/* Negative margins centre each element on the pointer; x/y already
          occupy the transform, so translate percentages cannot be used here. */}
      <motion.span
        className="absolute left-0 top-0 rounded-full bg-signal"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          x: dotX,
          y: dotY,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={microTransition()}
      />
      <motion.span
        className="absolute left-0 top-0 rounded-full border border-signal-dim"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          x: ringX,
          y: ringY,
        }}
        animate={{ opacity: visible ? 0.7 : 0 }}
        transition={microTransition()}
      />
    </div>
  );
}
