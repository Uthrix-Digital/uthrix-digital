"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { RadarMap } from "./RadarMap";
import { getNudges, resolveGoal } from "./data/resolver";
import { AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EASE = [0.22, 1, 0.36, 1] as const;
const WA_NUMBER = "94728282122";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function buildWaLink(headline: string, services: string[]): string {
  const text = `Hi! I'd like to start with the "${headline}" path.\n\nServices: ${services.join(", ")}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function GrowthPathMap() {
  const [mode, setMode] = useState<"single" | "combined">("single");
  const [mask, setMask] = useState(0);

  /* ── Derived state ─────────────────────────────────────────────────────── */
  const resolved = mask ? resolveGoal(mask) : null;
  const phases = resolved?.phases ?? [];
  const hubLines = resolved?.hubLines ?? ["Your", "goal"];
  const nudges = mask ? getNudges(mask) : [];
  const selectedCount = resolved?.selectedNodes.length ?? 0;

  /* ── Selection handlers ────────────────────────────────────────────────── */
  const handleNodeClick = useCallback(
    (bit: number) => {
      if (mode === "single") {
        // Toggle: click same node deselects; click different node replaces
        setMask((prev) => (prev === bit ? 0 : bit));
      } else {
        // Combined: toggle bit in/out
        setMask((prev) => (prev & bit ? prev & ~bit : prev | bit));
      }
    },
    [mode],
  );

  const handleModeChange = (next: "single" | "combined") => {
    if (next === mode) return;
    if (next === "single" && mask) {
      // Keep only the lowest-bit selected node (earliest in journey)
      setMask(mask & -mask);
    }
    setMode(next);
  };

  const handleNudgeAdd = (bit: number) => {
  const isNewItem = (mask & bit) === 0;
  const willHaveMultipleItems = mask !== 0 && isNewItem;

  if (willHaveMultipleItems) {
    setMode("combined");
  }

  setMask((prev) => prev | bit);
};

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-black tracking-[-0.01em]">
          Choose your starting point
        </p>

        {/* Mode tabs */}
        <div className="flex items-center gap-1 mt-3">
          <Tabs
            value={mode}
            onValueChange={(value) => {
              if (value === "single" || value === "combined") {
                handleModeChange(value);
              }
            }}
          >
            <TabsList variant="line">
              <TabsTrigger value="single">One Area</TabsTrigger>
              <TabsTrigger value="combined">Combined activities</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* ── Radar ─────────────────────────────────────────────────────────── */}
      <RadarMap
        mask={mask}
        hubLines={hubLines}
        activePhases={phases}
        onNodeClick={handleNodeClick}
      />

      {/* ── Combined-mode chip ────────────────────────────────────────────── */}
      {mode === "combined" && mask !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-[12px] text-black/45">
            {selectedCount} selected
          </span>
          <span className="text-black/20">·</span>
          <button
            type="button"
            onClick={() => setMask(0)}
            className="text-[12px] text-black/40 underline underline-offset-2 hover:text-black transition-colors"
          >
            Clear
          </button>
        </motion.div>
      )}

      {/* ── Nudge chips ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {nudges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {nudges.map((nudge) => (
              <button
                key={nudge.addBit}
                type="button"
                onClick={() => handleNudgeAdd(nudge.addBit)}
                className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11.5px] text-black/65 transition-all hover:border-amber-400 hover:text-black"
              >
                <span className="text-amber-500">↗</span>
                {nudge.addLabel}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <hr className="border-black/10" />

      {/* ── Dynamic panel ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {resolved ? (
          /* ── Selected state ────────────────────────────────────────────── */
          <motion.div
            key={`sel-${mask}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col gap-3"
          >
            {/* Headline */}
            <p className="text-[13px] font-semibold text-black leading-snug tracking-[-0.01em]">
              {resolved.panelHeadline}
            </p>

            {/* Service tags */}
            <div className="flex flex-wrap gap-1.5">
              {resolved.selectedNodes.map((n) => (
                <span
                  key={n.bit}
                  className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] text-black/55"
                >
                  {n.label}
                </span>
              ))}
            </div>

            {/* Story (single node only) */}
            {resolved.selectedNodes.length === 1 && (
              <p className="text-[12.5px] leading-relaxed text-black/55">
                {resolved.selectedNodes[0].summary}
              </p>
            )}

            {/* Combined story: adjacent-pair "why" captions */}
            {resolved.selectedNodes.length > 1 && (
              <ul className="flex flex-col gap-1">
                {resolved.selectedNodes.slice(0, -1).map((n, i) => {
                  const next = resolved.selectedNodes[i + 1];
                  return (
                    <li
                      key={n.bit}
                      className="flex items-start gap-1.5 text-[12px] text-black/50"
                    >
                      <span className="mt-0.5 text-[10px] text-black/30">
                        →
                      </span>
                      <span>
                        <strong className="font-medium text-black/65">
                          {n.label}
                        </strong>{" "}
                        {/* Use feedsInto "why" copy if they are adjacent in journey, else bridge */}
                        {next.bit === n.bit * 2
                          ? n.why
                          : `connects to ${next.label}.`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* CTA */}
            <a
              href={buildWaLink(
                resolved.hubTitle,
                resolved.selectedNodes.map((n) => n.label),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#c1121f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Start with this path
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        ) : (
          /* ── Idle state ────────────────────────────────────────────────── */
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            <p className="text-[13px] font-semibold text-black tracking-[-0.01em]">
              A few actions. A shared direction.
            </p>
            <p className="text-[13px] leading-relaxed text-black/60">
              Content builds interest. The website helps lead to a conversation.
              Each element has its own purpose.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to discuss the scope of a project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center rounded-full border border-black/20 bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-all hover:bg-black hover:text-white hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Let&apos;s discuss the scope.
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── TabButton ───────────────────────────────────────────────────────────── */
function TabShift({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
        isActive
          ? "bg-black text-white"
          : "bg-transparent text-black/50 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

<Suspense
  fallback={
    <div
      className="min-h-130 w-full animate-pulse rounded-2xl bg-black/3"
      aria-label="Loading growth path map"
    />
  }
>
  <GrowthPathMap />
</Suspense>;
