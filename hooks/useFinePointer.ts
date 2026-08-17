"use client";

import { useEffect, useState } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * True only on devices with a precise, hovering pointer. Gates CURSOR_TRACE,
 * MAGNETIC_PULL, SPOTLIGHT_FIELD, TILT_3D and interactive TAG_STAGGER so those
 * affordances are absent on touch rather than degraded.
 *
 * Starts false so server output and the first client render match; pointer-only
 * behaviour attaches after hydration.
 */
export function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER_QUERY);
    const update = () => setIsFinePointer(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isFinePointer;
}
