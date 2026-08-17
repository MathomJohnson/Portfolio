"use client";

import Image from "next/image";
import { useRef } from "react";
import { FadeUp } from "@/components/motion/FadeUp";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { ScrollCue } from "@/components/motion/ScrollCue";
import { SignalReveal } from "@/components/motion/SignalReveal";
import { WipeMask } from "@/components/motion/WipeMask";
import { InterestRow } from "@/components/ui/InterestRow";
import { aboutContent, sectionIds } from "@/lib/content";

/**
 * About — photo beside the bio copy, with the interest row underneath.
 *
 * This is a client component because PARALLAX_DRIFT is scoped to this section's
 * own scroll progress, which needs a ref to the section element. It deliberately
 * uses quiet motion (FADE_UP) for the copy so it does not compete with Hero or
 * Skills for attention.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id={sectionIds.about}
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="section-shell"
    >
      <div className="section-inner">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <ParallaxDrift sectionRef={sectionRef}>
            <WipeMask className="overflow-hidden rounded-lg border border-hairline">
              <Image
                src={aboutContent.photo.src}
                alt={aboutContent.photo.alt}
                width={aboutContent.photo.width}
                height={aboutContent.photo.height}
                sizes="(max-width: 768px) 90vw, 34vw"
                className="h-auto w-full object-cover"
              />
            </WipeMask>
          </ParallaxDrift>

          <div>
            <p className="mono-label text-signal">{aboutContent.eyebrow}</p>

            <SignalReveal
              as="h2"
              id="about-heading"
              className="display-l mt-4"
            >
              {aboutContent.heading}
            </SignalReveal>

            <div className="mt-8 space-y-5">
              {aboutContent.paragraphs.map((paragraph, index) => (
                <FadeUp as="p" key={index} staggerIndex={index} className="body-l">
                  {paragraph}
                </FadeUp>
              ))}
            </div>

            <div className="mt-12">
              <InterestRow items={aboutContent.interests} label="Interests" />
            </div>
          </div>
        </div>
      </div>

      <ScrollCue targetId={sectionIds.skills} />
    </section>
  );
}
