"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  coverCurtain,
  isCurtainBusy,
  prefersReducedMotion,
  registerCurtain,
  uncoverCurtain,
} from "@/lib/curtain";

/**
 * Hosts the curtain panel (see src/lib/curtain.ts) and plays it on route
 * changes: internal link clicks are intercepted in the capture phase, the
 * curtain covers the screen, the route changes underneath, then it uncovers.
 * Back/forward, new-tab clicks, hash-only links and reduced-motion users keep
 * the browser's normal behaviour. The theme toggle uses the same curtain.
 */

const FAILSAFE_MS = 5000; // uncover anyway if the route never changes

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const covering = useRef(false); // a route change is waiting under the curtain
  const failsafe = useRef<number | undefined>(undefined);

  // Latest router in a ref so the click listener can be attached once.
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // New route committed while the curtain is covering: open it.
  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    window.clearTimeout(failsafe.current);
    void uncoverCurtain();
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

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
      if (isCurtainBusy()) return;

      const href = url.pathname + url.search + url.hash;
      void coverCurtain().then((started) => {
        if (!started) {
          routerRef.current.push(href);
          return;
        }
        covering.current = true;
        routerRef.current.push(href);
        failsafe.current = window.setTimeout(() => {
          if (!covering.current) return;
          covering.current = false;
          void uncoverCurtain();
        }, FAILSAFE_MS);
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      ref={registerCurtain}
      aria-hidden="true"
      // Resting state is an inline `transform` (not Tailwind's `scale-x-0`,
      // which sets the separate `scale` property and would multiply with the
      // animated transform, keeping the panel invisible).
      style={{ transform: "scale(0, 1)", transformOrigin: "left" }}
      className="pointer-events-none fixed inset-0 z-100 bg-foreground"
    />
  );
}
