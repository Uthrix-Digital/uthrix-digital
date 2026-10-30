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

export interface OrbitDotsProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "content"
> {
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
 * Holds the connector dash-flow and spine pulse animations.
 * Both switch off for visitors who prefer reduced motion.
 */
export function OrbitKeyframes() {
  return (
    <style>{`
      @keyframes uthrix-dash-flow  { to { stroke-dashoffset: -24; } }
      @keyframes uthrix-spine-pulse {
        0%   { top: 0;    opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      .uthrix-dash-flow   { animation: uthrix-dash-flow 1.2s linear infinite; }
      .uthrix-spine-pulse { animation: uthrix-spine-pulse 4.5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .uthrix-dash-flow, .uthrix-spine-pulse { animation: none; }
      }
    `}</style>
  );
}

/** One static ring with a positioned satellite dot. */
export function OrbitRing({
  inset,
  ringClass,
  dotClass,
  dotSize = "size-2",
  dotPosition = "top",
}: {
  inset: string;
  ringClass: string;
  dotClass: string;
  dotSize?: string;
  dotPosition?: "top" | "bottom";
}) {
  return (
    <>
      <span
        className={`absolute rounded-full border ${ringClass}`}
        style={{ inset }}
      />
      <span className="absolute" style={{ inset }}>
        <span
          className={`absolute left-1/2 -translate-x-1/2 rounded-full ${dotSize} ${dotClass} ${
            dotPosition === "top"
              ? "top-0 -translate-y-1/2"
              : "bottom-0 translate-y-1/2"
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
  side = "right",
  className = "",
  ...props
}: OrbitDotsProps) {
  const { dots, href, linkLabel, caption, number, phase } = content;

  /* ───────────────────── NODE: a round orbit dot with a label above it ── */
  if (variant === "node") {
    const ring = selected
      ? "border-[#ff1f28]/70"
      : "border-white/10 group-hover:border-[#ff1f28]/50";

    return (
      <span
        className={`group relative block aspect-square w-full rounded-full ${
          dimmed ? "opacity-35 hover:opacity-90" : ""
        } ${className}`}
        {...props}
      >
        <OrbitRing
          inset="12%"
          ringClass={ring}
          dotClass="bg-white"
          dotSize="size-1.5"
        />

        <span
          className={`absolute bottom-full left-1/2 z-10 mb-3 flex w-[min(88vw,20rem)] -translate-x-1/2 flex-col items-center text-center ${
            side === "left"
              ? "lg:right-full lg:left-auto lg:top-1/2 lg:bottom-auto lg:mb-0 lg:mr-8 lg:w-max lg:max-w-[min(28vw,24rem)] lg:translate-x-0 lg:-translate-y-1/2 lg:items-end lg:text-right"
              : "lg:top-1/2 lg:left-full lg:bottom-auto lg:ml-8 lg:w-max lg:max-w-[min(28vw,24rem)] lg:-translate-y-1/2 lg:translate-x-0 lg:items-start lg:text-left"
          } ${selected ? "text-white" : "text-[#f1f2f5]"}`}
        >
          <span className="block w-full font-archivo-black text-[clamp(1.15rem,6vw,2rem)] font-semibold leading-[0.9] tracking-[-0.04em] lg:text-[clamp(1.75rem,3.8vw,4.05rem)]">
            {caption}
          </span>
        </span>

        <span
          className={`absolute inset-[20%] flex items-center justify-center rounded-full ${
            selected
              ? "bg-[#ff1f28] text-white shadow-[0_0_70px_rgba(255,31,40,0.55)]"
              : "border border-white/15 bg-[#0d0e12] text-[#f1f2f5] group-hover:border-[#ff1f28]"
          }`}
        >
          <ArrowUpRight
            aria-hidden="true"
            className="size-[clamp(2.5rem,6vw,4.5rem)] stroke-[1.5]"
          />
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
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[18%] rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[28%] rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[38%] rounded-full border border-white/10"
      />

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
      <span className="font-archivo-black text-[4.05rem] leading-none">
        {caption}
      </span>
    </div>
  );
}
