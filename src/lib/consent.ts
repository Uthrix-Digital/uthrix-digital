import { z } from "zod";

/**
 * Cookie consent shared by the ConsentProvider, the banner and the tracking
 * scripts. Only non-essential storage needs consent; the theme preference is
 * strictly necessary and is not covered here.
 */

export const CONSENT_STORAGE_KEY = "cookie-consent";

/** Bump when the set of tracking tools changes, so every visitor is asked again. */
export const CONSENT_VERSION = 1;

/** Cookies set by the Meta Pixel; removed when consent is withdrawn. */
export const MARKETING_COOKIE_NAMES = ["_fbp", "_fbc"] as const;

const consentSchema = z.object({
  version: z.literal(CONSENT_VERSION),
  /** Advertising tools such as the Meta Pixel. */
  marketing: z.boolean(),
  /** ISO timestamp of when the visitor made the choice. */
  decidedAt: z.string(),
});

export type Consent = z.infer<typeof consentSchema>;

/** Returns the stored choice, or null when there is none (or it is outdated). */
export function parseConsent(raw: string | null | undefined): Consent | null {
  if (!raw) return null;
  try {
    const result = consentSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
