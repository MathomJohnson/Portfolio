"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Must stay identical to the .experience-desktop / .experience-mobile media
 * query in globals.css, so the pinned markup is only ever displayed when this
 * timeline is running.
 */
export const EXPERIENCE_PIN_QUERY =
  "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

interface UseExperienceScrollOptions {
  /** The 100svh frame that gets pinned. */
  pinRef: RefObject<HTMLDivElement | null>;
  /** The viewport clipping the horizontal track. */
  viewportRef: RefObject<HTMLDivElement | null>;
  /** The row of cards translated horizontally. */
  trackRef: RefObject<HTMLDivElement | null>;
  /** The SCROLL_TRACE fill. */
  traceFillRef: RefObject<HTMLSpanElement | null>;
  /** The thin progress bar shown in place of a scroll cue. */
  progressFillRef: RefObject<HTMLSpanElement | null>;
  /** The SCROLL_TRACE nodes, in order. */
  nodeRefs: RefObject<(HTMLSpanElement | null)[]>;
  count: number;
}

/**
 * Owns HORIZONTAL_PIN and SCROLL_TRACE for the Experience section.
 *
 * One scrubbed timeline drives everything — the horizontal translation, the
 * trace fill, the node states and the progress bar — so the visuals cannot drift
 * apart from the cards. The scroll distance is derived from the track's actual
 * overflow and recomputed on refresh, so it stays correct when fonts, images or
 * a resize change the track width.
 */
export function useExperienceScroll({
  pinRef,
  viewportRef,
  trackRef,
  traceFillRef,
  progressFillRef,
  nodeRefs,
  count,
}: UseExperienceScrollOptions) {
  useEffect(() => {
    const mediaQuery = gsap.matchMedia();

    mediaQuery.add(EXPERIENCE_PIN_QUERY, () => {
      const pin = pinRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!pin || !viewport || !track) return;

      const distance = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);

      let lastActive = -1;

      const setActiveNode = (progress: number) => {
        const active =
          count <= 1 ? 0 : Math.round(progress * (count - 1));
        if (active === lastActive) return;
        lastActive = active;

        const nodes = nodeRefs.current;
        if (!nodes) return;
        nodes.forEach((node, index) => {
          node?.setAttribute("data-active", String(index <= active));
        });
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActiveNode(self.progress),
          onRefresh: (self) => setActiveNode(self.progress),
        },
      });

      timeline.to(track, { x: () => -distance() }, 0);
      timeline.fromTo(traceFillRef.current, { scaleX: 0 }, { scaleX: 1 }, 0);
      timeline.fromTo(progressFillRef.current, { scaleX: 0 }, { scaleX: 1 }, 0);

      setActiveNode(0);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        gsap.set(track, { clearProps: "x" });
      };
    });

    return () => mediaQuery.revert();
  }, [
    count,
    nodeRefs,
    pinRef,
    progressFillRef,
    traceFillRef,
    trackRef,
    viewportRef,
  ]);
}
