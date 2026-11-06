"use client";

import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DARK_MEDIA_QUERY,
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  isThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";
import { runCurtain } from "@/lib/curtain";

export interface ThemeContextValue {
  /** Saved choice. Stays "system" until the visitor first uses the toggle. */
  theme: ThemePreference;
  /** What is actually shown. `undefined` during SSR / before hydration. */
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: ThemePreference) => void;
  /** Flip light <-> dark behind the page-transition curtain. */
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ── External store: localStorage preference + OS colour scheme ────────── */

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(DARK_MEDIA_QUERY);
  // Keep tabs in sync when the preference changes in another tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) listener();
  };

  media.addEventListener("change", listener);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

function readSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

const getServerPreferenceSnapshot = (): ThemePreference =>
  DEFAULT_THEME_PREFERENCE;
const getServerSystemSnapshot = (): ResolvedTheme | undefined => undefined;

function currentTheme(): ResolvedTheme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * Disables CSS transitions while the theme variables swap, so colours change
 * in one step. The toggle itself is exempt so its icon can animate.
 * Returns a function that lifts the block.
 */
function pauseTransitions(): () => void {
  const style = document.createElement("style");
  style.textContent =
    "*:not([data-theme-toggle]):not([data-theme-toggle] *),*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  // Force a style recalc so the rule is live before the swap.
  void window.getComputedStyle(document.documentElement).colorScheme;
  return () => style.remove();
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

/* ── Provider ──────────────────────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    readPreference,
    getServerPreferenceSnapshot,
  );
  const systemTheme = useSyncExternalStore(
    subscribe,
    readSystemTheme,
    getServerSystemSnapshot,
  );

  const resolvedTheme: ResolvedTheme | undefined =
    theme === "system" ? systemTheme : theme;

  // The inline script already set the attribute before paint; this keeps it
  // correct afterwards (OS changes, other tabs) and restores it after React's
  // dev-only Strict Mode remount, which resets attributes on <html>.
  useLayoutEffect(() => {
    if (resolvedTheme && currentTheme() !== resolvedTheme) {
      applyTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((next: ThemePreference) => {
    const target = next === "system" ? readSystemTheme() : next;

    // The same curtain as page navigation covers the screen first; the theme
    // (and the saved preference, which React reads) only change once it is
    // fully covering, so nothing flashes before the wipe.
    void runCurtain(() => {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage unavailable: the choice still applies for this page view.
      }
      const release = pauseTransitions();
      applyTheme(target);
      emit();
      window.setTimeout(release, 50);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
