"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_TICKER } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Built for clinics / salons / lawyers…", cycling every couple of seconds.
 * Screen readers get the whole list once instead of a moving word.
 */
export function HeroTicker() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % HERO_TICKER.length),
      2200,
    );
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <p className="flex flex-wrap items-baseline gap-x-3 text-[clamp(1.25rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">
      <span className="text-foreground/60">Built for</span>
      <span className="sr-only">{HERO_TICKER.join(", ")} and every other service business.</span>
      <span
        aria-hidden="true"
        className="relative inline-flex h-[1.3em] min-w-[12ch] overflow-hidden align-bottom"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={HERO_TICKER[index]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="whitespace-nowrap text-brand-text underline decoration-2 underline-offset-[0.2em]"
          >
            {HERO_TICKER[index]}.
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
