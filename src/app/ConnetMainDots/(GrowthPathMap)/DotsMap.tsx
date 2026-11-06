"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { NODES } from "./data/nodes";
import {
  OrbitDotRed,
  OrbitKeyframes,
  OrbitRing,
} from "@/app/ConnetMainDots/OrbitDotRed";

interface DotsMapProps {
  mask: number;
  hubLines: string[];
  onNodeClick: (bit: number) => void;
}

// Theme tokens (see globals.css) so the lines follow light/dark mode.
const RED = "var(--brand-bright)";
const IDLE_LINE = "var(--track)";

/**
 * Dashed line from a dot to the spine, as in the sketch:
 * leaves the dot at its middle and drops diagonally onto the spine,
 * ending in a small junction dot.
 *
 * Geometry: the connector's spine-side edge sits exactly on the spine.
 *   - right-hand dots (and all dots on mobile): connector is LEFT of the dot
 *   - left-hand dots on desktop: same SVG, flipped horizontally
 */
function Connector({
  side,
  selected,
  dimmed,
}: {
  side: "left" | "right";
  selected: boolean;
  dimmed: boolean;
}) {
  const color = selected ? RED : IDLE_LINE;
  const flip = side === "left" ? "lg:-scale-x-100" : "";
  const junction =
    side === "left"
      ? "left-0 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-1/2"
      : "left-0 -translate-x-1/2";

  return (
    <span
      aria-hidden="true"
      className={`relative block h-44 w-12 shrink-0 transition-opacity duration-500 lg:h-64 lg:w-28 xl:w-56 ${
        dimmed ? "opacity-30" : ""
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={`absolute inset-0 size-full overflow-visible ${flip}`}
      >
        <line
          x1="100"
          y1="50"
          x2="0"
          y2="85"
          strokeWidth={selected ? 2 : 1.5}
          strokeDasharray="6 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={selected ? "uthrix-dash-flow" : ""}
          style={{
            stroke: color,
            filter: selected
              ? "drop-shadow(0 0 4px rgba(255,31,40,0.8))"
              : undefined,
          }}
        />
      </svg>
      <span
        className={`absolute top-[85%] size-2.5 -translate-y-1/2 rounded-full transition-colors duration-500 ${junction} ${
          selected ? "bg-brand-bright shadow-glow-sm" : "bg-track-dot"
        }`}
      />
    </span>
  );
}

export function DotsMap({ mask, hubLines, onNodeClick }: DotsMapProps) {
  const hasSelection = mask !== 0;

  return (
    <div className="relative w-full">
      <OrbitKeyframes />

      <div
        aria-hidden="true"
        className="pointer-events-none flex flex-col items-center justify-center pb-8 sm:pb-2"
      >
        <span className="tracking-[0.5em] text-foreground sm:text-1xl">
          SCROLL DOWN
        </span>

        <ArrowUpRight className="size-[clamp(2.5rem,6vw,3.5rem)] rotate-135 stroke-[2.5] text-foreground" />
      </div>

      {/* ── Journey: spine + zig-zag dots + goal ────────────────────── */}
      <div className="relative pl-5 lg:pl-0">
        {/* Spine. Ends at the Your Goal dot (goal height: 9rem mobile / 12rem desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-18 left-5 top-0 w-px -translate-x-1/2 transition-all duration-500 lg:bottom-48 lg:left-1/2"
          style={{
            background: hasSelection ? RED : IDLE_LINE,
            boxShadow: hasSelection ? "0 0 16px rgba(255,31,40,0.7)" : "none",
          }}
        >
          {hasSelection && (
            <span className="uthrix-spine-pulse absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_12px_var(--foreground)]" />
          )}
        </div>

        <ul className="relative">
          {NODES.map((node, index) => {
            const isSelected = (mask & node.bit) !== 0;
            const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
            const number = String(index + 1).padStart(2, "0");
            const dimmed = hasSelection && !isSelected;

            return (
              <li
                key={node.bit}
                className={`relative mt-24 first:mt-16 lg:mt-6 lg:grid lg:grid-cols-2 ${
                  index === 0 ? "" : "lg:-mt-24"
                }`}
              >
                <div
                  className={`flex items-center ${
                    side === "left"
                      ? "lg:col-start-1 lg:flex-row-reverse"
                      : "lg:col-start-2"
                  }`}
                >
                  <Connector
                    side={side}
                    selected={isSelected}
                    dimmed={dimmed}
                  />

                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? "Unselect" : "Select"} ${node.label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onNodeClick(node.bit);
                    }}
                    className="relative block size-36 shrink-0 rounded-full border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:size-44 lg:size-64"
                  >
                    <OrbitDotRed
                      variant="node"
                      selected={isSelected}
                      dimmed={dimmed}
                      content={{
                        dots: [{ className: "bg-brand-bright" }],
                        href: node.route,
                        linkLabel: `Explore ${node.label}`,
                        caption: node.label,
                        number,
                        phase: node.phase,
                      }}
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ── Your Goal ─────────────────────────────────────────────── */}
        <div className="relative mt-6 flex h-36 items-center lg:mt-4 lg:h-48 lg:justify-center">
          {/* mobile-only: spine → goal connector */}
          <span
            aria-hidden="true"
            className="relative block w-12 shrink-0 lg:hidden"
          >
            <span
              className="block w-full border-t-[1.5px] border-dashed transition-colors duration-500"
              style={{ borderColor: hasSelection ? RED : IDLE_LINE }}
            />
            <span
              className={`absolute left-0 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                hasSelection
                  ? "bg-brand-bright shadow-glow-sm"
                  : "bg-track-dot"
              }`}
            />
          </span>

          <motion.div
            key={hubLines.join("|")}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
            className="relative size-36 shrink-0 lg:size-48"
          >
            <OrbitRing
              inset="0%"
              ringClass={
                hasSelection ? "border-brand-bright/60" : "border-border"
              }
              dotClass={hasSelection ? "bg-foreground" : "bg-brand-bright"}
              dotSize="size-2.5"
            />
            <OrbitRing
              inset="8%"
              ringClass={
                hasSelection ? "border-brand-bright/60" : "border-border"
              }
              dotClass="bg-foreground/70"
              dotSize="size-1.5"
              dotPosition="bottom"
            />
            <span
              className={`absolute inset-[16%] flex flex-col items-center justify-center rounded-full px-2 text-center transition-all duration-500 ${
                hasSelection
                  ? "bg-brand text-brand-foreground shadow-glow"
                  : "border border-foreground/15 bg-card text-card-foreground"
              }`}
            >
              {hasSelection && (
                <span className="text-xs text-brand-foreground/90">Your goal</span>
              )}
              {hubLines.map((line, i) => (
                <span
                  key={line + i}
                  className="text-sm font-semibold leading-tight tracking-[-0.02em] lg:text-lg"
                >
                  {line}
                </span>
              ))}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
