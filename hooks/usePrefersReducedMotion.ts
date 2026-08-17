"use client";

import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Returns false until after mount, deliberately. Animation wrappers use this
 * value to pick their `initial` state, and the server cannot know the
 * preference: reading it during the first client render would make the first
 * render disagree with the server markup and force React to throw away the
 * hydrated tree. Resolving after mount keeps the markup identical and still
 * applies the preference before any of this content can be scrolled to.
 *
 * Responds to live preference changes.
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}
