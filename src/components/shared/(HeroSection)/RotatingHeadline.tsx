"use client";

import { useEffect, useState, type ReactNode } from "react";

// Each frame pairs what we deliver with who it's for.
const PAIRS = [
  { outcome: "Direct bookings", business: "boutique hotel" },
  { outcome: "Purchases", business: "online store" },
  { outcome: "Travel Enquiries", business: "tour company" },
  { outcome: "Showroom visits", business: "furniture store" },
  { outcome: "Qualified leads", business: "service business" },
] as const;

const ROTATE_MS = 3200;
// The business word follows the outcome word a beat later.
const BUSINESS_DELAY = "0.18s";

const lineClassBlack =
  "block whitespace-nowrap text-[10cqw] sm:text-[15cqw] leading-[0.78] tracking-[-0.07em] sm:-tracking-widest";

const lineClassGray =
  "block whitespace-nowrap text-chart-4 text-[10cqw] sm:text-[10.4cqw] leading-[0.78] tracking-[-0.07em] sm:-tracking-widest";

const lineClassRed =
  "block whitespace-nowrap text-brand text-[10cqw] sm:text-[10.4cqw] leading-[0.78] tracking-[-0.07em] sm:-tracking-widest";

function SlotWord({
  id,
  prevId,
  delay,
  children,
  prevChildren,
}: {
  id: number;
  prevId: number | null;
  delay?: string;
  children: ReactNode;
  prevChildren: ReactNode;
}) {
  const style = delay ? { animationDelay: delay } : undefined;
  return (
    // Grid stacking lets the outgoing and incoming words overlap while
    // sliding (.slot-in / .slot-out in globals.css). Keys change every tick
    // so both animations restart. The first word renders still.
    <span className="-my-[0.08em] grid overflow-hidden py-[0.08em]">
      {prevId !== null && (
        <span key={`out-${prevId}`} className="slot-out [grid-area:1/1]" style={style}>
          {prevChildren}
        </span>
      )}
      <span
        key={`in-${id}`}
        className={`[grid-area:1/1]${prevId !== null ? " slot-in" : ""}`}
        style={prevId !== null ? style : undefined}
      >
        {children}
      </span>
    </span>
  );
}

export function RotatingHeadline() {
  const [{ index, prev }, setFrame] = useState<{ index: number; prev: number | null }>({
    index: 0,
    prev: null,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip ticks while the tab is hidden: animations pause there, so words
    // would otherwise jump on return.
    const id = setInterval(() => {
      if (document.hidden) return;
      setFrame(({ index: i }) => ({ index: (i + 1) % PAIRS.length, prev: i }));
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const pair = PAIRS[index];
  const prevPair = prev === null ? null : PAIRS[prev];

  return (
    <>
      <span className="sr-only">More customers for your business.</span>
      <span aria-hidden="true">
        <span className={lineClassBlack}>More</span>
        <span className={lineClassRed}>
          <SlotWord id={index} prevId={prev} prevChildren={prevPair?.outcome}>
            {pair.outcome}
          </SlotWord>
        </span>
        <span className={lineClassBlack}>For your</span>
        <span className={lineClassGray}>
          <SlotWord
            id={index}
            prevId={prev}
            delay={BUSINESS_DELAY}
            prevChildren={prevPair?.business}
          >
            {pair.business}
          </SlotWord>
        </span>
      </span>
    </>
  );
}
