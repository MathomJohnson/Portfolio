"use client";

import { useInView } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { TerminalPrint } from "@/components/motion/TerminalPrint";
import type { SkillCategory } from "@/lib/content";
import { motionTokens, revealViewport } from "@/lib/motion-tokens";

interface SkillGridProps {
  categories: SkillCategory[];
}

/**
 * Skill columns printed by TERMINAL_PRINT, one after another: the left column
 * types and dumps, then the middle, then the right. Only the column after the
 * last completed one is active, so the sequence is driven by completion rather
 * than by precomputed delays — a long column cannot be overtaken by the next.
 *
 * Three columns from `lg` up (three, then the remaining two on the next row).
 * Stacked below that. A two-column middle step is fine now that there are five
 * groups; it no longer leaves a single leftover column.
 *
 * The desktop row is `1fr auto 1fr`: the first dump lines up with the section
 * title, the middle dump sits on the content midpoint, and the third dump
 * packs to the right edge so both outer columns sit the same distance from
 * the center.
 */
export function SkillGrid({ categories }: SkillGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, revealViewport);
  const [lastCompleted, setLastCompleted] = useState(-1);

  const handleComplete = useCallback((index: number) => {
    // Monotonic: a column that reports completion twice cannot skip a column.
    setLastCompleted((current) => Math.max(current, index));
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid w-full grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:[&>:nth-child(3n+3)]:justify-self-end"
    >
      {categories.map((category, index) => (
        <TerminalPrint
          key={category.id}
          filename={category.filename}
          label={category.label}
          lines={category.skills}
          active={isInView && index <= lastCompleted + 1}
          startDelayMs={index === 0 ? 0 : motionTokens.terminalColumnGapMs}
          idleCursor={index === categories.length - 1}
          onComplete={() => handleComplete(index)}
        />
      ))}
    </div>
  );
}
