import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export interface OrbitDot {
  className: string;
}

export interface OrbitDotsContent {
  dots: readonly OrbitDot[];
  href: string;
  linkLabel: string;
  caption: string;
  number?: string;
  /** Node variant only — phase name (foundation / build / grow / retain) */
  phase?: string;
}

export interface OrbitDotsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "content"> {
  content?: OrbitDotsContent;
  variant?: "orbit" | "node";
  selected?: boolean;
  dimmed?: boolean;
  side?: "left" | "right";
}

export const defaultOrbitDotsContent: OrbitDotsContent = {
  dots: [
    { className: "left-[16%] top-[23%] size-2 bg-white/80" },
    { className: "left-[38%] top-[12%] size-1.5 bg-black/35" },
    { className: "right-[20%] top-[20%] size-2 bg-white/75" },
    { className: "right-[12%] top-[42%] size-1.5 bg-black/35" },
    { className: "left-[23%] bottom-[23%] size-1.5 bg-black/35" },
    { className: "right-[22%] bottom-[18%] size-2 bg-white/70" },
  ],
  href: "/ConnetMainDots",
  linkLabel: "View our brand identity services",
  caption: "From idea to first step",
};

/**
 * Render ONCE near the dots (DotsMap does this).
 * Holds the orbit spin, connector dash-flow and spine pulse animations.
 * All of them switch off for visitors who prefer reduced motion.
 */
export function OrbitKeyframes() {
  return (
    <style>{`
      @keyframes uthrix-orbit-spin { to { transform: rotate(360deg); } }
      @keyframes uthrix-dash-flow  { to { stroke-dashoffset: -24; } }
      @keyframes uthrix-spine-pulse {
        0%   { top: 0;    opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      .uthrix-orbit-spin  { animation: uthrix-orbit-spin 14s linear infinite; }
      .uthrix-orbit-spin-rev { animation-direction: reverse; }
      .uthrix-dash-flow   { animation: uthrix-dash-flow 1.2s linear infinite; }
      .uthrix-spine-pulse { animation: uthrix-spine-pulse 4.5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .uthrix-orbit-spin, .uthrix-dash-flow, .uthrix-spine-pulse { animation: none; }
      }
    `}</style>
  );
}

/** One ring + the satellite dot that travels around it. */
export function OrbitRing({
  inset,
  duration,
  reverse = false,
  ringClass,
  dotClass,
  dotSize = "size-2",
  dotPosition = "top",
}: {
  inset: string;
  duration: string;
  reverse?: boolean;
  ringClass: string;
  dotClass: string;
  dotSize?: string;
  dotPosition?: "top" | "bottom";
}) {
  return (
    <>
      <span
        className={`absolute rounded-full border transition-colors duration-500 ${ringClass}`}
        style={{ inset }}
      />
      <span
        className={`uthrix-orbit-spin absolute ${reverse ? "uthrix-orbit-spin-rev" : ""}`}
        style={{ inset, animationDuration: duration }}
      >
        <span
          className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-colors duration-500 ${dotSize} ${dotClass} ${
            dotPosition === "top" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"
          }`}
        />
      </span>
    </>
  );
}

export function OrbitDotRed({
  content = defaultOrbitDotsContent,
  variant = "orbit",
  selected = false,
  dimmed = false,
  className = "",
  ...props
}: OrbitDotsProps) {
  const { dots, href, linkLabel, caption, number, phase } = content;

  /* ───────────────────── NODE: a round orbit dot, label inside ─────────── */
  if (variant === "node") {
    const primaryDot = dots[0]?.className ?? "bg-[#ff1f28]";
    const ring = selected
      ? "border-[#ff1f28]/70"
      : "border-white/10 group-hover:border-[#ff1f28]/50";

    return (
      <span
        className={`group relative block aspect-square w-full rounded-full transition-opacity duration-500 ${
          dimmed ? "opacity-35 hover:opacity-90" : ""
        } ${className}`}
        {...props}
      >
        <OrbitRing
          inset="0%"
          duration={selected ? "9s" : "20s"}
          ringClass={ring}
          dotClass={selected ? "bg-white" : primaryDot}
          dotSize="size-2.5"
        />
        <OrbitRing
          inset="6%"
          duration={selected ? "6s" : "14s"}
          reverse
          ringClass={ring}
          dotClass={selected ? "bg-[#ff1f28]" : "bg-[#737b89]"}
          dotPosition="bottom"
        />
        <OrbitRing
          inset="12%"
          duration={selected ? "4s" : "10s"}
          ringClass={ring}
          dotClass="bg-white/70"
          dotSize="size-1.5"
        />

        {/* Core: the label lives inside the dot, like the sketch */}
        <span
          className={`absolute inset-[20%] flex flex-col items-center justify-center rounded-full px-2 text-center transition-all duration-500 group-hover:scale-105 ${
            selected
              ? "bg-[#ff1f28] text-white shadow-[0_0_70px_rgba(255,31,40,0.55)]"
              : "border border-white/15 bg-[#0d0e12] text-[#f1f2f5] group-hover:border-[#ff1f28]"
          }`}
        >
          <span
            className={`flex items-center gap-1 font-mono text-[10px] sm:text-xs ${
              selected ? "text-white/85" : "text-[#8b92a1]"
            }`}
          >
            {selected ? <Check className="size-3.5 stroke-[3]" aria-hidden="true" /> : null}
            {number}
          </span>
          <span className="mt-1 text-[0.85rem] font-semibold leading-tight tracking-[-0.02em] sm:text-base lg:text-[1.05rem]">
            {caption}
          </span>
          {phase && (
            <span
              className={`mt-1 hidden text-xs capitalize lg:block ${
                selected ? "text-white/75" : "text-[#8b92a1]"
              }`}
            >
              {phase}
            </span>
          )}
        </span>
      </span>
    );
  }

  /* ───────────────────── ORBIT (original, unchanged) ───────────────────── */
  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[min(80vw,38rem)] lg:max-w-2xl ${className}`}
      {...props}
    >
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute inset-[18%] rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute inset-[28%] rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute inset-[38%] rounded-full border border-white/10" />

      <div aria-hidden="true" className="absolute inset-0 rotate-[-18deg]">
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 bg-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-90 bg-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-45 bg-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-45 bg-white/10" />
      </div>

      <div aria-hidden="true">
        {dots.map((dot, index) => (
          <span
            key={`${dot.className}-${index}`}
            className={`absolute rounded-full ${dot.className}`}
          />
        ))}
      </div>

      <Link
        href={href}
        aria-label={linkLabel}
        className="absolute left-1/2 top-1/2 flex size-[clamp(8.5rem,20vw,12rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#ff302f]"
      >
        <ArrowUpRight
          aria-hidden="true"
          className="size-[clamp(3rem,6vw,4.5rem)] stroke-[1.5]"
        />
      </Link>
      <span className="font-archivo-black w-full text-[clamp(1.25rem,8vw,4rem)] font-black uppercase leading-[0.86] tracking-[-0.07em] sm:text-[clamp(1rem,4vw,8rem)] sm:leading-[0.82] sm:tracking-[-0.075em]">
        {caption}
      </span>
    </div>
  );
}
