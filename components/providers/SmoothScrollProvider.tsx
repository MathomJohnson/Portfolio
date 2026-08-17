"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll, synchronised with GSAP ScrollTrigger.
 *
 * The synchronisation is the important part: Lenis interpolates the scroll
 * position, so ScrollTrigger must be updated from Lenis' scroll event and Lenis
 * must be advanced from GSAP's ticker. Without both halves the two libraries run
 * on separate clocks and scrubbed or pinned animations lag behind the page.
 *
 * Lenis wraps the native document scroll here rather than a custom scroll
 * container, so ScrollTrigger.scrollerProxy is deliberately not used: the
 * default scroller is still the window, which keeps pin measurements simple.
 *
 * Smooth scrolling is not started at all under prefers-reduced-motion; native
 * scrolling is left untouched.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis) return;

      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        orientation: "vertical",
        autoRaf: false,
      });

      lenis.on("scroll", ScrollTrigger.update);

      onTick = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (onTick) {
        gsap.ticker.remove(onTick);
        onTick = null;
      }
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      lenis = null;
    };

    const sync = () => {
      if (reducedMotionQuery.matches) stop();
      else start();
      ScrollTrigger.refresh();
    };

    sync();
    reducedMotionQuery.addEventListener("change", sync);

    // Fonts and images settle after first paint and change section heights, so
    // ScrollTrigger needs to re-measure once they land.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      reducedMotionQuery.removeEventListener("change", sync);
      window.removeEventListener("load", refresh);
      stop();
    };
  }, []);

  return <>{children}</>;
}
