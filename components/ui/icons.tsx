import { Code2, Landmark, Microscope, Sigma } from "lucide-react";
import type { InterestIconName, SocialIconName } from "@/lib/content";

type GlyphProps = {
  className?: string;
};

/**
 * lucide-react dropped brand marks in v1, so LinkedIn and GitHub are drawn here
 * as stroke glyphs on the same 24px grid and stroke weight as the lucide icons
 * they sit beside.
 */
function LinkedInGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4Z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function YouTubeGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10 9.5v5l5-2.5Z" />
    </svg>
  );
}

export const socialGlyphs: Record<
  SocialIconName,
  (props: GlyphProps) => React.ReactElement
> = {
  linkedin: LinkedInGlyph,
  github: GitHubGlyph,
  youtube: YouTubeGlyph,
};

export const interestGlyphs: Record<
  InterestIconName,
  (props: GlyphProps) => React.ReactElement
> = {
  sigma: ({ className }) => (
    <Sigma className={className} strokeWidth={1.5} aria-hidden="true" />
  ),
  microscope: ({ className }) => (
    <Microscope className={className} strokeWidth={1.5} aria-hidden="true" />
  ),
  code: ({ className }) => (
    <Code2 className={className} strokeWidth={1.5} aria-hidden="true" />
  ),
  landmark: ({ className }) => (
    <Landmark className={className} strokeWidth={1.5} aria-hidden="true" />
  ),
  tennis: ({ className }) => <TennisGlyph className={className} />,
};

function TennisGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M6.4 5.2c4.2 2.6 4.2 11 0 13.6" />
      <path d="M17.6 5.2c-4.2 2.6-4.2 11 0 13.6" />
    </svg>
  );
}
