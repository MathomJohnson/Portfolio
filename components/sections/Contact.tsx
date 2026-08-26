import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { MagneticWrap } from "@/components/motion/MagneticWrap";
import { WipeMask } from "@/components/motion/WipeMask";
import { Button } from "@/components/ui/Button";
import { contactContent, sectionIds } from "@/lib/content";

/**
 * Contact — landscape photo with WIPE_MASK, mailto call to action, LinkedIn,
 * and a back-to-top control. No scroll cue: this is the last section.
 */
export function Contact() {
  return (
    <section
      id={sectionIds.contact}
      aria-labelledby="contact-heading"
      className="section-shell"
    >
      <div className="section-inner flex flex-col items-center text-center">
        <p className="mono-label text-signal">{contactContent.eyebrow}</p>

        <h2 id="contact-heading" className="sr-only">
          Contact
        </h2>

        <WipeMask className="mt-8 w-full max-w-4xl overflow-hidden rounded-lg border border-hairline">
          <Image
            src={contactContent.photo.src}
            alt={contactContent.photo.alt}
            width={contactContent.photo.width}
            height={contactContent.photo.height}
            sizes="(max-width: 768px) 90vw, 56rem"
            className="h-auto w-full object-cover"
          />
        </WipeMask>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <MagneticWrap>
            <Button href={contactContent.cta.href}>
              {contactContent.cta.label}
            </Button>
          </MagneticWrap>

          <MagneticWrap>
            <Button href={contactContent.linkedIn.href} variant="ghost" external>
              {contactContent.linkedIn.label}
            </Button>
          </MagneticWrap>
        </div>
      </div>

      <footer className="section-inner mt-20 flex flex-col items-center gap-6">
        <div className="hairline-top w-full max-w-md" />
        <a
          href={`#${sectionIds.hero}`}
          className="mono-label inline-flex items-center gap-2 text-secondary transition-tint hover:text-signal"
        >
          <ChevronUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Back to top
        </a>
      </footer>
    </section>
  );
}
