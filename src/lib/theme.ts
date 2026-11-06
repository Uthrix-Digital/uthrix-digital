/**
 * Theme constants shared by the server layout (inline pre-paint script) and the
 * client ThemeProvider. Keep both readers in sync through this file.
 */

export const THEME_STORAGE_KEY = "theme";

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

/**
 * Runs synchronously in <head> while the HTML is parsed, before first paint:
 * reads the saved preference, resolves "system" via matchMedia, and sets
 * `data-theme` + `color-scheme` on <html> so there is no flash of the wrong
 * theme. Wrapped in try/catch because localStorage can throw (privacy modes).
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)}),t=p==="light"||p==="dark"?p:window.matchMedia(${JSON.stringify(
  DARK_MEDIA_QUERY,
)}).matches?"dark":"light";d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}})()`;
