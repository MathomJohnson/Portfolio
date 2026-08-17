/**
 * Shared motion constants. Every animated component imports timing, easing and
 * spring values from here so the whole page reads as one motion system.
 * Named animations and their intended effects are documented in DESIGN.md.
 */

type CubicBezier = [number, number, number, number];

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

interface MotionTokens {
  easeSignal: CubicBezier;
  springMagnetic: SpringConfig;
  springHover: SpringConfig;
  durationReveal: number;
  durationMicro: number;
  staggerBase: number;
}

export const motionTokens: MotionTokens = {
  easeSignal: [0.16, 1, 0.3, 1],
  springMagnetic: { stiffness: 150, damping: 15, mass: 0.8 },
  springHover: { stiffness: 300, damping: 20 },
  durationReveal: 0.8,
  durationMicro: 0.2,
  staggerBase: 0.06,
};

/** Default transition for reveals (SIGNAL_REVEAL, FADE_UP, WIPE_MASK). */
export function revealTransition(delay = 0) {
  return {
    duration: motionTokens.durationReveal,
    ease: motionTokens.easeSignal,
    delay,
  } as const;
}

/** Short transition for hover and other micro-interactions. */
export function microTransition(delay = 0) {
  return {
    duration: motionTokens.durationMicro,
    ease: motionTokens.easeSignal,
    delay,
  } as const;
}

/** Spring for MAGNETIC_PULL and other cursor-proximity displacement. */
export const magneticSpring = {
  type: "spring" as const,
  ...motionTokens.springMagnetic,
};

/** Spring for WAVE_HOVER, TILT_3D and other hover state changes. */
export const hoverSpring = {
  type: "spring" as const,
  ...motionTokens.springHover,
};

/** Per-index delay for staggered groups (TAG_STAGGER, FADE_UP, ICON_LIFT). */
export function staggerDelay(index: number, base = motionTokens.staggerBase) {
  return index * base;
}

/**
 * Instant transition used as the reduced-motion resolution for any animation
 * that would otherwise move an element.
 */
export const instantTransition = { duration: 0 } as const;

/** Viewport config shared by scroll-into-view reveals. */
export const revealViewport = { once: true, amount: 0.35 } as const;
