"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Route-change curtain, modelled on artistsweb.com:
 *   1. leave  — a full-screen panel wipes in from the left (scaleX 0 → 1, 0.7s)
 *   2. the new route loads underneath it
 *   3. enter  — after a short beat it collapses toward the bottom (scaleY 1 → 0, 0.6s)
 *
 * The panel is `bg-foreground`, so it is dark on a light page and light on a
 * dark page. Internal link clicks are intercepted in the capture phase;
 * back/forward, new-tab clicks, hash-only links and reduced-motion users keep
 * the browser's normal behaviour.
 */

const EASE = "cubic-bezier(0.45, 0, 0.55, 1)"; // ≈ GSAP power1.inOut
const LEAVE_MS = 700;
const ENTER_MS = 600;
const ENTER_DELAY_MS = 200;
const FAILSAFE_MS = 5000; // reveal anyway if the route never changes

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Runs a Web Animation and resolves when it finishes, or after `duration`
 * plus a grace period if the browser never ticks it (background tab, stalled
 * compositor). Navigation must never depend on an animation frame arriving.
 */
function play(
  element: HTMLElement,
  keyframes: Keyframe[],
  duration: number,
): Promise<void> {
  const animation = element.animate(keyframes, {
    duration,
    easing: EASE,
    fill: "forwards",
  });
  return Promise.race([
    animation.finished.then(() => undefined),
    wait(duration + 400),
  ]);
}

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const covering = useRef(false); // panel fully covers the screen
  const busy = useRef(false); // a transition is in flight
  const failsafe = useRef<number | undefined>(undefined);

  // Latest router in a ref so the click listener can be attached once.
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const revealRef = useRef<() => Promise<void>>(async () => {});
  useEffect(() => {
    revealRef.current = async () => {
      const panel = panelRef.current;
      if (!panel) return;
      window.clearTimeout(failsafe.current);
      covering.current = false;

      await wait(ENTER_DELAY_MS); // let the new page paint underneath
      panel.style.transformOrigin = "bottom";
      await play(
        panel,
        [{ transform: "scale(1, 1)" }, { transform: "scale(1, 0)" }],
        ENTER_MS,
      );

      // Back to the resting state (scaleX 0, left origin).
      panel.getAnimations().forEach((animation) => animation.cancel());
      panel.style.transformOrigin = "left";
      panel.style.pointerEvents = "none";
      busy.current = false;
    };
  });

  // New route committed while the panel is covering: open the curtain.
  useEffect(() => {
    if (covering.current) void revealRef.current();
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (hash jumps, query tweaks): nothing to transition.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault(); // stops next/link from navigating on its own
      if (busy.current) return;
      busy.current = true;

      const panel = panelRef.current;
      if (!panel) {
        routerRef.current.push(url.pathname + url.search + url.hash);
        busy.current = false;
        return;
      }

      panel.style.pointerEvents = "auto";
      panel.style.transformOrigin = "left";
      void play(
        panel,
        [{ transform: "scale(0, 1)" }, { transform: "scale(1, 1)" }],
        LEAVE_MS,
      ).then(() => {
        covering.current = true;
        routerRef.current.push(url.pathname + url.search + url.hash);
        failsafe.current = window.setTimeout(() => {
          void revealRef.current();
        }, FAILSAFE_MS);
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      // Resting state is an inline `transform` (not Tailwind's `scale-x-0`,
      // which sets the separate `scale` property and would multiply with the
      // animated transform, keeping the panel invisible).
      style={{ transform: "scale(0, 1)", transformOrigin: "left" }}
      className="pointer-events-none fixed inset-0 z-100 bg-foreground"
    />
  );
}
