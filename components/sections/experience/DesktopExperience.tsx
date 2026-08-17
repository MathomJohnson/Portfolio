"use client";

import { useCallback, useRef } from "react";
import { ScrollTrace } from "@/components/motion/ScrollTrace";
import { useExperienceScroll } from "@/hooks/useExperienceScroll";
import type { ExperienceEntry } from "@/lib/content";
import { ExperienceCard } from "./ExperienceCard";

interface DesktopExperienceProps {
  entries: ExperienceEntry[];
  eyebrow: string;
  heading: string;
}

/**
 * The pinned horizontal presentation of the Experience section (HORIZONTAL_PIN).
 *
 * The section holds one screen at 100svh while vertical scroll drives the card
 * row sideways. It is rendered only under the conditions in
 * EXPERIENCE_PIN_QUERY; every other context gets MobileExperience instead.
 */
export function DesktopExperience({
  entries,
  eyebrow,
  heading,
}: DesktopExperienceProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const traceFillRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const registerNode = useCallback(
    (index: number, element: HTMLSpanElement | null) => {
      nodeRefs.current[index] = element;
    },
    [],
  );

  useExperienceScroll({
    pinRef,
    viewportRef,
    trackRef,
    traceFillRef,
    progressFillRef,
    nodeRefs,
    count: entries.length,
  });

  return (
    <div className="experience-desktop">
      <div
        ref={pinRef}
        className="flex h-[100svh] flex-col justify-center overflow-hidden py-[var(--section-padding-block)]"
      >
        <header className="section-inner">
          <p className="mono-label text-signal">{eyebrow}</p>
          <h2 className="display-l mt-4">{heading}</h2>
        </header>

        <div ref={viewportRef} className="mt-12 overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 px-[var(--section-padding-inline)] will-change-transform"
          >
            {entries.map((entry, index) => (
              <div key={entry.id} className="w-[min(78vw,26rem)] shrink-0">
                <ExperienceCard entry={entry} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="section-inner mt-10">
          <ScrollTrace
            count={entries.length}
            fillRef={traceFillRef}
            registerNode={registerNode}
          />
        </div>

        {/* Horizontal progress indicator, in place of the vertical scroll cue
            the other sections use. */}
        <div className="section-inner mt-10">
          <span
            aria-hidden="true"
            className="relative block h-px w-24 bg-[var(--border-hairline)]"
          >
            <span
              ref={progressFillRef}
              className="absolute inset-0 block origin-left scale-x-0 bg-signal"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
