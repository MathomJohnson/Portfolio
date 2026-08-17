"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { microTransition } from "@/lib/motion-tokens";

interface ScrollCueProps {
  /** Id of the next section; the cue is dismissed once it enters view. */
  targetId: string;
  label?: string;
}

/**
 * SCROLL_CUE — small mono label plus a line, pulsing on a loop, dismissed once
 * the next section enters view. Under reduced motion the pulse is dropped and
 * the cue is a static label that fades out.
 */
export function ScrollCue({ targetId, label = "Scroll" }: ScrollCueProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDismissed(entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  // The opacity floor stays high: dimming the label further would drop it below
  // the contrast minimum for the greater part of every loop.
  const pulse = prefersReducedMotion
    ? undefined
    : {
        y: [0, 6, 0],
        opacity: [0.85, 1, 0.85],
      };

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: dismissed ? 0 : 1 }}
      transition={microTransition()}
    >
      <motion.div
        className="flex flex-col items-center gap-3"
        animate={pulse}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 2.4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
      >
        <span className="mono-label text-[0.75rem]">{label}</span>
        <span
          className="block h-10 w-px"
          style={{
            background:
              "linear-gradient(to bottom, var(--border-hairline-strong), transparent)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
