"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DotsMap } from "./DotsMap";
import { getNudges, resolveGoal } from "./data/resolver";

const EASE = [0.22, 1, 0.36, 1] as const;
const WA_NUMBER = "94728282122";

function buildWaLink(headline: string, services: string[]): string {
  const text = `Hi! I'd like to start with the "${headline}" path.\n\nServices: ${services.join(", ")}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function GrowthPathMap() {
  const [mode, setMode] = useState<"single" | "combined">("single");
  const [mask, setMask] = useState(0);

  const resolved = mask ? resolveGoal(mask) : null;
  const phases = resolved?.phases ?? [];
  const hubLines = resolved?.hubLines ?? ["Your", "goal"];
  const nudges = mask ? getNudges(mask) : [];
  const selectedCount = resolved?.selectedNodes.length ?? 0;

  const handleNodeClick = useCallback(
    (bit: number) => {
      if (mode === "single") {
        setMask((previous) => (previous === bit ? 0 : bit));
      } else {
        setMask((previous) =>
          previous & bit ? previous & ~bit : previous | bit,
        );
      }
    },
    [mode],
  );

  const handleModeChange = (next: "single" | "combined") => {
    if (next === mode) return;

    if (next === "single" && mask) {
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

    setMask((previous) => previous | bit);
  };

  return (
    <div className="mt-10 flex flex-col gap-8 sm:mt-14">
      {/* ── Controls ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
            Choose your starting point
          </p>
          <p className="mt-1 text-base text-white">
            {mode === "single"
              ? "Pick the one area you want to start with."
              : "Pick every activity you want to combine."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Tabs
            value={mode}
            onValueChange={(value) => {
              if (value === "single" || value === "combined") {
                handleModeChange(value);
              }
            }}
          >
            <TabsList variant="line" className="gap-3">
              <TabsTrigger
                value="single"
                className="h-12 px-2 text-base text-white! hover:text-white! data-active:text-white!"
              >
                One Area
              </TabsTrigger>

              <TabsTrigger
                value="combined"
                className="h-12 px-2 text-base text-white! hover:text-white! data-active:text-white!"
              >
                Combined activities
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence>
            {mode === "combined" && mask !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <span>{selectedCount} selected</span>
                <span className="text-white/30">·</span>
                <button
                  type="button"
                  onClick={() => setMask(0)}
                  className="underline underline-offset-2 transition-colors hover:text-white"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Orbit tiles (full width, 2 cols desktop / 1 col mobile) ─── */}
      <DotsMap
        mask={mask}
        hubLines={hubLines}
        activePhases={phases}
        onNodeClick={handleNodeClick}
      />

      {/* ── Sticky summary dock ──────────────────────────────────────── */}
      <aside
        aria-label="Your selected path"
        className="sticky bottom-4 z-30 rounded-3xl border border-white/10 bg-[#111113]/90 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6"
      >
        <AnimatePresence>
          {nudges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 overflow-hidden pb-4"
            >
              {nudges.map((nudge) => (
                <button
                  key={nudge.addBit}
                  type="button"
                  onClick={() => handleNudgeAdd(nudge.addBit)}
                  title={nudge.message}
                  className="flex items-center gap-1.5 rounded-full border border-[#c1121f]/50 bg-[#c1121f]/10 px-4 py-2 text-sm text-red-200 transition-colors hover:border-[#c1121f] hover:bg-[#c1121f]/20 hover:text-white"
                >
                  <span className="text-brand" aria-hidden="true">↗</span>
                  {nudge.addLabel}
                  <span className="hidden text-red-200/60 md:inline">
                    — {nudge.message}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {resolved ? (
            <motion.div
              key={`selected-${mask}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8"
            >
              <div className="min-w-0">
                <p className="text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">
                  {resolved.panelHeadline}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {resolved.selectedNodes.map((node) => (
                    <span
                      key={node.bit}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/75"
                    >
                      {node.label}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={buildWaLink(
                  resolved.hubTitle,
                  resolved.selectedNodes.map((node) => node.label),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-[#c1121f] hover:text-white"
              >
                Start with this path
                <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8"
            >
              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                  A few actions. A shared direction.
                </p>
                <p className="mt-1 text-base leading-relaxed text-white/65">
                  Content builds interest. The website helps lead to a
                  conversation. Each element has its own purpose.
                </p>
              </div>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to discuss the scope of a project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-white/25 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                Let&apos;s discuss the scope.
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
