"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CaseStudyCard } from "@/components/shared/(CaseStudies)/CaseStudyCard";
import {
  CASE_STUDY_CATEGORIES,
  CASE_STUDY_CATEGORY_ORDER,
  CASE_STUDY_GROUPS,
  isCaseStudyCategoryId,
  isCaseStudyGroupId,
  type CaseStudy,
  type CaseStudyCategoryId,
  type CaseStudyGroupId,
} from "@/config/caseStudies";

interface CaseStudyExplorerProps {
  studies: CaseStudy[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Lets a pill row scroll sideways on phones and wrap from `sm` up. */
const PILL_ROW =
  "-mx-[clamp(1.25rem,5vw,5rem)] flex gap-2 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0";

interface FilterPillProps {
  label: string;
  count: number;
  isActive: boolean;
  /** `sub` is the smaller pill used for the groups inside a category. */
  size?: "main" | "sub";
  onSelect: () => void;
}

function FilterPill({ label, count, isActive, size = "main", onSelect }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onSelect}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border font-extrabold uppercase tracking-[0.08em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        size === "main" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"
      } ${
        isActive
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/20 bg-background hover:border-foreground"
      }`}
    >
      {label}
      <span
        className={`font-mono text-xs font-medium ${
          isActive ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

/**
 * Filterable case study grid with two levels: category, then the groups
 * inside it. The filter lives in the URL (`?category=marketing` or
 * `?group=search-local`) so menus, ads and shared links can open one slice.
 */
export function CaseStudyExplorer({ studies }: CaseStudyExplorerProps) {
  const params = useSearchParams();
  const groupParam = params.get("group");
  const categoryParam = params.get("category");

  // A group implies its category, so `?group=web` alone is enough.
  const activeGroup = isCaseStudyGroupId(groupParam) ? groupParam : null;
  const activeCategory = activeGroup
    ? CASE_STUDY_GROUPS[activeGroup].category
    : isCaseStudyCategoryId(categoryParam)
      ? categoryParam
      : null;

  const inCategory = (id: CaseStudyCategoryId) =>
    studies.filter((study) => CASE_STUDY_GROUPS[study.group].category === id);
  const inGroup = (id: CaseStudyGroupId) =>
    studies.filter((study) => study.group === id);

  const visible = activeGroup
    ? inGroup(activeGroup)
    : activeCategory
      ? inCategory(activeCategory)
      : studies;

  const select = (category: CaseStudyCategoryId | null, group: CaseStudyGroupId | null) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("group");
    if (group) url.searchParams.set("group", group);
    else if (category) url.searchParams.set("category", category);
    window.history.replaceState(null, "", url);
  };

  const category = activeCategory ? CASE_STUDY_CATEGORIES[activeCategory] : null;
  const summary = activeGroup
    ? CASE_STUDY_GROUPS[activeGroup].summary
    : (category?.summary ??
      (studies.length > 0 ? `Showing all ${studies.length} case studies.` : null));

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 gap-3">
          <div role="group" aria-label="Filter case studies by category" className={PILL_ROW}>
            <FilterPill
              label="All work"
              count={studies.length}
              isActive={!activeCategory}
              onSelect={() => select(null, null)}
            />
            {CASE_STUDY_CATEGORY_ORDER.map((id) => (
              <FilterPill
                key={id}
                label={CASE_STUDY_CATEGORIES[id].label}
                count={inCategory(id).length}
                isActive={activeCategory === id}
                onSelect={() => select(id, null)}
              />
            ))}
          </div>

          {category && (
            <motion.div
              key={category.id}
              role="group"
              aria-label={`Filter ${category.label.toLowerCase()} case studies`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className={PILL_ROW}
            >
              <FilterPill
                size="sub"
                label={`All ${category.label.toLowerCase()}`}
                count={inCategory(category.id).length}
                isActive={!activeGroup}
                onSelect={() => select(category.id, null)}
              />
              {category.groups.map((id) => (
                <FilterPill
                  key={id}
                  size="sub"
                  label={CASE_STUDY_GROUPS[id].label}
                  count={inGroup(id).length}
                  isActive={activeGroup === id}
                  onSelect={() => select(category.id, id)}
                />
              ))}
            </motion.div>
          )}
        </div>

        {summary && (
          <p
            aria-live="polite"
            className="text-sm text-muted-foreground lg:max-w-xs lg:pt-3 lg:text-right"
          >
            {summary}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeGroup ?? activeCategory ?? "all"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-8"
        >
          {visible.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
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
            </ul>
          ) : (
            <p className="rounded-card-lg border border-border bg-background p-8 text-lg font-semibold tracking-[-0.02em]">
              We&apos;re writing these up now. Case studies for this area are on the way.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
