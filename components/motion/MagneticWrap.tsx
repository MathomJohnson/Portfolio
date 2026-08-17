"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { motionTokens } from "@/lib/motion-tokens";

interface MagneticWrapProps {
  children: ReactNode;
  /** Proximity field extending beyond the element's bounds, in pixels. */
  radius?: number;
  /** Maximum displacement toward the cursor, in pixels. */
  maxOffset?: number;
  className?: string;
}

/**
 * MAGNETIC_PULL — the element shifts up to maxOffset toward the cursor once the
 * cursor is within radius of its bounds, and springs back to rest on leave.
 *
 * Pointer-fine only and disabled under reduced motion. The pointer handler is
 * rAF-throttled and writes to motion values, so it never triggers a React
 * render.
 */
export function MagneticWrap({
  children,
  radius = 80,
  maxOffset = 10,
  className = "inline-block",
}: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useFinePointer();

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, motionTokens.springMagnetic);
  const springY = useSpring(offsetY, motionTokens.springMagnetic);

  const enabled = isFinePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) {
      offsetX.set(0);
      offsetY.set(0);
      return;
    }

    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const element = ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const reach = Math.max(rect.width, rect.height) / 2 + radius;

        if (distance > reach || distance === 0) {
          offsetX.set(0);
          offsetY.set(0);
          return;
        }

        const strength = 1 - distance / reach;
        offsetX.set((deltaX / distance) * maxOffset * strength);
        offsetY.set((deltaY / distance) * maxOffset * strength);
      });
    };

    const reset = () => {
      offsetX.set(0);
      offsetY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", reset);
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, [enabled, maxOffset, offsetX, offsetY, radius]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x: springX, y: springY } : undefined}
    >
      {children}
    </motion.div>
  );
}
