"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  MARKETING_COOKIE_NAMES,
  parseConsent,
  type Consent,
} from "@/lib/consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export interface ConsentContextValue {
  /** The saved choice, or null while the visitor has not decided yet. */
  consent: Consent | null;
  /** True when the banner should be on screen. */
  bannerOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  /** Reopens the banner so the visitor can change their choice. */
  openSettings: () => void;
}

export const ConsentContext = createContext<ConsentContextValue | null>(null);

/* ── External store: the raw localStorage value ────────────────────────── */

const listeners = new Set<() => void>();

// Fallback for when localStorage is unavailable: the choice lasts for the page view.
let memoryValue: string | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep tabs in sync when the choice changes in another tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? memoryValue;
  } catch {
    return memoryValue;
  }
}

// `undefined` = not known yet (server render / before hydration): show nothing.
const getServerSnapshot = (): string | null | undefined => undefined;

function save(marketing: boolean) {
  const value: Consent = {
    version: CONSENT_VERSION,
    marketing,
    decidedAt: new Date().toISOString(),
  };
  memoryValue = JSON.stringify(value);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, memoryValue);
  } catch {
    // Storage unavailable: the in-memory value still applies for this page view.
  }
  listeners.forEach((listener) => listener());
}

function deleteMarketingCookies() {
  const host = window.location.hostname;
  const rootDomain = host.split(".").slice(-2).join(".");
  for (const name of MARKETING_COOKIE_NAMES) {
    for (const domain of ["", `; domain=${host}`, `; domain=.${rootDomain}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/* ── Provider ──────────────────────────────────────────────────────────── */

export function ConsentProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const consent = useMemo(() => parseConsent(raw), [raw]);
  const ready = raw !== undefined;

  const acceptAll = useCallback(() => {
    // If the pixel was loaded and then revoked earlier, switch it back on.
    window.fbq?.("consent", "grant");
    save(true);
    setSettingsOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    // Stops an already-loaded pixel from sending anything further.
    window.fbq?.("consent", "revoke");
    deleteMarketingCookies();
    save(false);
    setSettingsOpen(false);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      bannerOpen: ready && (consent === null || settingsOpen),
      acceptAll,
      rejectAll,
      openSettings,
    }),
    [consent, ready, settingsOpen, acceptAll, rejectAll, openSettings],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}
