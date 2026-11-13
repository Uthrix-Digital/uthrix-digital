"use client";

import { useEffect } from "react";

export default function ScrollToTopOnLoad() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";

    // A link like /Company#team should land on its section, not the top.
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target) {
      // Wait a frame so layout (and the sticky bar) is settled.
      const frame = window.requestAnimationFrame(() => target.scrollIntoView());
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}
