export type Phase = "foundation" | "build" | "grow" | "retain";

export interface NodeDef {
  /** Bitmask power-of-2 identifier: 1 | 2 | 4 | 8 | 16 | 32 | 64 */
  bit: number;
  id: string;
  /** Full label used in panel copy */
  label: string;
  /** Lines drawn in the SVG (may wrap long labels) */
  svgLabel: string[];
  /** Degrees clockwise from north (top = 0°) */
  angle: number;
  /** SVG distance from center for this node's ring */
  ringR: number;
  phase: Phase;
  /** Brief "why" caption used in combined story */
  why: string;
  summary: string;
  /** Canonical route for starting directly with this service. */
  route: `/${string}`;
}

export interface ResolvedGoal {
  /** Short title shown inside the hub circle */
  hubTitle: string;
  /** Pre-wrapped lines for the hub (max ~11 chars each) */
  hubLines: string[];
  /** Longer headline shown in the panel */
  panelHeadline: string;
  phases: Phase[];
  selectedNodes: NodeDef[];
}

export interface Nudge {
  message: string;
  addBit: number;
  addLabel: string;
}
