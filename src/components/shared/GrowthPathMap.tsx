"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "one-area" | "combined";

const EASE = [0.22, 1, 0.36, 1] as const;

export function GrowthPathMap() {
  const [activeTab, setActiveTab] = useState<Tab>("one-area");

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-sm font-medium tracking-[-0.01em] text-black">
          Choose your starting point
        </p>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 mt-3">
          <TabButton
            label="One Area"
            isActive={activeTab === "one-area"}
            onClick={() => setActiveTab("one-area")}
          />
          <TabButton
            label="Combined activities"
            isActive={activeTab === "combined"}
            onClick={() => setActiveTab("combined")}
          />
        </div>
      </div>

      {/* SVG Map */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative w-full overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/Uthrix growth path map preview.svg"
          alt="Uthrix growth path map — visualises how services connect to your goal"
          className="w-full h-auto"
          draggable={false}
        />
      </motion.div>

      {/* Divider */}
      <hr className="border-black/10" />

      {/* Footer copy */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-black tracking-[-0.01em]">
          A few actions. A shared direction.
        </p>
        <p className="text-[13px] leading-relaxed text-black/60">
          Content builds interest. The website helps lead to a conversation.
          Each element has its own purpose.
        </p>
      </div>

      {/* CTA */}
      <a
        href="#contact"
        className="inline-flex w-fit items-center justify-center rounded-full border border-black/20 bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-all hover:bg-black hover:text-white hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        Let&apos;s discuss the scope.
      </a>
    </div>
  );
}

/* ─── Sub-component ─────────────────────────────────────────────────────────── */

function TabButton({
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
      className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
        isActive
          ? "bg-black text-white"
          : "bg-transparent text-black/50 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}
