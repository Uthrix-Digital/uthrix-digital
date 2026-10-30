import { NODES } from "./nodes";
import type { NodeDef, Nudge, Phase, ResolvedGoal } from "../types";

/* ── Hub-title line wrapper ──────────────────────────────────────────────── */
function wrapTitle(title: string, max = 11): string[] {
  if (title.length <= max) return [title];
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (test.length <= max) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* ── Tier 1 — single-node titles (7) ────────────────────────────────────── */
const T1: Record<number, { hub: string; headline: string }> = {
   1: { hub: "Start legally",  headline: "Launch your business the right way" },
   2: { hub: "Stand out",      headline: "Look credible and memorable from day one" },
   4: { hub: "Get online",     headline: "A site that turns visitors into enquiries" },
   8: { hub: "Be seen",        headline: "Stay visible and trusted on social media" },
  16: { hub: "Get leads",      headline: "Reach ready-to-buy customers this month" },
  32: { hub: "Get found",      headline: "Show up when people search for you" },
  64: { hub: "Keep them",      headline: "Turn enquiries into repeat customers" },
};

/* ── Tier 2 — curated bundles (8 exact matches) ──────────────────────────── */
const T2: Record<number, string> = {
  [2  | 4                  ]: "Look pro online",
  [4  | 16                 ]: "Fast leads",
  [4  | 32                 ]: "Found on Google",
  [16 | 32                 ]: "Found everywhere",
  [8  | 16                 ]: "Grow on Meta",
  [2  | 4  | 8             ]: "Trusted presence",
  [2  | 4  | 16 | 32 | 64 ]: "Fill more bookings",
  [1  | 2  | 4  | 8  | 16 | 32 | 64]: "Zero to growing",
};

/* ── Phase helpers ───────────────────────────────────────────────────────── */
/** Phase bitmask: bit1=foundation, bit2=build, bit4=grow, bit8=retain */
function phaseMask(sel: number): number {
  let m = 0;
  if (sel & (1 | 2))   m |= 1;
  if (sel & (4 | 8))   m |= 2;
  if (sel & (16 | 32)) m |= 4;
  if (sel & 64)        m |= 8;
  return m;
}

export function activePhases(sel: number): Phase[] {
  const p: Phase[] = [];
  if (sel & (1 | 2))   p.push("foundation");
  if (sel & (4 | 8))   p.push("build");
  if (sel & (16 | 32)) p.push("grow");
  if (sel & 64)        p.push("retain");
  return p;
}

/* ── Tier 3 — phase-pattern titles (15) ─────────────────────────────────── */
// Key = phaseMask result (1–15); F=1, B=2, G=4, R=8
const T3: Record<number, string> = {
   1: "Launch ready",
   2: "Online ready",
   4: "More customers",
   8: "Keep customers",
   3: "Launch online",
   5: "Launch and promote",
   9: "Start strong",
   6: "Found and enquired",
  10: "Convert and keep",
  12: "Click to customer",
   7: "Launch and grow",
  11: "Launch to serve",
  13: "Promote and keep",
  14: "Full-funnel growth",
  15: "Complete growth system",
};

/* ── Main resolver ───────────────────────────────────────────────────────── */
export function resolveGoal(mask: number): ResolvedGoal | null {
  if (!mask) return null;

  const selectedNodes: NodeDef[] = NODES.filter(n => (mask & n.bit) !== 0) as NodeDef[];
  const phases = activePhases(mask);

  /* Tier 1 */
  if (T1[mask]) {
    const { hub, headline } = T1[mask];
    return {
      hubTitle: hub,
      hubLines: wrapTitle(hub),
      panelHeadline: headline,
      phases,
      selectedNodes,
    };
  }

  /* Tier 2 */
  if (T2[mask]) {
    const hub = T2[mask];
    const names = selectedNodes.map(n => n.label).join(", ");
    return {
      hubTitle: hub,
      hubLines: wrapTitle(hub),
      panelHeadline: `${hub}: ${names}`,
      phases,
      selectedNodes,
    };
  }

  /* Tier 3 */
  const pm = phaseMask(mask);
  const hub = T3[pm] ?? "Your path";
  const names = selectedNodes.map(n => n.label).join(", ");
  return {
    hubTitle: hub,
    hubLines: wrapTitle(hub),
    panelHeadline: `${hub}: ${names}`,
    phases,
    selectedNodes,
  };
}

/* ── Gentle nudges ───────────────────────────────────────────────────────── */
export function getNudges(mask: number): Nudge[] {
  const out: Nudge[] = [];
  const has = (b: number) => (mask & b) !== 0;

  if ((has(16) || has(32)) && !has(4))
    out.push({
      message: "Ads work best with a website to send traffic to.",
      addBit: 4,
      addLabel: "Add Website",
    });

  if ((has(4) || has(8)) && !has(2))
    out.push({
      message: "A brand identity keeps everything consistent.",
      addBit: 2,
      addLabel: "Add Brand Identity",
    });

  if (has(64) && !has(4) && !has(8) && !has(16) && !has(32))
    out.push({
      message: "Follow-up works best when enquiries are already flowing in.",
      addBit: 16,
      addLabel: "Add a lead source",
    });

  return out;
}

/* ── Pre-compute all 127 masks at startup ────────────────────────────────── */
if (typeof globalThis !== "undefined" && process.env.NODE_ENV === "development") {
  // Defer past hydration boundary
  setTimeout(() => {
    let t1 = 0, t2 = 0, t3 = 0;
    for (let m = 1; m <= 127; m++) {
      if (T1[m]) t1++;
      else if (T2[m]) t2++;
      else t3++;
    }
    console.log(`[GrowthPathMap] Resolver ready — T1:${t1} T2:${t2} T3:${t3} (total:${t1+t2+t3})`);
  }, 0);
}

