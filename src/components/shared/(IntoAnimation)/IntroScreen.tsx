"use client";

/**
 * IntroScreen — Production-ready Uthrix logo intro animation
 *
 * Uses EXACT original SVG path geometry from /assets/Images/logo.svg.
 * No fonts, no recreated letterforms, no approximations.
 *
 * SVG source (logo.svg):
 *   viewBox: 0 0 2610.81595 654.38591
 *   Red dot in viewBox space: cx=2549.83468  cy=590.57008  r=60.98127  fill=#c40202
 *   All letter paths use transform="translate(-194.59203 -1172.80705)"
 *
 * Animation:
 *   0.00 – 0.20s  Red dot only, all letters hidden below their clip slots
 *   0.20 – 3.00s  Dot sweeps left→right via smoothstep
 *                 U t h r i x reveal sequentially as dot crosses their centres
 *   3.10s         All letters fully settled
 *   3.10 – 5.10s  Complete logo holds on black
 *   5.10 – 5.50s  Black overlay fades to zero → site revealed
 *
 * CONFIG object at top of file for easy timing/sizing tuning.
 *
 * Dev replay:  window.__replayUthrixIntro()  in browser console
 */

import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────────────────────── */
const CONFIG = {
  openingDelay:        200,   // ms — dot-only hold before sweep starts
  sweepDuration:       2800,  // ms — dot travels full width
  letterArrivalDuration: 260, // ms — each letter's upward settle
  settleOvershoot:     5,     // SVG units — tiny overshoot magnitude
  finalHoldDuration:   2000,  // ms — hold on complete logo
  overlayExitDuration: 400,   // ms — black overlay fade
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   SVG GEOMETRY  (source of truth: logo.svg)
───────────────────────────────────────────────────────────────────────────── */

/** Artwork tight bounds */
const VB_W = 2610.81595;
const VB_H = 654.38591;

/** Exact red dot from logo.svg — never changes size or Y */
const DOT = {
  cx: 2549.83468,
  cy: 590.57008,
  r:  60.98127,
  fill: "#c40202",
} as const;

/** Dot travel: starts left-of-U, ends at artwork position */
const DOT_START_X = -50;
const DOT_END_X   = DOT.cx;
const DOT_Y       = DOT.cy; // constant throughout

/**
 * Letters in reveal order.
 * triggerX  — dot x at which we start the letter's entrance (letter centre)
 * clip      — rectangle in viewBox space that isolates this glyph column
 * revealDY  — distance below final position the letter starts (SVG units)
 */
const LETTERS = [
  {
    key: "U",
    triggerX: 273,
    clip: { x: -8,    y: -10, w: 565,  h: VB_H + 30 },
    revealDY: VB_H * 0.22,
  },
  {
    key: "t",
    triggerX: 719,
    clip: { x: 557,   y: -10, w: 310,  h: VB_H + 30 },
    revealDY: VB_H * 0.22,
  },
  {
    key: "h",
    triggerX: 1156,
    clip: { x: 867,   y: -10, w: 568,  h: VB_H + 30 },
    revealDY: VB_H * 0.22,
  },
  {
    key: "r",
    triggerX: 1614,
    clip: { x: 1435,  y: -10, w: 350,  h: VB_H + 30 },
    revealDY: VB_H * 0.22,
  },
  {
    key: "i",
    triggerX: 1842,
    clip: { x: 1785,  y: -10, w: 120,  h: VB_H + 30 },
    revealDY: VB_H * 0.22,
  },
  {
    key: "x",
    triggerX: 2235,
    clip: { x: 1905,  y: -10, w: 580,  h: VB_H + 30 },
    revealDY: VB_H * 0.22,
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function smoothstep(t: number): number {
  const u = Math.max(0, Math.min(1, t));
  return u * u * (3 - 2 * u);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

const SS_KEY = "uthrix-intro-done";
function ssGet(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } }
function ssSet(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* noop */ } }

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export function IntroScreen() {
  const [active,  setActive]  = useState(false);
  const [mounted, setMounted] = useState(true);

  // Overlay opacity driven via direct DOM manipulation for performance
  const overlayRef  = useRef<HTMLDivElement>(null);
  const dotRef      = useRef<SVGCircleElement>(null);
  // One ref per letter group
  const letterRefs  = useRef<Array<SVGGElement | null>>(LETTERS.map(() => null));

  const rafRef      = useRef<number | null>(null);
  const isMounted   = useRef(false);

  /* ── Timeline phase timestamps (ms from first frame) ───────────────── */
  const T_SWEEP_START = CONFIG.openingDelay;
  const T_SWEEP_END   = T_SWEEP_START + CONFIG.sweepDuration;
  // Per-letter trigger times derived from dot position
  const letterTriggerTimes = LETTERS.map((l) => {
    const frac = (l.triggerX - DOT_START_X) / (DOT_END_X - DOT_START_X);
    return T_SWEEP_START + frac * CONFIG.sweepDuration;
  });
  const T_HOLD_END    = T_SWEEP_END + CONFIG.finalHoldDuration;
  const T_EXIT_END    = T_HOLD_END  + CONFIG.overlayExitDuration;

  /* ── Scroll lock/unlock ─────────────────────────────────────────────── */
  const lockScroll   = useCallback(() => { document.body.style.overflow = "hidden"; }, []);
  const unlockScroll = useCallback(() => { document.body.style.overflow = "";       }, []);

  /* ── Hard finish: RAF stopped, overlay removed, scroll restored ─────── */
  const finish = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    ssSet(SS_KEY, "1");
    unlockScroll();
    setMounted(false);
  }, [unlockScroll]);

  /* ── Keyboard + visibility ──────────────────────────────────────────── */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    const onVis = () => { if (document.visibilityState === "visible") finish(); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active, finish]);

  /* ── Determine on client whether to show ───────────────────────────── */
  useEffect(() => {
    isMounted.current = true;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setTimeout(() => setMounted(false), 0);
      return;
    }
    // Session guard
    if (ssGet(SS_KEY)) {
      window.setTimeout(() => setMounted(false), 0);
      return;
    }

    // Fail-safe: remove overlay after 10 s even on errors
    const failSafe = setTimeout(finish, 10_000);
    const activate = setTimeout(() => {
      setActive(true);
      lockScroll();
    }, 0);

    return () => {
      isMounted.current = false;
      clearTimeout(failSafe);
      clearTimeout(activate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Master RAF timeline ────────────────────────────────────────────── */
  useEffect(() => {
    if (!active) return;

    let startTime: number | null = null;
    const triggered = LETTERS.map(() => false);

    function frame(now: number) {
      if (!isMounted.current) return;
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;

      /* 1 ── Dot X position (constant Y) */
      let dotX: number;
      if (elapsed < T_SWEEP_START) {
        dotX = DOT_START_X;
      } else if (elapsed < T_SWEEP_END) {
        dotX = DOT_START_X + (DOT_END_X - DOT_START_X) * smoothstep(
          (elapsed - T_SWEEP_START) / CONFIG.sweepDuration
        );
      } else {
        dotX = DOT_END_X;
      }
      dotRef.current?.setAttribute("cx", String(dotX.toFixed(3)));

      /* 2 ── Letter entrance */
      for (let i = 0; i < LETTERS.length; i++) {
        const letter = LETTERS[i];
        const el = letterRefs.current[i];
        if (!el) continue;

        if (!triggered[i] && elapsed >= letterTriggerTimes[i]) {
          triggered[i] = true;
        }
        if (!triggered[i]) {
          // Keep hidden below clip slot
          el.setAttribute("transform", `translate(0,${letter.revealDY.toFixed(1)})`);
          continue;
        }

        // Fraction through the arrival animation
        const localT = (elapsed - letterTriggerTimes[i]) / CONFIG.letterArrivalDuration;
        const p = Math.max(0, Math.min(1, localT));

        // Ease-out cubic for main travel
        const eased = easeOutCubic(p);
        // Single-hump overshoot that peaks around p≈0.65 then settles
        const overshoot = CONFIG.settleOvershoot * Math.sin(p * Math.PI) * Math.max(0, 1 - p * 1.4);
        const dy = letter.revealDY * (1 - eased) - overshoot;

        el.setAttribute("transform", `translate(0,${dy.toFixed(3)})`);
      }

      /* 3 ── Overlay fade */
      if (elapsed >= T_HOLD_END) {
        const u = Math.min(1, (elapsed - T_HOLD_END) / CONFIG.overlayExitDuration);
        if (overlayRef.current) {
          overlayRef.current.style.opacity = String((1 - u).toFixed(4));
        }
        if (elapsed >= T_EXIT_END) {
          finish();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Uthrix intro"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
        pointerEvents: "all",
      }}
    >
      {/* ── Inline SVG — exact logo geometry ─────────────────────────── */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        aria-label="Uthrix"
        role="img"
        aria-hidden="false"
        style={{
          /* 88 vw on mobile, max 860 px on desktop, never taller than 90 vh */
          width: "min(88vw, 860px)",
          height: "auto",
          maxHeight: "90vh",
          display: "block",
          overflow: "visible",
        }}
      >
        <defs>
          {LETTERS.map((l) => (
            <clipPath
              key={`clip-${l.key}`}
              id={`uth-clip-${l.key}`}
              clipPathUnits="userSpaceOnUse"
            >
              <rect
                x={l.clip.x}
                y={l.clip.y}
                width={l.clip.w}
                height={l.clip.h}
              />
            </clipPath>
          ))}
        </defs>

        {/* ── U — path + detached white circle (part of the glyph) ── */}
        <g
          clipPath="url(#uth-clip-U)"
          ref={(el) => { letterRefs.current[0] = el; }}
          transform={`translate(0,${LETTERS[0].revealDY})`}
        >
          <path
            fill="#fff"
            d="M681.33878,1358.98362a59.40105,59.40105,0,0,0-18.79217,3.02287,60.089,60.089,0,0,0-41.33655,57.10578v134.93429a154.49153,154.49153,0,1,1-308.983,0V1329.92091c-.08514.05941-.16967.11963-.25474.17914v-98.621a58.69012,58.69012,0,1,0-116.76117,8.52584V1548.2924h.06134q-.05936,2.87019-.06134,5.75416c0,150.84981,122.297,273.14639,273.14637,273.14639S741.5039,1704.89637,741.5039,1554.04656V1419.11227A60.12825,60.12825,0,0,0,681.33878,1358.98362Z"
            transform="translate(-194.59203 -1172.80705)"
          />
          {/* White circle — detached part of the U glyph */}
          <circle fill="#fff" cx="486.75909" cy="72.42092" r="60.15278" />
        </g>

        {/* ── t ─────────────────────────────────────────────────────── */}
        <g
          clipPath="url(#uth-clip-t)"
          ref={(el) => { letterRefs.current[1] = el; }}
          transform={`translate(0,${LETTERS[1].revealDY})`}
        >
          <path
            fill="#fff"
            d="M984.07073,1442.926a28.37887,28.37887,0,0,0-28.37887,28.37887v211.74778a28.454,28.454,0,0,0,28.36372,28.37844h28.37847a28.37888,28.37888,0,0,1,28.37888,28.37887v56.727a28.37887,28.37887,0,0,1-28.37888,28.37887H984.05558a142.2854,142.2854,0,0,1-141.8784-141.87841v-211.7326A28.37887,28.37887,0,0,0,813.7983,1442.926h0a28.37888,28.37888,0,0,1-28.37888-28.37888v-56.74176a28.37887,28.37887,0,0,1,28.37888-28.37887h0a28.37887,28.37887,0,0,0,28.37888-28.37887V1203.463a28.37887,28.37887,0,0,1,28.37887-28.37887H927.313a28.37887,28.37887,0,0,1,28.37887,28.37887v97.58459a28.37887,28.37887,0,0,0,28.37887,28.37887h28.36332a28.37887,28.37887,0,0,1,28.37888,28.37887v56.74176a28.37888,28.37888,0,0,1-28.37888,28.37888Z"
            transform="translate(-194.59203 -1172.80705)"
          />
        </g>

        {/* ── h ─────────────────────────────────────────────────────── */}
        <g
          clipPath="url(#uth-clip-h)"
          ref={(el) => { letterRefs.current[2] = el; }}
          transform={`translate(0,${LETTERS[2].revealDY})`}
        >
          <path
            fill="#fff"
            d="M1598.80039,1577.19347v219.40377a28.37887,28.37887,0,0,1-28.37888,28.37887h-56.75694a28.37887,28.37887,0,0,1-28.37887-28.37887V1577.19347a134.2679,134.2679,0,1,0-268.52073,0v219.40377a28.37887,28.37887,0,0,1-28.37888,28.37887h-56.74176a28.37887,28.37887,0,0,1-28.37887-28.37887V1202.78458a28.37887,28.37887,0,0,1,28.37887-28.37888h56.71187a28.37887,28.37887,0,0,1,28.37887,28.37888V1322.26a28.35293,28.35293,0,0,0,39.2224,26.21924,245.89344,245.89344,0,0,1,95.0451-19.0528C1487.6876,1329.80685,1598.403,1440.5089,1598.80039,1577.19347Z"
            transform="translate(-194.59203 -1172.80705)"
          />
        </g>

        {/* ── r ─────────────────────────────────────────────────────── */}
        <g
          clipPath="url(#uth-clip-r)"
          ref={(el) => { letterRefs.current[3] = el; }}
          transform={`translate(0,${LETTERS[3].revealDY})`}
        >
          <path
            fill="#fff"
            d="M1952.29316,1357.80534v56.74176a28.37888,28.37888,0,0,1-28.37887,28.37888h-115.55a28.469,28.469,0,0,0-28.37844,28.3789v325.29236a28.37887,28.37887,0,0,1-28.37887,28.37887H1694.85a28.37887,28.37887,0,0,1-28.37888-28.37887V1471.30488a142.28511,142.28511,0,0,1,141.87841-141.87841h115.56475A28.37887,28.37887,0,0,1,1952.29316,1357.80534Z"
            transform="translate(-194.59203 -1172.80705)"
          />
        </g>

        {/* ── i — bar + dot circle ───────────────────────────────────── */}
        <g
          clipPath="url(#uth-clip-i)"
          ref={(el) => { letterRefs.current[4] = el; }}
          transform={`translate(0,${LETTERS[4].revealDY})`}
        >
          {/* i body bar */}
          <path
            fill="#fff"
            d="M1994.53839,1796.59724v-438.7919a28.37887,28.37887,0,0,1,28.37887-28.37887h56.75786a28.37887,28.37887,0,0,1,28.37888,28.37887v438.7919a28.37887,28.37887,0,0,1-28.37888,28.37887h-56.75786A28.37887,28.37887,0,0,1,1994.53839,1796.59724Z"
            transform="translate(-194.59203 -1172.80705)"
          />
          {/* i dot */}
          <path
            fill="#fff"
            d="M1994.53839,1231.1934a56.75794,56.75794,0,1,1,56.7578,56.74217A56.75912,56.75912,0,0,1,1994.53839,1231.1934Z"
            transform="translate(-194.59203 -1172.80705)"
          />
        </g>

        {/* ── x ─────────────────────────────────────────────────────── */}
        <g
          clipPath="url(#uth-clip-x)"
          ref={(el) => { letterRefs.current[5] = el; }}
          transform={`translate(0,${LETTERS[5].revealDY})`}
        >
          <path
            fill="#fff"
            d="M2505.95719,1594.611l147.16861,183.62037c14.88941,18.57731,1.66365,46.127-22.14414,46.127H2558.2402a28.37887,28.37887,0,0,1-22.14458-10.63126L2441.14217,1695.249a28.37887,28.37887,0,0,0-44.28815-.00127l-94.96661,118.4807a28.37885,28.37885,0,0,1-22.14357,10.63h-72.73122c-23.80734,0-37.03324-27.54881-22.14475-46.12628l147.159-183.62121a28.37886,28.37886,0,0,0-.00116-35.49626l-147.16651-183.606c-14.89024-18.57717-1.66461-46.12773,22.14359-46.12773h72.741a28.37886,28.37886,0,0,1,22.14357,10.63l94.96661,118.48069a28.37887,28.37887,0,0,0,44.28815-.00127l94.95345-118.47816a28.37887,28.37887,0,0,1,22.14458-10.63126h72.73926c23.80817,0,37.03381,27.5505,22.14363,46.12768L2505.95771,1559.114A28.37887,28.37887,0,0,0,2505.95719,1594.611Z"
            transform="translate(-194.59203 -1172.80705)"
          />
        </g>

        {/* ── Red signature dot — animates left→right, Y is constant ── */}
        <circle
          ref={dotRef}
          cx={DOT_START_X}
          cy={DOT_Y}
          r={DOT.r}
          fill={DOT.fill}
        />
      </svg>

      {/* ── Skip intro button ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={finish}
        aria-label="Skip intro"
        style={{
          position: "absolute",
          bottom: "clamp(1.25rem, 3vh, 2.5rem)",
          right:  "clamp(1.25rem, 3vw, 2.5rem)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.45)",
          borderRadius: "999px",
          padding: "0.375rem 1rem",
          fontSize: "0.6875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "var(--font-manrope, system-ui, sans-serif)",
          lineHeight: 1.5,
          userSelect: "none",
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.color = "rgba(255,255,255,0.85)";
          b.style.borderColor = "rgba(255,255,255,0.5)";
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.color = "rgba(255,255,255,0.45)";
          b.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        Skip
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEV REPLAY
   Open browser console and call: window.__replayUthrixIntro()
───────────────────────────────────────────────────────────────────────────── */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as Window & { __replayUthrixIntro?: () => void }).__replayUthrixIntro =
    () => {
      try { sessionStorage.removeItem(SS_KEY); } catch { /* noop */ }
      window.location.reload();
    };
}


