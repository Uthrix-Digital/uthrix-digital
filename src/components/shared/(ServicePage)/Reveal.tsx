"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating in. */
  delay?: number;
  /**
   * Animate on mount instead of when scrolled into view. Used for above-the-
   * fold headings, so it only slides (never starts invisible): the text is
   * painted immediately and still counts toward a fast LCP.
   */
  immediate?: boolean;
}

/**
 * Fade-up wrapper used by the page sections. Pure CSS (see .reveal in
 * globals.css) plus an IntersectionObserver, so it ships no animation
 * library. Reduced-motion users get the content without movement.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  const style = delay
    ? immediate
      ? { animationDelay: `${delay}s` }
      : { transitionDelay: `${delay}s` }
    : undefined;

  return (
    <div
      ref={ref}
      data-shown={shown || undefined}
      className={`${immediate ? "reveal-immediate" : "reveal"}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
