/**
 * Shared full-screen curtain, used for both page navigation and theme changes
 * (modelled on artistsweb.com):
 *   cover   — the panel wipes in from the left   (scaleX 0 → 1, 0.7s)
 *   …something changes underneath (route / theme)…
 *   uncover — after a beat it collapses to the bottom (scaleY 1 → 0, 0.6s)
 *
 * The panel is `bg-foreground`, so it is dark over a light page and light over
 * a dark page. Its colour is frozen when it starts covering, so it doesn't
 * flip if the theme changes underneath it.
 *
 * The <PageTransition/> component registers the panel element here.
 */

const EASE = "cubic-bezier(0.45, 0, 0.55, 1)"; // ≈ GSAP power1.inOut
const COVER_MS = 700;
const UNCOVER_MS = 600;
const UNCOVER_DELAY_MS = 200;

let panel: HTMLDivElement | null = null;
let busy = false;

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Runs a Web Animation and resolves when it finishes, or shortly after its
 * duration if the browser never ticks it (background tab, stalled compositor).
 * Nothing may depend on an animation frame arriving.
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

export function registerCurtain(element: HTMLDivElement | null) {
  panel = element;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True while a cover/uncover cycle is in flight. */
export function isCurtainBusy() {
  return busy;
}

/**
 * Wipe the curtain across the screen. Resolves `true` once fully covering
 * (call `uncoverCurtain` afterwards), or `false` if it could not start —
 * no panel, reduced motion, or another cycle already running.
 */
export async function coverCurtain(): Promise<boolean> {
  if (!panel || busy || prefersReducedMotion()) return false;
  busy = true;

  panel.style.backgroundColor = getComputedStyle(panel).backgroundColor;
  panel.style.pointerEvents = "auto";
  panel.style.transformOrigin = "left";
  await play(
    panel,
    [{ transform: "scale(0, 1)" }, { transform: "scale(1, 1)" }],
    COVER_MS,
  );
  return true;
}

/** Collapse the curtain toward the bottom and return it to rest. */
export async function uncoverCurtain(): Promise<void> {
  const element = panel;
  if (!element) {
    busy = false;
    return;
  }

  await wait(UNCOVER_DELAY_MS); // let whatever changed underneath paint
  element.style.transformOrigin = "bottom";
  await play(
    element,
    [{ transform: "scale(1, 1)" }, { transform: "scale(1, 0)" }],
    UNCOVER_MS,
  );

  // Back to the resting state (scaleX 0, left origin, themed colour).
  element.getAnimations().forEach((animation) => animation.cancel());
  element.style.transformOrigin = "left";
  element.style.pointerEvents = "none";
  element.style.backgroundColor = "";
  busy = false;
}

/**
 * Cover the screen, run `change` while it is hidden, then uncover. If the
 * curtain can't run, `change` still runs immediately.
 */
export async function runCurtain(change: () => void): Promise<void> {
  if (!(await coverCurtain())) {
    change();
    return;
  }
  change();
  await uncoverCurtain();
}
