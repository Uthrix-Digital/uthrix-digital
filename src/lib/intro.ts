/**
 * Intro splash rules shared by the inline pre-paint script (root layout) and
 * the client IntroController. Keep both readers in sync through this file.
 *
 * The splash covers the whole page, so it only plays for returning visitors:
 * a first visit (and every Lighthouse/PageSpeed run, which starts with empty
 * storage) goes straight to the content. It plays at most once per session.
 */

/** localStorage: set on the first visit, marks the visitor as returning. */
export const VISITED_STORAGE_KEY = "uthrix-visited";

/** sessionStorage: set once the splash has played (or been skipped). */
export const INTRO_SEEN_STORAGE_KEY = "introSeen";

/**
 * Runs synchronously in <head> before first paint. Sets
 * `data-intro="playing"` on <html> only for a returning visitor who hasn't
 * seen the splash this session; without that attribute the overlay stays
 * hidden (see #intro-overlay in globals.css). Storage can throw in privacy
 * modes, in which case the splash is simply skipped.
 */
export const introInitScript = `(function(){try{var l=localStorage,s=sessionStorage,v=${JSON.stringify(
  VISITED_STORAGE_KEY,
)},k=${JSON.stringify(
  INTRO_SEEN_STORAGE_KEY,
)};if(l.getItem(v)&&!s.getItem(k)&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-intro","playing")}else{s.setItem(k,"1")}l.setItem(v,"1")}catch(e){}})()`;
