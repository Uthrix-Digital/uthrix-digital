"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
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

function arcPath(startAngle: number, endAngle: number, radius: number): string {
  const start = polar(startAngle, radius);
  const end = polar(endAngle, radius);
  const sweep = endAngle <= startAngle ? endAngle + 360 - startAngle : endAngle - startAngle;
  const largeArcFlag = sweep > 180 ? 1 : 0;

  return `M ${f(start.x)} ${f(start.y)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${f(end.x)} ${f(end.y)}`;
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

const LABEL_EXTRA = 24;

const PHASE_ARCS = {
  foundation: { start: 300, end: 60 },
  build: { start: 315, end: 45 },
  grow: { start: 330, end: 30 },
  retain: { start: 345, end: 15 },
} as const;

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

  /* ── Radar sweep motion value ─────────────────────────────────────── */
  const sweepDeg = useMotionValue(0);

  // Idle: continuous slow rotation when nothing is selected
  useEffect(() => {
    if (mask !== 0) return;
    const controls = animate(sweepDeg, sweepDeg.get() + 360, {
      duration: 9,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [mask]); // eslint-disable-line react-hooks/exhaustive-deps

  // On node select: smoothly snap sweep to the selected node's angle
  useEffect(() => {
    if (mask === 0 || selectedNodes.length === 0) return;
    const target = selectedNodes[selectedNodes.length - 1].angle;
    // Shortest-arc rotation from current accumulated angle
    const current = ((sweepDeg.get() % 360) + 360) % 360;
    let delta = ((target % 360) + 360) % 360 - current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const controls = animate(sweepDeg, sweepDeg.get() + delta, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [mask]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 496 496"
        className="w-full h-auto select-none"
        aria-label="Interactive Uthrix growth path radar — click a node to explore"
        role="img"
      >
        {/* ── Radar clip path ───────────────────────────── */}
        <defs>
          <clipPath id="radar-sweep-clip">
            <circle cx={CX} cy={CY} r={235} />
          </clipPath>
        </defs>

        {/* ── Phase progression arcs ──────────────────────
            Short signal bands replace full rings while preserving the
            foundation → build → grow → retain progression. */}
        {(["foundation", "build", "grow", "retain"] as const).map((phase) => {
          const r = RING_RADII[phase];
          const arc = PHASE_ARCS[phase];
          return (
            <path
              key={phase}
              d={arcPath(arc.start, arc.end, r)}
              fill="none"
              stroke={activePhases.includes(phase) ? "#c1121f" : "#7c7c7c"}
              strokeWidth={activePhases.includes(phase) ? 3.2 : 2.4}
              strokeLinecap="round"
              opacity={activePhases.includes(phase) ? 0.9 : 0.65}
              style={{ transition: "stroke 0.3s, opacity 0.3s" }}
            />
          );
        })}

        {/* ── Phase progression endpoints ───────────────── */}
        {(["foundation", "build", "grow", "retain"] as const).map((phase) => {
          const r = RING_RADII[phase];
          const arc = PHASE_ARCS[phase];
          const start = polar(arc.start, r);
          const end = polar(arc.end, r);
          const isActive = activePhases.includes(phase);

          return (
            <g key={`phase-marker-${phase}`}>
              <circle
                cx={f(start.x)}
                cy={f(start.y)}
                r={isActive ? 4 : 3}
                fill={isActive ? "#c1121f" : "#111111"}
                opacity={isActive ? 1 : 0.65}
              />
              <circle
                cx={f(end.x)}
                cy={f(end.y)}
                r={isActive ? 4 : 3}
                fill={isActive ? "#c1121f" : "#111111"}
                opacity={isActive ? 1 : 0.65}
              />
            </g>
          );
        })}

        {/* ── Phase ring labels (axis intersection, label sits just below arc) ── */}
        {(["foundation", "build", "grow", "retain"] as const).map((phase) => {
          const r = RING_RADII[phase];
          const isActive = activePhases.includes(phase);
          // Top of the ring = where vertical axis crosses
          const ringTopY = CY - r;
          return (
            <g key={phase}>
              {/* Small vertical tick straddling the ring/axis intersection */}
              <line
                x1={CX}
                y1={ringTopY - 6}
                x2={CX}
                y2={ringTopY + 6}
                stroke={isActive ? "#c1121f" : "black"}
                strokeWidth={1.8}
                opacity={isActive ? 0.95 : 0.7}
                style={{ transition: "stroke 0.3s, opacity 0.3s" }}
              />
              {/* Label just below the ring top, to the right of the axis */}
              <text
                x={CX + 9}
                y={ringTopY + 13}
                fontSize={11}
                fontFamily="inherit"
                fontWeight={600}
                letterSpacing={0.6}
                dominantBaseline="middle"
                fill={isActive ? "#c1121f" : "black"}
                opacity={isActive ? 1 : 0.72}
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
              stroke="#6b6b6b"
              strokeWidth={1}
              strokeDasharray="4 7"
              opacity={isDimmed ? 0.12 : 0.36}
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
              fill="rgba(193,18,31,0.18)"
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
              stroke="#555555"
              strokeWidth={1}
              strokeDasharray="4 6"
              strokeLinecap="round"
              opacity={0.5}
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
                  r={16}
                  fill="none"
                  stroke="#c1121f"
                  strokeWidth={1.8}
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
                  r: isSelected ? 9 : 7,
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
                fontSize={12.5}
                fontWeight={isSelected ? 700 : 600}
                fontFamily="inherit"
                fill={isSelected ? "#c1121f" : "#111"}
                opacity={isDimmed ? 0.38 : isSelected ? 1 : 0.9}
                style={{
                  pointerEvents: "none",
                  transition: "fill 0.25s, opacity 0.25s",
                }}
              >
                {node.svgLabel.map((line, i) => (
                  <tspan key={i} x={ll.x} dy={i === 0 ? 0 : 15}>
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
                fontSize={12}
                fontWeight={mask > 0 ? 700 : 500}
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
