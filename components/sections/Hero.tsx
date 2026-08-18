import Image from "next/image";
import { AuraFollow } from "@/components/motion/AuraFollow";
import { DecodeText } from "@/components/motion/DecodeText";
import { MagneticWrap } from "@/components/motion/MagneticWrap";
import { SignalReveal } from "@/components/motion/SignalReveal";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";
import { SocialLinks } from "@/components/ui/SocialLinks";
import {
  heroContent,
  heroPhoto,
  sectionIds,
  socialLinks,
} from "@/lib/content";
import { motionTokens } from "@/lib/motion-tokens";

/**
 * Hero — circular headshot beside the name, subtitle, resume button and social
 * row. Stacks to a single column with the photo above the text below 768px.
 *
 * Centring this row is fussier than it looks. A full-width row with a
 * content-sized copy column still leaves the photo hard against the left edge:
 * the copy column is handed all the leftover width, the name wraps inside it,
 * and the resulting box stays far wider than the text actually drawn in it. The
 * midpoint of the boxes then lands on the page centre while the midpoint of the
 * visible ink sits well to the left, which is exactly the mismatch you notice
 * against the centred scroll cue.
 *
 * So the row is `w-fit` and the copy column is `w-fit`, and the name is
 * `w-min`. Sizing the name to its longest word is what lets the column collapse
 * onto its widest real line instead of onto the space it was offered, so the
 * box the row centres is the ink.
 *
 * The subtitle's DECODE_TEXT starts after the name's SIGNAL_REVEAL has resolved.
 */
export function Hero() {
  return (
    <SectionShell id={sectionIds.hero} cueTargetId={sectionIds.about}>
      <div className="flex flex-col items-center gap-12 md:mx-auto md:w-fit md:flex-row md:gap-10 lg:gap-14">
        <AuraFollow className="shrink-0">
          <div className="relative aspect-square w-[clamp(11rem,26vw,16rem)] overflow-hidden rounded-full">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              sizes="(max-width: 768px) 60vw, 16rem"
              className="object-cover"
              priority
            />
          </div>
        </AuraFollow>

        <div className="flex min-w-0 flex-col items-center text-center md:w-fit md:items-start md:text-left">
          <SignalReveal as="h1" trigger="mount" className="display-xl md:w-min">
            {heroContent.name}
          </SignalReveal>

          <DecodeText
            as="p"
            text={heroContent.subtitle}
            trigger="mount"
            delay={motionTokens.durationReveal * 0.7}
            className="mono-label mt-5 text-[0.9375rem] text-secondary"
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 md:justify-start">
            <MagneticWrap>
              <Button href={heroContent.resume.href} external>
                {heroContent.resume.label}
              </Button>
            </MagneticWrap>

            <SocialLinks links={socialLinks} label="Social links" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
