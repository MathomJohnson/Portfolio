# Design System

The design tokens and motion vocabulary for this site. Tokens live in
`app/globals.css`; motion constants live in `lib/motion-tokens.ts`. Nothing
should hardcode an equivalent value instead of importing from those two files.

Tone: modern, sleek, dark, minimal, technically confident. The page should feel
engineered, not decorated — motion is signal and structure (traces, pulses,
precise reveals), not marketing flourish.

## Color

```css
--bg-void: #0A0A0B;              /* primary background, obsidian */
--bg-surface: #141416;           /* card/panel background */
--bg-surface-raised: #1C1C1F;    /* hover/active surface */

--text-primary: #F2F1ED;         /* warm off-white, not pure #FFF */
--text-secondary: #9A9A9F;       /* body copy, secondary emphasis */
--text-tertiary: #5C5C61;        /* captions, mono labels, low emphasis */

--accent-signal: #E8A33D;        /* signature warm amber — "phosphor" accent */
--accent-signal-soft: rgba(232, 163, 61, 0.14);  /* glow fields, cursor bloom */
--accent-signal-dim: #7A5726;    /* borders/dividers at low intensity */

--border-hairline: rgba(242, 241, 237, 0.08);
--border-hairline-strong: rgba(242, 241, 237, 0.16);
```

## Typography

| Role | Typeface | Usage |
|---|---|---|
| Display | Space Grotesk (variable, 400–700) | Name, section headings |
| Body | General Sans (Fontshare, self-hosted variable 200–700) | Paragraph copy |
| Mono | JetBrains Mono | Category eyebrows, skill tags, dates, nav labels, timestamps |

Type scale (desktop, `clamp()` for fluid scaling down to mobile):

- Display XL (hero name): `clamp(3rem, 8vw, 6.5rem)`
- Display L (section headers): `clamp(2rem, 5vw, 3.5rem)`
- Body L: `1.125rem`
- Body: `1rem`
- Mono label: `0.8125rem`, uppercase, `letter-spacing: 0.08em`

Fonts load through `next/font` with `display: "block"` and preloading, so there
is no layout shift and no fallback-to-real-font swap. Measured CLS is 0. The
tradeoff is that text waits for the font rather than painting in a fallback
first, which costs some Largest Contentful Paint time; the no-layout-shift
requirement was treated as the higher priority.

### Contrast note

`--text-tertiary` (#5C5C61) is 2.97:1 against `--bg-void`, below the 4.5:1
minimum for body and label text. The token value is unchanged, but mono labels
and skill/tech tags render at `--text-secondary` instead. `--text-tertiary`
remains in use for icons and hairline-level accents, where the 3:1 non-text
threshold applies — including the resting state of `ICON_LIFT`, whose specified
behaviour is a shift from `--text-tertiary` to `--accent-signal`.

## Spacing & Layout

8px base unit scale. In practice this means using even-numbered Tailwind spacing
utilities (`gap-2` = 8px, `gap-4` = 16px, `gap-6` = 24px), which all land on 8px
multiples.

Every section is `min-height: 100svh` (not `100vh` — `svh` avoids mobile browser
chrome jump issues), except the Experience section, which pins at `100svh` and
holds while its horizontal content scrubs. Section content sits inside a
safe-padding wrapper: `padding-block: min(10vh, 96px)` so nothing touches the
viewport edge on short screens. The `.section-shell` and `.section-inner`
classes in `app/globals.css` implement this.

## Motion tokens

```ts
export const motionTokens = {
  easeSignal: [0.16, 1, 0.3, 1],      // confident ease-out, default for reveals
  springMagnetic: { stiffness: 150, damping: 15, mass: 0.8 },
  springHover: { stiffness: 300, damping: 20 },
  durationReveal: 0.8,
  durationMicro: 0.2,
  durationDecode: 3.5,       // DECODE_TEXT, whole-string resolve time
  staggerBase: 0.06,
  terminalCharMs: 38,        // TERMINAL_PRINT, per typed prompt character
  terminalLineMs: 90,        // TERMINAL_PRINT, per printed line
  terminalColumnGapMs: 260,  // TERMINAL_PRINT, beat between columns
};
```

`TERMINAL_PRINT`'s values are in milliseconds because it is driven by timers
rather than by Motion transitions; everything else here is in seconds.

All components import these from `lib/motion-tokens.ts` rather than hardcoding
spring/easing values inline — this is what keeps every animation on the page
feeling like one coherent system instead of unrelated tricks.

## Motion Vocabulary

Named, reusable animations. Every animated element on the page maps to one of
these. Do not invent unnamed one-off effects.

| Name | Effect | Library | Trigger |
|---|---|---|---|
| `SIGNAL_REVEAL` | `clip-path: inset()` unmask, left to right | Motion | mount or scroll-into-view |
| `DECODE_TEXT` | Character-scramble resolving to real text, left-to-right wave | Custom (Motion for state) | mount or scroll-into-view |
| `CURSOR_TRACE` | Custom cursor: small dot + spring-lagged trailing ring, amber | Motion | site-wide, pointer devices only |
| `MAGNETIC_PULL` | Element shifts up to ~10px toward cursor within an 80px radius, springs back on leave | Motion | hover/proximity |
| `AURA_FOLLOW` | Layered blurred amber gradients behind an element, breathing on their own and leaning toward the cursor's side of the viewport; the element itself stays still | Motion + CSS | mount + pointer move, pointer devices only |
| `WAVE_HOVER` | Sibling group hover with per-index spring offset, producing a ripple across a row | Motion | hover |
| `TERMINAL_PRINT` | A shell prompt types itself out character by character, then the lines under it print a whole line at a time, as `cat` would dump a file. Columns run in sequence: each starts only once the previous one has finished | Custom (timers + CSS) | scroll-into-view |
| `SCROLL_TRACE` | A line whose fill/length is bound to scroll progress, with nodes that light up as they cross center-viewport | GSAP ScrollTrigger | scroll (scrubbed) |
| `HORIZONTAL_PIN` | Section pins at 100svh; vertical scroll input drives horizontal translateX through a row of cards | GSAP ScrollTrigger | scroll (scrubbed, pinned) |
| `TILT_3D` | Card tilts in 3D (`rotateX`/`rotateY`, max 3–6°) based on cursor position relative to card center, via CSS `perspective` | Motion | hover, pointer devices only |
| `TAG_STAGGER` | Tech-stack tags cascade in with a slight per-tag delay on card hover, rather than appearing all at once | Motion | hover |
| `SCROLL_CUE` | Small mono label + line, looping translateY/opacity pulse, fades out once next section enters view | Motion | mount, dismissed via `useInView` |
| `WIPE_MASK` | Diagonal or directional clip-path wipe reveal for images | Motion | scroll-into-view |
| `PARALLAX_DRIFT` | Image column translates vertically at a fraction of the scroll rate relative to its container, creating depth without 3D | Motion (`useScroll`/`useTransform`) | scroll (continuous, bound to section scroll progress) |
| `COUNT_UP` | Numeric value animates 0 → target | Motion (`animate`) | scroll-into-view |
| `FADE_UP` | Opacity fade plus 8px translateY rise, optional per-index stagger | Motion | mount or scroll-into-view |
| `ICON_LIFT` | Staggered entry, then on hover: 4px lift, color shift from `--text-tertiary` to `--accent-signal`, and a small label tooltip | Motion | mount + hover |

`FADE_UP` and `ICON_LIFT` name the quiet motion used for body copy, category
eyebrows, card bullets, and the About interest row. They exist so that every
animated element maps to a named entry.

`COUNT_UP` is defined for future numeric content; no element on the current page
uses it.

**Reduced motion**: every entry above has a `prefers-reduced-motion: reduce`
fallback that resolves to a simple opacity fade or the static end-state, no
exceptions. `CURSOR_TRACE` and `HORIZONTAL_PIN` are fully disabled (not just
simplified) under reduced motion.

**Touch devices**: `CURSOR_TRACE`, `MAGNETIC_PULL`, and `TILT_3D` are
pointer-only (`@media (hover: hover) and (pointer: fine)`) — gracefully absent
on touch, not degraded. `TAG_STAGGER` gets a touch fallback:
tags render statically, with no stagger, below the pointer-fine breakpoint,
since there's no hover state to trigger it.

`AURA_FOLLOW` splits the difference: the aura is part of the hero's composition
rather than an affordance, so it always renders. Only its cursor tracking and
shape breathing are gated, leaving touch and reduced-motion visitors the aura at
its resting position.

## Signature-moment budget

`CURSOR_TRACE`, `HORIZONTAL_PIN`/`SCROLL_TRACE`, and `TERMINAL_PRINT` are the
three memorable interactions on this page. Everything else (reveals, hovers,
wipes) stays quiet and consistent rather than competing for attention.

`TERMINAL_PRINT` is the one signature moment that is not pointer-gated: it is
driven by scroll position, so touch visitors get it in full rather than losing a
third of the page's character.

## Section motion map

| Section | Assignments |
|---|---|
| Hero | `AURA_FOLLOW` (headshot), `MAGNETIC_PULL` (resume button), `SIGNAL_REVEAL` (name), `DECODE_TEXT` (subtitle), `WAVE_HOVER` (social row), `SCROLL_CUE` |
| About | `PARALLAX_DRIFT` + `WIPE_MASK` (photo), `SIGNAL_REVEAL` (heading), `FADE_UP` (bio lines), `ICON_LIFT` (interest row), `SCROLL_CUE` |
| Skills | `TERMINAL_PRINT` (columns, left to right), `SIGNAL_REVEAL` (heading) |
| Experience | `HORIZONTAL_PIN`, `SCROLL_TRACE`, `SIGNAL_REVEAL` (role/title), `FADE_UP` (bullets), `TILT_3D` (card hover), `TAG_STAGGER` (tag rows) |
| Contact | `SIGNAL_REVEAL` (closing line), `MAGNETIC_PULL` (mailto + LinkedIn) |

## Accessibility non-negotiables

- `prefers-reduced-motion: reduce` strips all scroll-jacking, cursor-follow, and
  decorative motion — replaced with simple opacity fades only.
- Full keyboard navigability, visible focus rings in `--accent-signal`.
- The Experience section has a genuine non-scroll-jacked mobile layout, not a
  shrunken version of the desktop pin.
- No layout shift from font loading.
