import { SpotlightField } from "@/components/motion/SpotlightField";
import { SectionShell } from "@/components/ui/SectionShell";
import { SkillGrid } from "@/components/ui/SkillGrid";
import { sectionIds, skillsContent } from "@/lib/content";

/**
 * Skills — categorised grid lit by SPOTLIGHT_FIELD, one of the page's three
 * signature interactions. No scroll cue: the grid's density already signals
 * there is more page below.
 */
export function Skills() {
  return (
    <SectionShell
      id={sectionIds.skills}
      eyebrow={skillsContent.eyebrow}
      title={skillsContent.heading}
    >
      <SpotlightField>
        <SkillGrid categories={skillsContent.categories} />
      </SpotlightField>
    </SectionShell>
  );
}
