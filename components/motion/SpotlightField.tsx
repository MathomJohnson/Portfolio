"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";

interface SpotlightFieldProps {
  children: ReactNode;
  /** Radius in pixels over which items brighten toward the cursor. */
  radius?: number;
  className?: string;
}

/**
 * SPOTLIGHT_FIELD — a radial gradient follows the cursor via the --x/--y custom
 * properties, and items marked with data-spotlight-item brighten as the cursor
 * approaches them via a --proximity custom property.
 *
 * Everything is written directly to inline styles inside one rAF-throttled
 * handler, so this never causes a React render. Item rects are measured once per
 * pointer entry and on resize rather than every frame. Pointer-fine only; on
 * touch the grid renders in its unlit resting state.
 */
export function SpotlightField({
  children,
  radius = 260,
  className = "",
}: SpotlightFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useFinePointer();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isFinePointer) return;

    let items: HTMLElement[] = [];
    let centers: { x: number; y: number }[] = [];
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const measure = () => {
      items = Array.from(
        container.querySelectorAll<HTMLElement>("[data-spotlight-item]"),
      );
      const containerRect = container.getBoundingClientRect();
      centers = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });
    };

    const paint = () => {
      frame = 0;
      container.style.setProperty("--x", `${pointerX}px`);
      container.style.setProperty("--y", `${pointerY}px`);

      for (let index = 0; index < items.length; index += 1) {
        const center = centers[index];
        const distance = Math.hypot(pointerX - center.x, pointerY - center.y);
        const proximity = Math.max(0, 1 - distance / radius);
        items[index].style.setProperty("--proximity", proximity.toFixed(3));
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const handlePointerEnter = () => {
      measure();
      container.style.setProperty("--spotlight-opacity", "1");
    };

    const handlePointerLeave = () => {
      container.style.setProperty("--spotlight-opacity", "0");
      for (const item of items) item.style.setProperty("--proximity", "0");
    };

    measure();
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    container.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", measure);

    return () => {
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
      handlePointerLeave();
    };
  }, [isFinePointer, radius]);

  return (
    <div ref={containerRef} className={`spotlight-field ${className}`}>
      {children}
    </div>
  );
}
