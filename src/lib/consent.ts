import { z } from "zod";

/**
 * Cookie consent shared by the ConsentProvider, the banner, the inline Google
 * Consent Mode script and the tracking scripts. Only non-essential storage
 * needs consent; the theme preference is strictly necessary and is not
 * covered here.
 */

export const CONSENT_STORAGE_KEY = "cookie-consent";

/**
 * Bump when the set of tracking tools changes, so every visitor is asked again.
 * v2: Google Tag Manager added alongside the Meta Pixel.
 */
export const CONSENT_VERSION = 2;

/**
 * Names (or name prefixes) of the non-essential cookies set by our tools.
 * Removed when consent is withdrawn.
 * Meta Pixel: _fbp, _fbc. Google: _ga, _ga_<id>, _gid, _gcl_au and friends.
 */
export const TRACKING_COOKIE_PREFIXES = ["_fbp", "_fbc", "_ga", "_gid", "_gcl"] as const;

const consentSchema = z.object({
  version: z.literal(CONSENT_VERSION),
  /** Measurement tools such as Google Analytics (via Google Tag Manager). */
  analytics: z.boolean(),
  /** Advertising tools such as the Meta Pixel and Google Ads. */
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

type ConsentFlag = "granted" | "denied";

/** Google Consent Mode v2 signals for a given choice. */
export function googleConsentState(choice: Pick<Consent, "analytics" | "marketing">) {
  const flag = (on: boolean): ConsentFlag => (on ? "granted" : "denied");
  return {
    analytics_storage: flag(choice.analytics),
    ad_storage: flag(choice.marketing),
    ad_user_data: flag(choice.marketing),
    ad_personalization: flag(choice.marketing),
  };
}

/**
 * Runs synchronously in <head>, before gtm.js loads. Creates the dataLayer and
 * gtag(), sets every Google consent signal to "denied" by default, then applies
 * a returning visitor's saved choice so their first page view is measured.
 * Google tags inside GTM read these signals and stay cookieless until granted.
 */
export const googleConsentInitScript = `(function(){window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",wait_for_update:500});try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(
  CONSENT_STORAGE_KEY,
)}));if(c&&c.version===${CONSENT_VERSION}){var a=c.analytics?"granted":"denied",m=c.marketing?"granted":"denied";gtag("consent","update",{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m})}}catch(e){}gtag("js",new Date())})()`;
