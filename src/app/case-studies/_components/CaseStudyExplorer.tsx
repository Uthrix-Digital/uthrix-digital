"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CaseStudyCard } from "@/components/shared/(CaseStudies)/CaseStudyCard";
import {
  isCaseStudyCategoryId,
  type CaseStudy,
  type CaseStudyCategory,
  type CaseStudyCategoryId,
} from "@/config/caseStudies";

interface CaseStudyExplorerProps {
  studies: CaseStudy[];
  categories: CaseStudyCategory[];
}

type Filter = CaseStudyCategoryId | "all";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Filterable case study grid. The active filter lives in the URL
 * (`?category=web`) so menus, ads and shared links can open a single
 * discipline.
 */
export function CaseStudyExplorer({ studies, categories }: CaseStudyExplorerProps) {
  const param = useSearchParams().get("category");
  const active: Filter = isCaseStudyCategoryId(param) ? param : "all";

  const visible =
    active === "all" ? studies : studies.filter((s) => s.category === active);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All work", count: studies.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.label,
      count: studies.filter((s) => s.category === category.id).length,
    })),
  ];

  const select = (id: Filter) => {
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
  };

  const summary =
    active === "all"
      ? null
      : categories.find((category) => category.id === active)?.summary;

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter case studies by discipline"
          className="-mx-[clamp(1.25rem,5vw,5rem)] flex gap-2 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {filters.map((filter) => {
            const isActive = filter.id === active;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => select(filter.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.08em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 bg-background hover:border-foreground"
                }`}
              >
                {filter.label}
                <span
                  className={`font-mono text-xs font-medium ${
                    isActive ? "text-background/60" : "text-muted-foreground"
                  }`}
                >
                  {String(filter.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="text-sm text-muted-foreground lg:max-w-sm lg:text-right">
          {summary ?? `Showing all ${studies.length} case studies.`}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          {visible.map((study, index) => (
            <li key={study.slug} className={index === 0 ? "md:col-span-2" : ""}>
              <CaseStudyCard
                study={study}
                index={index}
                layout={index === 0 ? "wide" : "stacked"}
                priority={index === 0}
              />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
