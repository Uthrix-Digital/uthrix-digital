"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarMap } from "./RadarMap";
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
    <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:gap-12">
      <section
        aria-label="Growth path radar"
        className="min-w-0 rounded-3xl bg-white p-4 sm:p-8"
      >
        <RadarMap
          mask={mask}
          hubLines={hubLines}
          activePhases={phases}
          onNodeClick={handleNodeClick}
        />
      </section>

      <aside className="min-w-0 rounded-3xl bg-foreground p-6 text-black sm:p-8 lg:sticky lg:top-8">
        <p className="type-h6 tracking-[-0.01em]">
          Choose your starting point
        </p>

        <div className="mt-3">
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

        <AnimatePresence>
          {nudges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex flex-wrap gap-2 overflow-hidden"
            >
              {nudges.map((nudge) => (
                <button
                  key={nudge.addBit}
                  type="button"
                  onClick={() => handleNudgeAdd(nudge.addBit)}
                  className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11.5px] text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 hover:text-red-900"
                >
                  <span className="text-brand">↗</span>
                  {nudge.addLabel}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {mode === "combined" && mask !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center gap-2"
          >
            <span className="text-xs text-black/45">
              {selectedCount} selected
            </span>
            <span className="text-black/20">·</span>
            <button
              type="button"
              onClick={() => setMask(0)}
              className="text-xs text-black/40 underline underline-offset-2 transition-colors hover:text-black"
            >
              Clear
            </button>
          </motion.div>
        )}

        <div className="mt-8 border-t border-black/10 pt-6">
          <AnimatePresence mode="wait">
            {resolved ? (
              <motion.div
                key={`selected-${mask}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col gap-3"
              >
                <p className="text-[13px] font-semibold leading-snug tracking-[-0.01em]">
                  {resolved.panelHeadline}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {resolved.selectedNodes.map((node) => (
                    <span
                      key={node.bit}
                      className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] text-black/55"
                    >
                      {node.label}
                    </span>
                  ))}
                </div>

                {resolved.selectedNodes.length === 1 && (
                  <p className="text-[12.5px] leading-relaxed text-black/55">
                    {resolved.selectedNodes[0].summary}
                  </p>
                )}

                <a
                  href={buildWaLink(
                    resolved.hubTitle,
                    resolved.selectedNodes.map((node) => node.label),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#c1121f]"
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
                className="flex flex-col gap-3"
              >
                <p className="text-[13px] font-semibold tracking-[-0.01em]">
                  A few actions. A shared direction.
                </p>
                <p className="text-[13px] leading-relaxed text-black/60">
                  Content builds interest. The website helps lead to a
                  conversation. Each element has its own purpose.
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to discuss the scope of a project.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center justify-center rounded-full border border-black/20 bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Let&apos;s discuss the scope.
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
