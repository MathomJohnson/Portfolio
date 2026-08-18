"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionTokens } from "@/lib/motion-tokens";

interface TerminalPrintProps {
  /** Argument to `cat` in the prompt: `$ cat <filename>`. */
  filename: string;
  /** Human-readable category name, exposed to assistive technology. */
  label: string;
  lines: string[];
  /** True once this column's turn in the sequence has come. */
  active: boolean;
  /** Delay before typing starts, used to space columns apart. */
  startDelayMs?: number;
  /** Keeps the blinking cursor after the last line, for the final column. */
  idleCursor?: boolean;
  onComplete?: () => void;
}

/**
 * TERMINAL_PRINT — a shell prompt types itself out character by character, then
 * the lines beneath it print one at a time, as `cat` would dump a file.
 *
 * Individual skills print as whole lines rather than character by character:
 * typing every character of a long column would take long enough to read as a
 * loading state instead of output.
 *
 * The real content is duplicated into a screen-reader-only heading and list, and
 * the printed version is aria-hidden — the same split DecodeText uses, so
 * assistive technology never sees a half-finished column. Unprinted lines and
 * untyped prompt characters are hidden with `visibility`, not unmounted, so
 * the column reserves its full height and width from the start. Without that
 * width, a centered or right-packed column grows as `$ cat …` types and the
 * already-printed characters shift left.
 *
 * Under reduced motion the finished dump renders immediately and the sequence
 * hands off to the next column in the same frame.
 */
export function TerminalPrint({
  filename,
  label,
  lines,
  active,
  startDelayMs = 0,
  idleCursor = false,
  onComplete,
}: TerminalPrintProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [typedCount, setTypedCount] = useState(0);
  const [printedCount, setPrintedCount] = useState(0);

  // Held in a ref so a new callback identity from the parent cannot restart a
  // print that is already running.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const prompt = `$ cat ${filename}`;
  const promptLength = prompt.length;
  const lineCount = lines.length;

  useEffect(() => {
    if (!active) return;

    if (prefersReducedMotion) {
      setTypedCount(promptLength);
      setPrintedCount(lineCount);
      onCompleteRef.current?.();
      return;
    }

    let typed = 0;
    let printed = 0;
    let timer: ReturnType<typeof setTimeout>;

    const printLine = () => {
      printed += 1;
      setPrintedCount(printed);

      if (printed < lineCount) {
        timer = setTimeout(printLine, motionTokens.terminalLineMs);
      } else {
        onCompleteRef.current?.();
      }
    };

    const typeCharacter = () => {
      typed += 1;
      setTypedCount(typed);

      timer = setTimeout(
        typed < promptLength ? typeCharacter : printLine,
        typed < promptLength
          ? motionTokens.terminalCharMs
          : motionTokens.terminalLineMs,
      );
    };

    timer = setTimeout(typeCharacter, startDelayMs);
    return () => clearTimeout(timer);
  }, [active, lineCount, prefersReducedMotion, promptLength, startDelayMs]);

  const promptComplete = typedCount === promptLength;
  const printComplete = printedCount === lineCount;

  // The cursor stays parked at the end of the prompt until the first line lands,
  // then rides the most recently printed line down the column.
  const cursorOnPrompt = active && (!promptComplete || printedCount === 0);
  const cursorLine =
    active && !cursorOnPrompt && (!printComplete || idleCursor)
      ? printedCount - 1
      : null;

  return (
    <div>
      <h3 className="sr-only">{label}</h3>
      <ul className="sr-only">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        data-terminal-column={filename}
        className="font-mono text-[0.8125rem]"
      >
        <p className="min-h-7 leading-7 whitespace-pre">
          <span className={typedCount > 0 ? "text-signal" : "invisible"}>
            {prompt.slice(0, 1)}
          </span>
          <span className="text-primary">{prompt.slice(1, typedCount)}</span>
          {cursorOnPrompt ? (
            <span className="terminal-cursor" />
          ) : (
            <span className="terminal-cursor invisible" />
          )}
          <span className="invisible">
            {prompt.slice(Math.max(typedCount, 1))}
          </span>
        </p>

        <ul className="mt-1">
          {lines.map((line, index) => (
            <li
              key={line}
              className={`leading-7 text-secondary ${
                index < printedCount ? "" : "invisible"
              }`}
            >
              {line}
              {cursorLine === index && <span className="terminal-cursor" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
