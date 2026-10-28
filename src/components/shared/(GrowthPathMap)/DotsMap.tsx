"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { NODES } from "./data/nodes";
import type { NodeDef, Phase } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DotsMapProps {
  mask: number;
  hubLines: string[];
  activePhases: Phase[];
  onNodeClick: (bit: number) => void;
}

interface MapNode extends NodeDef {
  number: string;
  displayLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const STAGES: readonly { id: Phase; label: string; y: number }[] = [
  { id: "foundation", label: "foundation", y: 112 },
  { id: "build", label: "build", y: 282 },
  { id: "grow", label: "grow", y: 452 },
  { id: "retain", label: "retain", y: 622 },
];

const NODE_POSITIONS: Record<
  string,
  Pick<MapNode, "number" | "displayLabel" | "x" | "y" | "width" | "height">
> = {
  idea: { number: "01", displayLabel: "Business Idea", x: 45, y: 80, width: 230, height: 64 },
  brand: { number: "02", displayLabel: "Brand Identity", x: 625, y: 80, width: 230, height: 64 },
  website: { number: "03", displayLabel: "Website", x: 625, y: 250, width: 230, height: 64 },
  social: { number: "04", displayLabel: "Social & Content", x: 45, y: 250, width: 230, height: 64 },
  ads: { number: "05", displayLabel: "Meta + Google Ads", x: 45, y: 420, width: 230, height: 64 },
  seo: { number: "06", displayLabel: "SEO", x: 625, y: 420, width: 230, height: 64 },
  followup: { number: "07", displayLabel: "Follow-up", x: 625, y: 590, width: 230, height: 64 },
};

const GRAPH_NODES: readonly MapNode[] = NODES.map((node) => ({
  ...node,
  ...NODE_POSITIONS[node.id],
}));

const CENTER_X = 450;
const RED = "#ff1f28";
const INACTIVE = "#323640";
const GRID = "#17191f";

function stageFor(node: MapNode) {
  return STAGES.find((stage) => stage.id === node.phase) ?? STAGES[0];
}

function branchPath(node: MapNode): string {
  const stage = stageFor(node);
  const isLeft = node.x < CENTER_X;
  const startX = isLeft ? node.x + node.width : node.x;
  const endX = isLeft ? CENTER_X - 30 : CENTER_X + 30;
  const y = node.y + node.height / 2;
  const elbowX = isLeft ? CENTER_X - 105 : CENTER_X + 105;
  return `M ${startX} ${y} H ${elbowX} V ${stage.y} H ${endX}`;
}

function GridBackground() {
  return (
    <defs>
      <pattern id="growth-map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GRID} strokeWidth="1" />
      </pattern>
      <filter id="growth-map-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function NodeCard({
  node,
  isSelected,
  isDimmed,
  onNodeClick,
}: {
  node: MapNode;
  isSelected: boolean;
  isDimmed: boolean;
  onNodeClick: (bit: number) => void;
}) {
  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`${isSelected ? "Deselect" : "Select"} ${node.displayLabel}`}
      onClick={() => onNodeClick(node.bit)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNodeClick(node.bit);
        }
      }}
      initial={false}
      animate={{ opacity: isDimmed ? 0.3 : 1 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: "pointer", outline: "none" }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="10"
        fill={isSelected ? "#260d10" : "#121419"}
        stroke={isSelected ? RED : INACTIVE}
        strokeWidth={isSelected ? 2 : 1}
      />
      <circle
        cx={node.x + node.width - 16}
        cy={node.y + 16}
        r="3.5"
        fill={isSelected ? RED : "#454b58"}
      />
      <text
        x={node.x + 16}
        y={node.y + 19}
        fill={isSelected ? "#ff7378" : "#858c9b"}
        fontSize="9"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.08em"
      >
        {node.number}
      </text>
      <text
        x={node.x + 16}
        y={node.y + 45}
        fill="#f1f2f5"
        fontSize={node.displayLabel.length > 16 ? "14" : "16"}
        fontFamily="inherit"
        fontWeight="500"
      >
        {node.displayLabel}
      </text>
    </motion.g>
  );
}

export function DotsMap({
  mask,
  hubLines,
  activePhases,
  onNodeClick,
}: DotsMapProps) {
  const [openNodeBit, setOpenNodeBit] = useState<number | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#090a0d]">
      <svg
        viewBox="0 0 900 850"
        className="block h-auto w-full select-none"
        role="img"
        aria-label="Interactive Uthrix growth path journey — explore foundation, build, grow, and retain"
      >
        <GridBackground />
        <rect width="900" height="720" fill="url(#growth-map-grid)" />

        <text x="34" y="34" fill="#6d7482" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">
          THE UTHRIX GROWTH JOURNEY
        </text>

        <path
          d={`M ${CENTER_X} 38 V ${STAGES[STAGES.length - 1].y}`}
          fill="none"
          stroke="#343944"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
        <path
          d={`M ${CENTER_X} 38 V ${STAGES[STAGES.length - 1].y}`}
          fill="none"
          stroke={mask ? RED : "#8a3035"}
          strokeWidth="2"
          opacity={mask ? 1 : 0.55}
          filter={mask ? "url(#growth-map-glow)" : undefined}
        />

        {GRAPH_NODES.map((node) => {
          const isSelected = (mask & node.bit) !== 0;
          return (
            <path
              key={`branch-${node.bit}`}
              d={branchPath(node)}
              fill="none"
              stroke={isSelected ? RED : INACTIVE}
              strokeWidth={isSelected ? 2 : 1}
              strokeDasharray={isSelected ? undefined : "2 7"}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={mask !== 0 && !isSelected ? 0.2 : isSelected ? 1 : 0.8}
            />
          );
        })}

        {STAGES.map((stage, index) => {
          const isActive = activePhases.includes(stage.id);
          const isLast = index === STAGES.length - 1;
          return (
            <g key={stage.id}>
              <circle
                cx={CENTER_X}
                cy={stage.y}
                r="31"
                fill="#090a0d"
                stroke={isActive ? RED : "#555b68"}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <circle
                cx={CENTER_X}
                cy={stage.y}
                r="7"
                fill={isActive ? RED : "#737b89"}
                filter={isActive ? "url(#growth-map-glow)" : undefined}
              />
              <text
                x={CENTER_X + 46}
                y={stage.y + 4}
                fill={isActive ? "#f1f2f5" : "#777f8d"}
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.12em"
              >
                {stage.label}
              </text>
              {!isLast && (
                <circle
                  cx={CENTER_X}
                  cy={stage.y + 85}
                  r="3"
                  fill={activePhases.includes(STAGES[index + 1].id) ? RED : "#4b515d"}
                />
              )}
            </g>
          );
        })}

        <path
          d={`M ${CENTER_X} ${STAGES[STAGES.length - 1].y + 31} V 716`}
          fill="none"
          stroke={mask ? RED : "#4b515d"}
          strokeWidth="1.5"
          strokeDasharray="3 8"
          strokeLinecap="round"
          opacity={mask ? 1 : 0.8}
        />
        <circle
          cx={CENTER_X}
          cy="716"
          r="3"
          fill={mask ? RED : "#737b89"}
        />

        <motion.g
          key={hubLines.join("|")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <circle
            cx={CENTER_X}
            cy="770"
            r="52"
            fill="#14161c"
            stroke={mask ? RED : "#555b68"}
            strokeWidth={mask ? 2 : 1.5}
            filter={mask ? "url(#growth-map-glow)" : undefined}
          />
          <circle
            cx={CENTER_X}
            cy="770"
            r="40"
            fill="none"
            stroke={mask ? RED : "#343944"}
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
          <circle cx={CENTER_X - 30} cy="740" r="4" fill={mask ? RED : "#737b89"} />
          <text
            x={CENTER_X}
            y="760"
            textAnchor="middle"
            fill="#858c9c"
            fontSize="10"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.14em"
          >
            YOUR GOAL
          </text>
          {hubLines.map((line, index) => (
            <text
              key={line + index}
              x={CENTER_X}
              y={780 + index * 16}
              textAnchor="middle"
              fill="#f4f5f7"
              fontSize={hubLines.length > 1 ? "15" : "17"}
              fontFamily="inherit"
              fontWeight="500"
            >
              {line}
            </text>
          ))}
        </motion.g>

        {GRAPH_NODES.map((node) => (
          <NodeCard
            key={node.bit}
            node={node}
            isSelected={(mask & node.bit) !== 0}
            isDimmed={mask !== 0 && (mask & node.bit) === 0}
            onNodeClick={onNodeClick}
          />
        ))}
      </svg>

      {GRAPH_NODES.map((node) => {
        const isSelected = (mask & node.bit) !== 0;
        return (
          <Popover
            key={`popover-${node.bit}`}
            open={openNodeBit === node.bit && isSelected}
            onOpenChange={(open) => setOpenNodeBit(open ? node.bit : null)}
          >
            <PopoverTrigger
              type="button"
              aria-label={`${isSelected ? "Unselect" : "Select"} ${node.displayLabel}`}
              onClick={(event) => {
                event.stopPropagation();
                onNodeClick(node.bit);
                setOpenNodeBit(isSelected ? null : node.bit);
              }}
              className="absolute rounded-[10px] border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1f28]"
              style={{
                left: `${(node.x / 900) * 100}%`,
                top: `${(node.y / 850) * 100}%`,
                width: `${(node.width / 900) * 100}%`,
                height: `${(node.height / 850) * 100}%`,
              }}
            >
              <span className="sr-only">{node.displayLabel}</span>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              sideOffset={16}
              align="end"
              className="bg-background text-foreground"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-5">
                  <PopoverTitle className="text-black!">{node.label}</PopoverTitle>
                  <span className="shrink-0 pt-1 font-mono text-xs tracking-[0.18em] text-foreground/45">
                    {node.number}
                  </span>
                </div>
                <PopoverDescription className="text-base leading-relaxed text-foreground/70">
                  {node.summary}
                </PopoverDescription>
                <div className="border-t border-foreground/15 pt-4">
                  <p className="text-sm leading-relaxed text-foreground/50">{node.why}</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
