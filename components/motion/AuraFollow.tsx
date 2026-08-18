"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionTokens } from "@/lib/motion-tokens";

interface AuraFollowProps {
  children: ReactNode;
  className?: string;
}

/**
 * How far each layer travels relative to auraMaxOffset. The outer, softest
 * layer moves most, so the aura shears slightly as it drifts instead of sliding
 * as one rigid block.
 */
const LAYER_TRAVEL = [1, 0.62, 0.3];

/**
 * AURA_FOLLOW — a soft amber light behind the hero portrait that leans toward
 * the cursor.
 *
 * Three blurred radial-gradient layers rather than one shape, so the result
 * reads as diffuse light with no edge to catch the eye. The portrait itself
 * never moves; only the light behind it does. The pull is derived from the
 * cursor's position across the whole viewport rather than a proximity radius,
 * so the aura leans toward whichever side of the page the cursor is on.
 *
 * Pointer-fine only, and static under reduced motion: touch and reduced-motion
 * visitors get the same aura sitting at rest, which is the resting state of the
 * animated version rather than a separate treatment.
 */
export function AuraFollow({ children, className = "" }: AuraFollowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useFinePointer();

  const enabled = isFinePointer && !prefersReducedMotion;

  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const springX = useSpring(pullX, motionTokens.springAura);
  const springY = useSpring(pullY, motionTokens.springAura);

  useEffect(() => {
    if (!enabled) {
      pullX.set(0);
      pullY.set(0);
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

        // Normalised against half the viewport, so the cursor reaching an edge
        // of the screen corresponds to the aura's full travel.
        const ratioX = (event.clientX - centerX) / (window.innerWidth / 2);
        const ratioY = (event.clientY - centerY) / (window.innerHeight / 2);

        pullX.set(clamp(ratioX) * motionTokens.auraMaxOffset);
        pullY.set(clamp(ratioY) * motionTokens.auraMaxOffset);
      });
    };

    const reset = () => {
      pullX.set(0);
      pullY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", reset);
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, [enabled, pullX, pullY]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* First in the DOM and unpositioned relative to the portrait, so it
          paints underneath without needing a negative z-index. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <AuraLayer x={springX} y={springY} travel={LAYER_TRAVEL[0]} variant="glow" />
        <AuraLayer x={springX} y={springY} travel={LAYER_TRAVEL[1]} variant="bloom" />
        <AuraLayer x={springX} y={springY} travel={LAYER_TRAVEL[2]} variant="core" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}

type MotionNumber = ReturnType<typeof useSpring>;

interface AuraLayerProps {
  x: MotionNumber;
  y: MotionNumber;
  travel: number;
  variant: "glow" | "bloom" | "core";
}

/**
 * The drift transform and the organic breathing live on separate elements: both
 * animate `transform`, so sharing an element would make the CSS keyframes and
 * the Motion values overwrite each other.
 */
function AuraLayer({ x, y, travel, variant }: AuraLayerProps) {
  const layerX = useTransform(x, (value) => value * travel);
  const layerY = useTransform(y, (value) => value * travel);

  return (
    <motion.div className="absolute inset-0" style={{ x: layerX, y: layerY }}>
      <div className={`aura-layer aura-layer--${variant}`} />
    </motion.div>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(-1, value));
}
