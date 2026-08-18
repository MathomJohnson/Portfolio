import { WaveHoverGroup } from "@/components/motion/WaveHoverGroup";
import type { SocialLink } from "@/lib/content";
import { socialGlyphs } from "./icons";

interface SocialLinksProps {
  links: SocialLink[];
  /** Accessible name for the list, e.g. "Social links". */
  label: string;
  size?: "hero" | "footer";
}

const glyphSizeClasses = {
  hero: "size-5",
  footer: "size-[1.125rem]",
} as const;

/**
 * Icon-only social row. Rendered through WaveHoverGroup so hovering one icon
 * ripples across its siblings (WAVE_HOVER). Used in Hero.
 *
 * Every target is 44px so touch devices get an adequate hit area.
 */
export function SocialLinks({ links, label, size = "hero" }: SocialLinksProps) {
  const items = links.map((link) => {
    const Glyph = socialGlyphs[link.icon];

    return {
      id: link.id,
      content: (
        <a
          href={link.href}
          aria-label={link.label}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer noopener" : undefined}
          className="flex size-11 items-center justify-center rounded-full border border-hairline text-tertiary transition-tint hover:border-signal-dim hover:text-signal focus-visible:text-signal"
        >
          <Glyph className={glyphSizeClasses[size]} />
        </a>
      ),
    };
  });

  return (
    <WaveHoverGroup
      items={items}
      label={label}
      className="flex items-center gap-2"
    />
  );
}
