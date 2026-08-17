"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { motionTokens } from "@/lib/motion-tokens";

interface TiltCardProps {
  children: ReactNode;
  /** Maximum rotation on either axis, in degrees. */
  maxDegrees?: number;
  /** Allows a caller to switch the effect off, e.g. in the mobile layout. */
  enabled?: boolean;
  className?: string;
}

/**
 * TILT_3D — the card tilts toward the cursor using rotateX/rotateY with CSS
 * perspective.
 *
 * The rotation is computed only inside the pointermove handler, from the card's
 * rect at event time. It is deliberately not recomputed per animation frame or
 * tied to scroll position: during the Experience scrub a card slides under a
 * stationary cursor, and recomputing then would read as flicker rather than a
 * deliberate tilt.
 *
 * Pointer-fine only and disabled under reduced motion.
 */
export function TiltCard({
  children,
  maxDegrees = 5,
  enabled = true,
  className,
}: TiltCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useFinePointer();

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, motionTokens.springHover);
  const rotateY = useSpring(rotateYValue, motionTokens.springHover);

  const active = enabled && isFinePointer && !prefersReducedMotion;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    rotateYValue.set(relativeX * maxDegrees * 2);
    rotateXValue.set(-relativeY * maxDegrees * 2);
  };

  const handlePointerLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  return (
    <motion.div
      className={className}
      onPointerMove={active ? handlePointerMove : undefined}
      onPointerLeave={active ? handlePointerLeave : undefined}
      style={
        active
          ? { rotateX, rotateY, transformPerspective: 900 }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
