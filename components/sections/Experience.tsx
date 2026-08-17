import { experienceContent, sectionIds } from "@/lib/content";
import { DesktopExperience } from "./experience/DesktopExperience";
import { MobileExperience } from "./experience/MobileExperience";

/**
 * Experience — the only section with two distinct layouts.
 *
 * Exactly one of the two is displayed at any time: CSS in globals.css shows the
 * pinned tree only under EXPERIENCE_PIN_QUERY and hides the other with
 * display: none, which also keeps the hidden tree out of the accessibility tree,
 * so the duplicated headings are never both exposed.
 */
export function Experience() {
  return (
    <section id={sectionIds.experience}>
      <DesktopExperience
        entries={experienceContent.entries}
        eyebrow={experienceContent.eyebrow}
        heading={experienceContent.heading}
      />
      <MobileExperience
        entries={experienceContent.entries}
        eyebrow={experienceContent.eyebrow}
        heading={experienceContent.heading}
      />
    </section>
  );
}
