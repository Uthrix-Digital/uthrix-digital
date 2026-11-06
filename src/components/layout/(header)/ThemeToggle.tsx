"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

/**
 * Two-state light/dark switch. Both icons are always rendered and CSS (the
 * `dark:` variant) decides which is visible, so the right one shows on first
 * paint and the swap animates smoothly. Clicking plays the same curtain as
 * page navigation (src/lib/curtain.ts), swapping the theme while it covers.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Toggle light and dark mode"
      onClick={() => toggleTheme()}
      className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/20 text-foreground transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Sun
        aria-hidden="true"
        className="absolute size-4 rotate-90 scale-0 opacity-0 transition-[transform,opacity] duration-500 dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
      <Moon
        aria-hidden="true"
        className="absolute size-4 rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-500 dark:-rotate-90 dark:scale-0 dark:opacity-0"
      />
    </button>
  );
}
