import Image from "next/image";
import { DecodeText } from "@/components/motion/DecodeText";
import { MagneticWrap } from "@/components/motion/MagneticWrap";
import { OrbitRing } from "@/components/motion/OrbitRing";
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
 * The subtitle's DECODE_TEXT starts after the name's SIGNAL_REVEAL has resolved.
 */
export function Hero() {
  return (
    <SectionShell id={sectionIds.hero} cueTargetId={sectionIds.about}>
      <div className="grid items-center gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-16">
        <MagneticWrap className="justify-self-center md:justify-self-start">
          <OrbitRing>
            <div className="relative aspect-square w-[clamp(11rem,26vw,16rem)] overflow-hidden rounded-full border border-hairline-strong">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                fill
                sizes="(max-width: 768px) 60vw, 16rem"
                className="object-cover"
                priority
              />
            </div>
          </OrbitRing>
        </MagneticWrap>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <SignalReveal as="h1" trigger="mount" className="display-xl">
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
              <Button href={heroContent.resume.href} download>
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
