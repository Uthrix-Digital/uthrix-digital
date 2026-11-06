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

/** Viewport point the theme-change reveal grows from (the toggle button). */
export interface RevealOrigin {
  x: number;
  y: number;
}

export interface ThemeContextValue {
  /** Saved choice. Stays "system" until the visitor first uses the toggle. */
  theme: ThemePreference;
  /** What is actually shown. `undefined` during SSR / before hydration. */
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: ThemePreference, origin?: RevealOrigin) => void;
  /** Flip light <-> dark. Pass an origin to get the circular reveal. */
  toggleTheme: (origin?: RevealOrigin) => void;
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

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Swap themes. With an origin (and View Transitions + motion allowed) the new
 * theme is revealed as a circle growing from that point; otherwise it swaps
 * instantly.
 */
function swapTheme(target: ResolvedTheme, origin?: RevealOrigin) {
  const root = document.documentElement;
  const canReveal =
    origin &&
    typeof document.startViewTransition === "function" &&
    !prefersReducedMotion() &&
    currentTheme() !== target;

  const release = pauseTransitions();

  if (!canReveal) {
    applyTheme(target);
    window.setTimeout(release, 1);
    return;
  }

  const transition = document.startViewTransition(() => {
    applyTheme(target);
  });

  transition.ready
    .then(() => {
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      // Transition was skipped (e.g. tab hidden): the swap already happened.
    });

  transition.finished.finally(release);
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

  const setTheme = useCallback(
    (next: ThemePreference, origin?: RevealOrigin) => {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage unavailable: the choice still applies for this page view.
      }
      swapTheme(next === "system" ? readSystemTheme() : next, origin);
      emit();
    },
    [],
  );

  const toggleTheme = useCallback(
    (origin?: RevealOrigin) => {
      setTheme(currentTheme() === "dark" ? "light" : "dark", origin);
    },
    [setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
