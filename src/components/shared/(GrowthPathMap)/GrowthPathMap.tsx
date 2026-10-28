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
    <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:gap-12">
      <section
        aria-label="Growth path signal map"
        className="rounded-2xl bg-foreground"
      >
        <DotsMap
          mask={mask}
          hubLines={hubLines}
          activePhases={phases}
          onNodeClick={handleNodeClick}
        />
      </section>

      <aside className="min-w-0 h-fit rounded-3xl border border-white/10 bg-[#111113] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-8 lg:sticky lg:top-48">
        <p className="text-white text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          Choose your starting point
        </p>

        <div className="mt-5">
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
                className="text-white/60 h-10 px-2 text-base hover:text-white data-active:text-white"
              >
                One Area
              </TabsTrigger>
              <TabsTrigger
                value="combined"
                className="text-white/60 h-10 px-2 text-base hover:text-white data-active:text-white"
              >
                Combined activities
              </TabsTrigger>
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
                  className="flex items-center gap-1.5 rounded-full border border-[#c1121f]/50 bg-[#c1121f]/10 px-4 py-2 text-sm text-red-200 transition-colors hover:border-[#c1121f] hover:bg-[#c1121f]/20 hover:text-white"
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
            <span className="text-sm text-white/60">
              {selectedCount} selected
            </span>
            <span className="text-white/30">·</span>
            <button
              type="button"
              onClick={() => setMask(0)}
              className="text-sm text-white/60 underline underline-offset-2 transition-colors hover:text-white"
            >
              Clear
            </button>
          </motion.div>
        )}

        <div className="mt-8 border-t border-white/15 pt-7">
          <AnimatePresence mode="wait">
            {resolved ? (
              <motion.div
                key={`selected-${mask}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col gap-4"
              >
                <p className="text-xl font-semibold leading-snug tracking-[-0.02em]">
                  {resolved.panelHeadline}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {resolved.selectedNodes.map((node) => (
                    <span
                      key={node.bit}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/75"
                    >
                      {node.label}
                    </span>
                  ))}
                </div>

                {resolved.selectedNodes.length === 1 && (
                  <p className="text-base leading-relaxed text-white/65">
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
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-[#c1121f] hover:text-white"
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
                className="flex flex-col gap-4"
              >
                <p className="text-xl font-semibold tracking-[-0.02em]">
                  A few actions. A shared direction.
                </p>
                <p className="text-base leading-relaxed text-white/65">
                  Content builds interest. The website helps lead to a
                  conversation. Each element has its own purpose.
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to discuss the scope of a project.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center justify-center rounded-full border border-white/25 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-black"
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
