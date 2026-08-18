"use client";

import Image from "next/image";
import { useState } from "react";
import { FadeUp } from "@/components/motion/FadeUp";
import { SignalReveal } from "@/components/motion/SignalReveal";
import { TagStagger } from "@/components/motion/TagStagger";
import { TiltCard } from "@/components/motion/TiltCard";
import type { ExperienceEntry } from "@/lib/content";
import { motionTokens } from "@/lib/motion-tokens";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  /** Position in the list, used to offset the card's reveals. */
  index: number;
  /**
   * Enables the hover-only affordances (TILT_3D and TAG_STAGGER). The vertical
   * mobile layout passes false so its cards stay flat and its tags stay visible.
   */
  interactive?: boolean;
}

const statusLabels = {
  upcoming: "Upcoming",
  present: "Present",
} as const;

/**
 * A single experience entry. Beyond the scrubbed sequence it has a second mode:
 * pausing on a card and exploring it directly via TILT_3D and TAG_STAGGER.
 *
 * Hover state is tracked here rather than in TagStagger so the tilt surface and
 * the tag cascade respond to the same pointer target. Focus inside the card also
 * reveals the tags, so keyboard users are not left with an empty tag row.
 */
export function ExperienceCard({
  entry,
  index,
  interactive = true,
}: ExperienceCardProps) {
  const [active, setActive] = useState(false);

  return (
    <TiltCard enabled={interactive} className="h-full">
      <article
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="flex h-full flex-col rounded-xl border border-hairline bg-surface p-7 transition-tint hover:border-hairline-strong md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mono-label flex flex-wrap items-center gap-3">
              <span>{entry.dateRange}</span>
              {entry.status && (
                <span className="rounded-full border border-signal-dim px-2 py-0.5 text-[0.625rem] text-signal">
                  {statusLabels[entry.status]}
                </span>
              )}
            </p>

            <SignalReveal
              as="h3"
              delay={index * motionTokens.staggerBase}
              className="mt-4 font-display text-2xl text-primary"
            >
              {entry.organization}
            </SignalReveal>
          </div>

          <Image
            src={entry.logo.src}
            alt={entry.logo.alt}
            width={40}
            height={40}
            unoptimized={entry.logo.src.endsWith(".svg")}
            className="mt-0.5 size-10 shrink-0 rounded-lg"
          />
        </div>

        <SignalReveal
          as="p"
          delay={index * motionTokens.staggerBase + motionTokens.staggerBase}
          className="mt-2 text-secondary"
        >
          {entry.role}
        </SignalReveal>

        <ul className="mt-6 space-y-3 text-[0.9375rem]">
          {entry.bullets.map((bullet, bulletIndex) => (
            <FadeUp
              as="li"
              key={bullet}
              staggerIndex={bulletIndex}
              className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1 before:rounded-full before:bg-signal-dim"
            >
              {bullet}
            </FadeUp>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <TagStagger
            tags={entry.tags}
            active={active || !interactive}
            label={`${entry.organization} tech stack`}
          />
        </div>
      </article>
    </TiltCard>
  );
}
