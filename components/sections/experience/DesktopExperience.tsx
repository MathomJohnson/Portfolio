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

        {/* py-10 gives TILT_3D room to rotate without hitting this overflow
            clip. overflow-x must stay hidden so the horizontal track does not
            leak; the matching vertical padding is what keeps the tilt inside. */}
        <div ref={viewportRef} className="mt-8 overflow-hidden py-10">
          {/* Right padding on a flex row is dropped from scrollWidth in most
              browsers, so the last card would pin flush to the clip. A shrink-0
              ::after spacer is included in overflow, matching the left inset. */}
          <div
            ref={trackRef}
            className="flex gap-6 pl-[var(--section-padding-inline)] will-change-transform after:block after:w-[var(--section-padding-inline)] after:shrink-0 after:content-['']"
          >
            {entries.map((entry, index) => (
              <div key={entry.id} className="w-[min(78vw,26rem)] shrink-0">
                <ExperienceCard entry={entry} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="section-inner mt-6">
          <ScrollTrace
            count={entries.length}
            fillRef={traceFillRef}
            registerNode={registerNode}
          />
        </div>
      </div>
    </div>
  );
}
