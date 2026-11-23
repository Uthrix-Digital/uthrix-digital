/**
 * Google Tag Manager loader. gtm.js (~180 KiB, ~150 ms of main-thread work)
 * is kept off the critical path: it loads on the visitor's first interaction,
 * or a few seconds after the page has loaded, whichever comes first.
 *
 * The Consent Mode defaults (googleConsentInitScript in src/lib/consent.ts)
 * still run before first paint and create window.dataLayer, so anything
 * pushed before gtm.js arrives is queued and processed when it loads.
 * Like the previous plain <script src> tag, this does not push the snippet's
 * "gtm.js" start event, so the container fires exactly the same tags as before.
 */

/** Delay after the window load event before loading GTM without interaction. */
export const GTM_IDLE_DELAY_MS = 4000;

const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

export function gtmLoaderScript(gtmId: string) {
  return `(function(){var done=false,ev=${JSON.stringify(
    INTERACTION_EVENTS,
  )};function load(){if(done)return;done=true;ev.forEach(function(e){removeEventListener(e,load,{passive:true})});var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtm.js?id="+${JSON.stringify(
    encodeURIComponent(gtmId),
  )};document.head.appendChild(s)}ev.forEach(function(e){addEventListener(e,load,{passive:true,once:true})});function idle(){setTimeout(load,${GTM_IDLE_DELAY_MS})}if(document.readyState==="complete")idle();else addEventListener("load",idle,{once:true})})()`;
}
