"use client";

import type { RefObject } from "react";

interface ScrollTraceProps {
  /** Number of nodes to lay out evenly across the trace. */
  count: number;
  /** The amber fill whose scaleX is driven by scroll progress. */
  fillRef: RefObject<HTMLSpanElement | null>;
  /** Registers each node so the scroll hook can light it up. */
  registerNode: (index: number, element: HTMLSpanElement | null) => void;
  className?: string;
}

/**
 * SCROLL_TRACE — a hairline with an amber fill and one node per entry.
 *
 * Purely presentational: the fill's scaleX and each node's data-active state are
 * driven by the Experience section's single scrubbed GSAP timeline, so the trace
 * has no timeline of its own and cannot drift out of sync with the cards.
 */
export function ScrollTrace({
  count,
  fillRef,
  registerNode,
  className = "",
}: ScrollTraceProps) {
  return (
    <div aria-hidden="true" className={`relative h-px w-full ${className}`}>
      <span className="absolute inset-0 block bg-[var(--border-hairline)]" />
      <span
        ref={fillRef}
        className="absolute inset-0 block origin-left scale-x-0 bg-signal-dim"
      />

      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          data-trace-node
          ref={(element) => registerNode(index, element)}
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            left: count === 1 ? "50%" : `${(index / (count - 1)) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
