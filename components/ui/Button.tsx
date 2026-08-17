import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "ghost";
  /** Marks the link as a file download (used for the resume). */
  download?: boolean;
  external?: boolean;
  className?: string;
}

const baseClasses =
  "group relative inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-mono text-mono-label uppercase tracking-[0.08em] transition-tint";

const variantClasses = {
  primary:
    "border border-hairline-strong bg-surface text-primary hover:border-signal-dim hover:bg-surface-raised",
  ghost: "border border-hairline text-secondary hover:border-signal-dim hover:text-primary",
} as const;

/**
 * Anchor-styled call to action. Intentionally carries no motion of its own so
 * callers opt into MAGNETIC_PULL explicitly by wrapping it in MagneticWrap.
 * The hover glow uses --accent-signal-soft.
 */
export function Button({
  href,
  children,
  icon,
  variant = "primary",
  download = false,
  external = false,
  className = "",
}: ButtonProps) {
  return (
    <a
      href={href}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          boxShadow: "0 0 32px 4px var(--accent-signal-soft)",
          background:
            "radial-gradient(circle at center, var(--accent-signal-soft), transparent 70%)",
        }}
      />
      <span className="relative">{children}</span>
      {icon && (
        <span
          aria-hidden="true"
          className="relative text-tertiary transition-tint group-hover:text-signal"
        >
          {icon}
        </span>
      )}
    </a>
  );
}
