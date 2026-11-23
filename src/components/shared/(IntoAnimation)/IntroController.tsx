"use client";

import { useEffect } from "react";
import { INTRO_SEEN_STORAGE_KEY } from "@/lib/intro";

export default function IntroController() {
  useEffect(() => {
    const root = document.documentElement;
    const overlay = document.getElementById("intro-overlay");
    // The pre-paint script (src/lib/intro.ts) decides whether the splash
    // plays; without data-intro="playing" the overlay is already hidden.
    if (!overlay || root.dataset.intro !== "playing") return;

    const done = () => {
      root.dataset.intro = "seen";
      try {
        sessionStorage.setItem(INTRO_SEEN_STORAGE_KEY, "1");
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
