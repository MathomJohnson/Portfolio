import { MagneticWrap } from "@/components/motion/MagneticWrap";
import { SignalReveal } from "@/components/motion/SignalReveal";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { contactContent, sectionIds, socialLinks } from "@/lib/content";

/**
 * Contact — centred closing line, mailto call to action, LinkedIn link, and a
 * footer social row that bookends Hero's. No scroll cue: this is the last
 * section.
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

        <SignalReveal
          as="h2"
          id="contact-heading"
          className="display-l mt-6 max-w-3xl"
        >
          {contactContent.closingLine}
        </SignalReveal>

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
        <SocialLinks links={socialLinks} label="Social links" size="footer" />
      </footer>
    </section>
  );
}
