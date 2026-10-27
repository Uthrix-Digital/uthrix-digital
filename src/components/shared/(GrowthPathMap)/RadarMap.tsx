"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { NODES, RING_RADII } from "./data/nodes";
import type { Phase } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ── SVG constants ───────────────────────────────────────────────────────── */
const CX = 248;
const CY = 248;
const HUB_R = 44;
const BEAM_SPREAD = 22; // degrees either side of node angle

/* ── Geometry helpers ────────────────────────────────────────────────────── */
const toRad = (deg: number) => (deg * Math.PI) / 180;
const f = (n: number) => n.toFixed(2);

function polar(angle: number, r: number) {
  const a = toRad(angle);
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
}

/** Filled pie-slice from center to the node's ring, ±BEAM_SPREAD degrees */
function beamPath(angle: number, r: number): string {
  const a1 = toRad(angle - BEAM_SPREAD);
  const a2 = toRad(angle + BEAM_SPREAD);
  const x1 = CX + r * Math.sin(a1);
  const y1 = CY - r * Math.cos(a1);
  const x2 = CX + r * Math.sin(a2);
  const y2 = CY - r * Math.cos(a2);
  return `M ${CX} ${CY} L ${f(x1)} ${f(y1)} A ${r} ${r} 0 0 1 ${f(x2)} ${f(y2)} Z`;
}

/* ── Per-node label layout ───────────────────────────────────────────────── */
interface LabelLayout {
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end";
  dominantBaseline:
    | "auto"
    | "alphabetic"
    | "central"
    | "hanging"
    | "ideographic"
    | "mathematical"
    | "middle"
    | "text-after-edge"
    | "text-before-edge"
    | "use-script"
    | "no-change"
    | "reset-size"
    | "inherit";
}

const LABEL_EXTRA = 20; // extra distance from node dot to label anchor

function labelLayout(angle: number, ringR: number): LabelLayout {
  const a = ((angle % 360) + 360) % 360;
  const lp = polar(angle, ringR + LABEL_EXTRA);

  let textAnchor: "start" | "middle" | "end" = "middle";
  let dominantBaseline: LabelLayout["dominantBaseline"] = "middle";

  if (a > 330 || a <= 30) {
    textAnchor = "middle";
    dominantBaseline = "auto";
  } // top
  else if (a <= 150) {
    textAnchor = "start";
    dominantBaseline = "middle";
  } // right
  else if (a <= 210) {
    textAnchor = "middle";
    dominantBaseline = "hanging";
  } // bottom
  else {
    textAnchor = "end";
    dominantBaseline = "middle";
  } // left

  return { x: lp.x, y: lp.y, textAnchor, dominantBaseline };
}

/* ── Component ───────────────────────────────────────────────────────────── */
interface RadarMapProps {
  mask: number;
  hubLines: string[];
  activePhases: Phase[];
  onNodeClick: (bit: number) => void;
}

export function RadarMap({
  mask,
  hubLines,
  activePhases,
  onNodeClick,
}: RadarMapProps) {
  const selectedNodes = useMemo(
    () => NODES.filter((n) => (mask & n.bit) !== 0),
    [mask],
  );

  const [openNodeBit, setOpenNodeBit] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 496 496"
        className="w-full h-auto select-none"
        aria-label="Interactive Uthrix growth path radar — click a node to explore"
        role="img"
      >
        {/* ── Decorative dashed tick rings ──────────────── */}
        {[46, 95, 141, 186, 230].map((r) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="black"
            strokeWidth={0.5}
            strokeDasharray="2 7"
            opacity={0.09}
          />
        ))}

        {/* ── Solid phase rings ─────────────────────────── */}
        {(["foundation", "build", "grow", "retain"] as const).map((phase) => {
          const r = RING_RADII[phase];
          return (
            <circle
              key={phase}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="black"
              strokeWidth={0.9}
              strokeDasharray={phase === "retain" ? "4 5" : undefined}
              opacity={0.22}
            />
          );
        })}

        {/* ── Axis cross lines ──────────────────────────── */}
        <line
          x1={CX}
          y1={14}
          x2={CX}
          y2={482}
          stroke="black"
          strokeWidth={1}
          opacity={1.0}
        />
        <line
          x1={14}
          y1={CY}
          x2={482}
          y2={CY}
          stroke="black"
          strokeWidth={1}
          opacity={1.0}
        />

        {/* ── Phase ring labels (outside each ring at the north/top arc) ── */}
        {(["foundation", "build", "grow", "retain"] as const).map((phase) => {
          const r = RING_RADII[phase];
          const isActive = activePhases.includes(phase);
          // The top of the ring sits at y = CY - r
          // Place a small tick ON the ring, then the label text just above/outside it
          const ringTopY = CY - r;
          return (
            <g key={phase}>
              {/* Tick mark sitting on the outer edge of the ring */}
              <line
                x1={CX}
                y1={ringTopY - 5}
                x2={CX}
                y2={ringTopY + 5}
                stroke={isActive ? "#c1121f" : "black"}
                strokeWidth={0.9}
                opacity={isActive ? 0.8 : 0.4}
                style={{ transition: "stroke 0.3s, opacity 0.3s" }}
              />
              {/* Label just outside the ring, anchored to the right of the axis */}
              <text
                x={CX + 5}
                y={ringTopY - 3}
                fontSize={7.5}
                fontFamily="inherit"
                letterSpacing={0.4}
                dominantBaseline="auto"
                fill={isActive ? "#c1121f" : "black"}
                opacity={isActive ? 0.85 : 0.3}
                style={{ transition: "fill 0.3s, opacity 0.3s" }}
              >
                {phase}
              </text>
            </g>
          );
        })}

        {/* ── Spoke lines ───────────────────────────────── */}
        {NODES.map((node) => {
          const outer = polar(node.angle, node.ringR + 26);
          const isSelected = (mask & node.bit) !== 0;
          const isDimmed = mask !== 0 && !isSelected;

          return (
            <line
              key={`spoke-${node.bit}`}
              x1={CX}
              y1={CY}
              x2={f(outer.x)}
              y2={f(outer.y)}
              stroke="black"
              strokeWidth={0.7}
              strokeDasharray="3 6"
              opacity={isDimmed ? 0.04 : 0.16}
              style={{ transition: "opacity 0.25s" }}
            />
          );
        })}

        {/* ── Beam fills ────────────────────────────────── */}
        {NODES.map((node) => {
          const isSelected = (mask & node.bit) !== 0;
          return isSelected ? (
            <motion.path
              key={`beam-${node.bit}`}
              d={beamPath(node.angle, node.ringR)}
              fill="rgba(193,18,31,0.11)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            />
          ) : null;
        })}

        {/* ── Dashed connection from hub to every node ───────── */}
        {NODES.map((node) => {
          const pos = polar(node.angle, node.ringR);

          return (
            <line
              key={`spoke-${node.bit}`}
              x1={CX}
              y1={CY}
              x2={f(pos.x)}
              y2={f(pos.y)}
              stroke="#111111"
              strokeWidth={0.8}
              strokeDasharray="3 6"
              strokeLinecap="round"
              opacity={0.28}
              style={{ transition: "opacity 0.25s" }}
            />
          );
        })}

        {/* ── Node dots + labels ────────────────────────── */}
        {NODES.map((node) => {
          const pos = polar(node.angle, node.ringR);
          const isSelected = (mask & node.bit) !== 0;
          const isDimmed = mask !== 0 && !isSelected;
          const ll = labelLayout(node.angle, node.ringR);

          return (
            <g
              key={`node-${node.bit}`}
              onClick={() => onNodeClick(node.bit)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${isSelected ? "Deselect" : "Select"} ${node.label}`}
            >
              {/* Invisible generous hit area */}
              <circle cx={f(pos.x)} cy={f(pos.y)} r={22} fill="transparent" />

              {/* Outer halo ring when selected */}
              {isSelected && (
                <motion.circle
                  cx={f(pos.x)}
                  cy={f(pos.y)}
                  r={12}
                  fill="none"
                  stroke="#c1121f"
                  strokeWidth={1.2}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.38 }}
                  transition={{ duration: 0.22 }}
                />
              )}

              {/* Node dot — motion-animated radius + fill */}
              <motion.circle
                cx={f(pos.x)}
                cy={f(pos.y)}
                initial={false}
                animate={{
                  r: isSelected ? 6.5 : 5,
                  fill: isSelected ? "#c1121f" : "#111111",
                  opacity: isDimmed ? 0.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Label */}
              <text
                x={ll.x}
                y={ll.y}
                textAnchor={ll.textAnchor}
                dominantBaseline={ll.dominantBaseline}
                fontSize={9.5}
                fontFamily="inherit"
                fill={isSelected ? "#c1121f" : "#111"}
                opacity={isDimmed ? 0.16 : isSelected ? 0.9 : 0.55}
                style={{
                  pointerEvents: "none",
                  transition: "fill 0.25s, opacity 0.25s",
                }}
              >
                {node.svgLabel.map((line, i) => (
                  <tspan key={i} x={ll.x} dy={i === 0 ? 0 : 12}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* ── Hub circle ────────────────────────────────── */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={HUB_R}
          fill="white"
          initial={false}
          animate={{
            stroke: mask > 0 ? "#c1121f" : "#111111",
            strokeWidth: mask > 0 ? 1.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Hub text — key forces re-mount on title change for clean cross-fade */}
        <motion.g
          key={hubLines.join("|")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {hubLines.map((line, i) => {
            const lineH = 13;
            const totalH = (hubLines.length - 1) * lineH;
            const y = CY - totalH / 2 + i * lineH;
            return (
              <text
                key={i}
                x={CX}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9.5}
                fontWeight={mask > 0 ? 600 : 400}
                fontFamily="inherit"
                fill={mask > 0 ? "#c1121f" : "#111"}
                style={{ pointerEvents: "none", transition: "fill 0.3s" }}
              >
                {line}
              </text>
            );
          })}
        </motion.g>
      </svg>

      {/* Node popover overlays go here */}
      {NODES.map((node) => {
        const pos = polar(node.angle, node.ringR);

        return (
          <Popover
            key={`popover-${node.bit}`}
            open={openNodeBit === node.bit && (mask & node.bit) !== 0}
            onOpenChange={(open) => {
              setOpenNodeBit(open ? node.bit : null);
            }}
          >
            <PopoverTrigger
              type="button"
              aria-label={`${(mask & node.bit) !== 0 ? "Unselect" : "Select"} ${node.label}`}
              onClick={(event) => {
                event.stopPropagation();

                const isSelected = (mask & node.bit) !== 0;

                onNodeClick(node.bit);

                if (isSelected) {
                  // The node is being unselected.
                  setOpenNodeBit(null);
                } else {
                  // The node is being selected.
                  setOpenNodeBit(node.bit);
                }
              }}
              className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${(pos.x / 496) * 100}%`,
                top: `${(pos.y / 496) * 100}%`,
              }}
            >
              <span className="sr-only">{node.label}</span>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              sideOffset={10}
              className="w-64"
              align="start"
            >
              <div className="space-y-1.5">
                <p className="font-semibold text-black">{node.label}</p>

                <p className="text-xs leading-relaxed text-black/60">
                  {node.summary}
                </p>

                <p className="text-xs leading-relaxed text-black/45">
                  {node.why}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
