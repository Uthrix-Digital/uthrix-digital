"use client";

import { useEffect } from "react";

export default function IntroController() {
  useEffect(() => {
    const root = document.documentElement;
    const overlay = document.getElementById("intro-overlay");
    if (!overlay) return;

    const done = () => {
      root.dataset.intro = "seen";
      try {
        sessionStorage.setItem("introSeen", "1");
      } catch {}
    };

    // CSS already finished before hydration caught up
    if (getComputedStyle(overlay).visibility === "hidden") {
      done();
      return;
    }

    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "intro-out") done();
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-intro-skip]")) {
        root.dataset.intro = "skipping"; // fast CSS fade, then animationend -> done()
      }
    };

    overlay.addEventListener("animationend", onEnd);
    overlay.addEventListener("click", onClick);
    return () => {
      overlay.removeEventListener("animationend", onEnd);
      overlay.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}