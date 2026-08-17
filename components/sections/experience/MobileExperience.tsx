import type { ExperienceEntry } from "@/lib/content";
import { ExperienceCard } from "./ExperienceCard";

interface MobileExperienceProps {
  entries: ExperienceEntry[];
  eyebrow: string;
  heading: string;
}

/**
 * The vertical presentation of the Experience section: a normal-flow stacked
 * list with a static trace down the left edge.
 *
 * This is a genuine alternative layout rather than a shrunken pin. It is what
 * touch devices, narrow viewports and reduced-motion visitors get, so the
 * content is never dependent on scroll-jacking to reach.
 */
export function MobileExperience({
  entries,
  eyebrow,
  heading,
}: MobileExperienceProps) {
  return (
    <div className="experience-mobile section-shell">
      <div className="section-inner">
        <header className="mb-10">
          <p className="mono-label text-signal">{eyebrow}</p>
          <h2 className="display-l mt-4">{heading}</h2>
        </header>

        <ol className="relative space-y-6 pl-8">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[3px] top-2 w-px bg-[var(--border-hairline)]"
          />

          {entries.map((entry, index) => (
            <li key={entry.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-8 top-8 size-2 rounded-full bg-signal-dim"
              />
              <ExperienceCard entry={entry} index={index} interactive={false} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
