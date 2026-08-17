import { FadeUp } from "@/components/motion/FadeUp";
import type { SkillCategory } from "@/lib/content";

interface SkillGridProps {
  categories: SkillCategory[];
}

/**
 * Categorised skill clusters. Individual skills carry no motion of their own:
 * they are lit by the section's SPOTLIGHT_FIELD, which reads their
 * data-spotlight-item attribute. Category eyebrows use FADE_UP.
 */
export function SkillGrid({ categories }: SkillGridProps) {
  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <div key={category.id}>
          <FadeUp as="h3" staggerIndex={index} className="mono-label text-signal">
            {category.label}
          </FadeUp>

          <ul className="mt-4 flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <li
                key={skill}
                data-spotlight-item
                className="rounded-full border border-hairline bg-surface px-3.5 py-2 font-mono text-[0.8125rem] text-secondary"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
