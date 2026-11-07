"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
}

/** Fade-up wrapper used by the service page sections. */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: RevealProps) {
  const target = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      {...(immediate
        ? { animate: target }
        : { whileInView: target, viewport: { once: true, margin: "-10% 0px" } })}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
