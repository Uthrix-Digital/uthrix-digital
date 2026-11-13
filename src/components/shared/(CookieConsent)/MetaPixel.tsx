"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/siteConfig";
import { useConsent } from "@/hooks/useConsent";

const PIXEL_ID = siteConfig.metaPixelId;

/**
 * Loads the Meta Pixel only after the visitor accepts marketing cookies.
 * Meta's <noscript> image fallback is left out on purpose: it would fire for
 * visitors who cannot give consent.
 */
export function MetaPixel() {
  const { consent } = useConsent();
  const enabled = Boolean(PIXEL_ID) && consent?.marketing === true;

  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  // The snippet below tracks the page it loads on; this tracks later
  // client-side navigations, which do not reload the script.
  useEffect(() => {
    if (!enabled) return;
    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pathname;
      return;
    }
    if (lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname;
      window.fbq?.("track", "PageView");
    }
  }, [pathname, enabled]);

  if (!enabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init',${JSON.stringify(PIXEL_ID)});fbq('track','PageView');`}
    </Script>
  );
}
