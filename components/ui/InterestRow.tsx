"use client";

import { useEffect, useRef, useState } from "react";
import { IconLift } from "@/components/motion/IconLift";
import { useFinePointer } from "@/hooks/useFinePointer";
import type { InterestItem } from "@/lib/content";
import { interestGlyphs } from "./icons";

interface InterestRowProps {
  items: InterestItem[];
  label: string;
}

const CAPTION_MS = 2500;

/**
 * The five interest icons below the About copy. Each item uses ICON_LIFT.
 *
 * Below `md` the icons sit in a 3-over-2 grid with no in-flow captions; a tap
 * opens one chip at a time. From `md` up they stay a horizontal row with hover
 * tooltips on fine pointers.
 */
export function InterestRow({ items, label }: InterestRowProps) {
  const finePointer = useFinePointer();
  const listRef = useRef<HTMLUListElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (finePointer || !openId) return;

    const timeout = window.setTimeout(() => setOpenId(null), CAPTION_MS);

    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node | null;
      if (node && listRef.current?.contains(node)) return;
      setOpenId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [finePointer, openId]);

  return (
    <div>
      <h3 className="mono-label">{label}</h3>
      <ul
        ref={listRef}
        className="mt-5 grid grid-cols-6 gap-x-4 gap-y-6 md:flex md:flex-wrap md:gap-x-8 md:gap-y-6"
      >
        {items.map((item, index) => {
          const Glyph = interestGlyphs[item.icon];

          return (
            <li
              key={item.id}
              className="col-span-2 flex justify-center [&:nth-child(4)]:col-start-2 [&:nth-child(5)]:col-start-4 md:col-auto"
            >
              <IconLift
                icon={<Glyph className="size-5" />}
                label={item.label}
                index={index}
                finePointer={finePointer}
                open={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
