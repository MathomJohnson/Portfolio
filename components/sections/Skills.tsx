import { SectionShell } from "@/components/ui/SectionShell";
import { SkillGrid } from "@/components/ui/SkillGrid";
import { sectionIds, skillsContent } from "@/lib/content";

/**
 * Skills — columns dumped by TERMINAL_PRINT, left to right, one of the
 * page's three signature interactions. No scroll cue: the printing itself
 * already holds attention while the section is on screen.
 */
export function Skills() {
  return (
    <SectionShell
      id={sectionIds.skills}
      eyebrow={skillsContent.eyebrow}
      title={skillsContent.heading}
    >
      <SkillGrid categories={skillsContent.categories} />
    </SectionShell>
  );
}
