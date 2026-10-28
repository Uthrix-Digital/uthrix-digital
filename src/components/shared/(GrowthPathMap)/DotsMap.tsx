"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { NODES } from "./data/nodes";
import type { NodeDef, Phase } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RadarMapProps {
  mask: number;
  hubLines: string[];
  activePhases: Phase[];
  onNodeClick: (bit: number) => void;
}

interface GraphNode extends NodeDef {
  number: string;
  displayLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const NODE_POSITIONS: Record<
  string,
  Pick<GraphNode, "number" | "displayLabel" | "x" | "y" | "width" | "height">
> = {
  idea: {
    number: "01",
    displayLabel: "Strategy",
    x: 405,
    y: 20,
    width: 190,
    height: 68,
  },
  brand: {
    number: "02",
    displayLabel: "Branding",
    x: 770,
    y: 105,
    width: 190,
    height: 68,
  },
  website: {
    number: "03",
    displayLabel: "Website",
    x: 770,
    y: 330,
    width: 190,
    height: 68,
  },
  social: {
    number: "04",
    displayLabel: "Social media",
    x: 770,
    y: 555,
    width: 190,
    height: 68,
  },
  ads: {
    number: "05",
    displayLabel: "Meta + Google Ads",
    x: 40,
    y: 555,
    width: 190,
    height: 68,
  },
  seo: {
    number: "06",
    displayLabel: "SEO",
    x: 40,
    y: 330,
    width: 190,
    height: 68,
  },
  followup: {
    number: "07",
    displayLabel: "Follow-up",
    x: 40,
    y: 105,
    width: 190,
    height: 68,
  },
};

const GRAPH_NODES: readonly GraphNode[] = NODES.map((node) => ({
  ...node,
  ...NODE_POSITIONS[node.id],
}));

const CENTER = { x: 405, y: 232, width: 190, height: 185 };
const RED = "#ff1f28";
const INACTIVE = "#2c303c";
const GRID = "#17191f";

function connectorPath(node: GraphNode): string {
  const isLeft = node.x < CENTER.x;
  const isTop = node.y < CENTER.y;
  const nodeX = isLeft ? node.x + node.width : node.x;
  const nodeY = node.y + node.height / 2;
  const centerX = isLeft ? CENTER.x : CENTER.x + CENTER.width;
  const elbowX = isLeft ? centerX - 70 : centerX + 70;

  if (node.y < CENTER.y || node.y > CENTER.y + CENTER.height) {
    const verticalStart = isTop ? node.y + node.height : node.y;
    const verticalEnd = isTop ? CENTER.y : CENTER.y + CENTER.height;
    const startX = node.x + node.width / 2;
    return `M ${startX} ${verticalStart} H ${elbowX} V ${verticalEnd} H ${centerX}`;
  }

  return `M ${nodeX} ${nodeY} H ${centerX}`;
}

function GridBackground() {
  return (
    <defs>
      <pattern id="growth-map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GRID} strokeWidth="1" />
      </pattern>
    </defs>
  );
}

function NodeCard({
  node,
  isSelected,
  isDimmed,
  onNodeClick,
}: {
  node: GraphNode;
  isSelected: boolean;
  isDimmed: boolean;
  onNodeClick: (bit: number) => void;
}) {
  const stroke = isSelected ? RED : INACTIVE;
  const fill = isSelected ? "#1b0d10" : "#121419";

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
      animate={{ opacity: isDimmed ? 0.34 : 1 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: "pointer", outline: "none" }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="10"
        fill={fill}
        stroke={stroke}
        strokeWidth={isSelected ? 1.5 : 1}
      />
      <circle
        cx={node.x + node.width - 15}
        cy={node.y + 15}
        r="3.5"
        fill={isSelected ? RED : "#3c424e"}
      />
      <text
        x={node.x + 15}
        y={node.y + 18}
        fill={isSelected ? "#ff6d72" : "#8a91a1"}
        fontSize="9"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.08em"
      >
        {node.number}
      </text>
      <text
        x={node.x + 15}
        y={node.y + 48}
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
  onNodeClick,
}: RadarMapProps) {
  const [openNodeBit, setOpenNodeBit] = useState<number | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#090a0d]">
      <svg
        viewBox="0 0 1000 650"
        className="block h-auto w-full select-none"
        role="img"
        aria-label="Interactive Uthrix growth path map — click a service to explore"
      >
        <GridBackground />
        <rect width="1000" height="650" fill="url(#growth-map-grid)" />

        {GRAPH_NODES.map((node) => {
          const isSelected = (mask & node.bit) !== 0;
          const isDimmed = mask !== 0 && !isSelected;

          return (
            <path
              key={`connector-${node.bit}`}
              d={connectorPath(node)}
              fill="none"
              stroke={isSelected ? RED : INACTIVE}
              strokeWidth={isSelected ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isDimmed ? 0.25 : isSelected ? 1 : 0.9}
            />
          );
        })}

        {GRAPH_NODES.map((node) => (
          <circle
            key={`port-${node.bit}`}
            cx={node.x < CENTER.x ? CENTER.x : CENTER.x + CENTER.width}
            cy={
              node.y < CENTER.y
                ? CENTER.y
                : node.y > CENTER.y + CENTER.height
                  ? CENTER.y + CENTER.height
                  : node.y + node.height / 2
            }
            r="3"
            fill={(mask & node.bit) !== 0 ? RED : "#383d49"}
            opacity={mask !== 0 && (mask & node.bit) === 0 ? 0.35 : 1}
          />
        ))}

        <rect
          x={CENTER.x}
          y={CENTER.y}
          width={CENTER.width}
          height={CENTER.height}
          rx="16"
          fill="#14161c"
          stroke="#303541"
          strokeWidth="1.5"
        />
        <rect
          x={CENTER.x + 14}
          y={CENTER.y + 14}
          width={CENTER.width - 28}
          height={CENTER.height - 28}
          rx="11"
          fill="none"
          stroke={mask ? RED : "#343944"}
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
        <circle cx={CENTER.x + 25} cy={CENTER.y + 25} r="4" fill={mask ? RED : "#424855"} />
        <text
          x={CENTER.x + CENTER.width / 2}
          y={CENTER.y + 80}
          textAnchor="middle"
          fill="#858c9c"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          core
        </text>
        <motion.g
          key={hubLines.join("|")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {hubLines.map((line, index) => (
            <text
              key={line + index}
              x={CENTER.x + CENTER.width / 2}
              y={CENTER.y + 112 + index * 29}
              textAnchor="middle"
              fill="#f4f5f7"
              fontSize={hubLines.length > 1 ? "25" : "28"}
              fontFamily="inherit"
              fontWeight="400"
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
            onOpenChange={(open) => {
              setOpenNodeBit(open ? node.bit : null);
            }}
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
                left: `${(node.x / 1000) * 100}%`,
                top: `${(node.y / 650) * 100}%`,
                width: `${(node.width / 1000) * 100}%`,
                height: `${(node.height / 650) * 100}%`,
              }}
            >
              <span className="sr-only">{node.displayLabel}</span>
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
