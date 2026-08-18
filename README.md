# Portfolio

Single-page personal portfolio: five full-viewport sections (Hero, About,
Skills, Experience, Contact), statically generated and deployed on Vercel.

Design tokens and the motion vocabulary are documented in
[DESIGN.md](DESIGN.md), which is the reference for any future work on this site.
`.cursor/rules/motion.mdc` encodes the same rules for AI-assisted edits.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript, statically rendered |
| Styling | Tailwind CSS v4, design tokens as CSS custom properties |
| Component motion | `motion` (Motion for React) |
| Scroll-linked motion | GSAP + ScrollTrigger (Experience pin and trace only) |
| Smooth scroll | Lenis, synchronised with ScrollTrigger |
| Icons | `lucide-react`, plus inline stroke glyphs for LinkedIn and GitHub |
| Fonts | Space Grotesk, JetBrains Mono (Google), General Sans (self-hosted) |

There is no backend, database, or form handler: the contact action is a
`mailto:` link.

## Commands

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test:e2e   # Playwright, across desktop / mobile / reduced-motion
```

The Playwright config starts the production server itself, so run `npm run
build` before `npm run test:e2e`.

## Project layout

```
app/                  layout (fonts, metadata, providers), page, global tokens
components/sections/   the five sections, plus the two Experience layouts
components/motion/     named motion vocabulary primitives
components/ui/         Button, SocialLinks, SectionShell, SkillGrid, InterestRow
components/providers/  reduced-motion policy, Lenis/GSAP sync, cursor mount
hooks/                 pointer capability, motion preference, Experience scroll
lib/content.ts         all copy and data, typed
lib/motion-tokens.ts   shared easing, springs, durations, stagger
tests/e2e/             Playwright specs and the screenshot capture pass
```

## Accessibility and motion behaviour

- `prefers-reduced-motion: reduce` disables smooth scroll, the custom cursor, the
  Experience pin, parallax, scramble, the Skills terminal print, and every
  decorative transform. Content resolves to a plain opacity fade or its static
  end state.
- The custom cursor, magnetic pull, 3D tilt, and the hover tag cascade mount only
  for `(hover: hover) and (pointer: fine)`. Touch devices get complete static
  content rather than a degraded effect. The Skills terminal print is the
  exception among the signature effects: it is scroll-triggered, so it runs
  everywhere.
- Experience has two real layouts. The pinned horizontal sequence renders only on
  wide, hovering, fine-pointer devices without a reduced-motion preference;
  everything else gets a vertical list. The CSS media query in `globals.css` and
  the `gsap.matchMedia` query in `hooks/useExperienceScroll.ts` must stay
  identical so the pinned markup is never shown without its scroll timeline.
- Fonts use `display: "block"` with preloading, which keeps measured CLS at 0.

## Dependency overrides

`package.json` pins `postcss` and `sharp` forward. Next.js 15.5.x depends on
older releases of both, which carry published advisories; they are build-time
only for a static site, but pinning keeps `npm audit` clean. These overrides can
be dropped once a Next.js patch ships the newer versions itself.

## Before shipping

Placeholder content is marked `[DRAFT]` in `lib/content.ts` and
`app/layout.tsx`. The images and resume in `public/` are generated placeholders
and must be replaced. See the outstanding items list in the project notes.
