import type { ReactNode } from "react";
import { ScrollCue } from "@/components/motion/ScrollCue";
import { SignalReveal } from "@/components/motion/SignalReveal";

interface SectionShellProps {
  id: string;
  /** Mono/amber category label above the heading. */
  eyebrow?: string;
  /** Section heading, rendered as an h2 with SIGNAL_REVEAL. */
  title?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /**
   * Id of the following section. When set, a SCROLL_CUE is rendered at the
   * bottom of the section and dismissed once that section enters view.
   */
  cueTargetId?: string;
}

/**
 * Shared section scaffolding: full-viewport svh block, safe padding, width
 * constraint, and optional heading plus scroll cue.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className = "",
  innerClassName = "",
  cueTargetId,
}: SectionShellProps) {
  const headingId = title ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-shell ${className}`}
    >
      <div className={`section-inner ${innerClassName}`}>
        {(eyebrow || title) && (
          <header className="mb-10 md:mb-14">
            {eyebrow && <p className="mono-label text-signal">{eyebrow}</p>}
            {title && (
              <SignalReveal as="h2" id={headingId} className="display-l mt-4">
                {title}
              </SignalReveal>
            )}
          </header>
        )}
        {children}
      </div>
      {cueTargetId && <ScrollCue targetId={cueTargetId} />}
    </section>
  );
}
