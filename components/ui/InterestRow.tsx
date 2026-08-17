import { IconLift } from "@/components/motion/IconLift";
import type { InterestItem } from "@/lib/content";
import { interestGlyphs } from "./icons";

interface InterestRowProps {
  items: InterestItem[];
  label: string;
}

/** The five interest icons below the About copy. Each item uses ICON_LIFT. */
export function InterestRow({ items, label }: InterestRowProps) {
  return (
    <div>
      <h3 className="mono-label">{label}</h3>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-6 sm:gap-x-8">
        {items.map((item, index) => {
          const Glyph = interestGlyphs[item.icon];

          return (
            <li key={item.id}>
              <IconLift
                icon={<Glyph className="size-5" />}
                label={item.label}
                index={index}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
