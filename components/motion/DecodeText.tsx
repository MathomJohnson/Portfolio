"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { revealViewport } from "@/lib/motion-tokens";
import { motionTags, type MotionTag } from "./tags";

interface DecodeTextProps {
  text: string;
  /** Seconds to wait before the scramble starts. */
  delay?: number;
  trigger?: "mount" | "view";
  as?: MotionTag;
  className?: string;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>/\\";

/** Seconds before each successive character locks to its real value. */
const SECONDS_PER_CHARACTER = 0.035;
/** Milliseconds between re-randomising the not-yet-locked characters. */
const SCRAMBLE_INTERVAL_MS = 55;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * DECODE_TEXT — characters scramble and resolve to the real string in a
 * left-to-right wave.
 *
 * The real text is always present for assistive technology; the scrambling
 * characters are aria-hidden. Rendering starts from the resolved text so server
 * and client markup match, and the scramble begins after mount. Under reduced
 * motion no scramble runs at all.
 *
 * Best paired with a monospace face: fixed advance widths mean the substituted
 * glyphs cannot reflow the line.
 */
export function DecodeText({
  text,
  delay = 0,
  trigger = "mount",
  as = "span",
  className,
}: DecodeTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const visibleRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(visibleRef, revealViewport);
  const [display, setDisplay] = useState(text);

  const Component = motionTags[as];
  const shouldRun =
    !prefersReducedMotion && (trigger === "mount" || isInView);

  useEffect(() => {
    if (!shouldRun) {
      setDisplay(text);
      return;
    }

    const characters = Array.from(text);
    const startTime = performance.now() + delay * 1000;
    const lockAll = characters.length * SECONDS_PER_CHARACTER;

    let frame = 0;
    let lastScramble = 0;
    let scrambled = characters.map(() => randomGlyph());

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      if (now - lastScramble > SCRAMBLE_INTERVAL_MS) {
        lastScramble = now;
        scrambled = characters.map(() => randomGlyph());
      }

      setDisplay(
        characters
          .map((character, index) => {
            if (character === " ") return character;
            const lockTime = index * SECONDS_PER_CHARACTER;
            return elapsed >= lockTime ? character : scrambled[index];
          })
          .join(""),
      );

      if (elapsed < lockAll) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delay, shouldRun, text]);

  return (
    <Component className={className}>
      <span className="sr-only">{text}</span>
      <span ref={visibleRef} aria-hidden="true">
        {display}
      </span>
    </Component>
  );
}
