"use client";

import { useConsent } from "@/hooks/useConsent";

/** Reopens the cookie banner so a visitor can change or withdraw their choice. */
export function CookieSettingsButton({ className }: { className?: string }) {
  const { openSettings } = useConsent();

  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie settings
    </button>
  );
}
