"use client";

import { useContext } from "react";
import {
  ThemeContext,
  type ThemeContextValue,
} from "@/components/shared/ThemeProvider";

/**
 * Read and change the site theme. Must be used inside <ThemeProvider>.
 *
 * For purely visual differences prefer the `dark:` variant or semantic colour
 * tokens over branching on `resolvedTheme` — CSS is correct on first paint,
 * whereas `resolvedTheme` is `undefined` until hydration.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within <ThemeProvider>.");
  }
  return context;
}
