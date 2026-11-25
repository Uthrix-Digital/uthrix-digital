"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { PostHeading } from "@/config/blog";

/** Tracks which section is on screen: the last heading above the top third. */
function useActiveHeading(idList: string) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = idList ? idList.split(" ") : [];
    if (ids.length === 0) return;
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [idList]);

  return active;
}

function Links({ headings, active }: { headings: PostHeading[]; active: string | null }) {
  return (
    <ol className="border-l border-border">
      {headings.map((h) => {
        const isActive = h.id === active;
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`-ml-px block border-l-2 py-2 pl-4 text-sm leading-snug transition-colors ${
                isActive
                  ? "border-brand font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Desktop: a sticky list beside the article that follows your position. */
export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  // Ids never contain spaces (see postHeadings), so a joined string is a stable key.
  const active = useActiveHeading(headings.map((h) => h.id).join(" "));
  if (headings.length === 0) return null;
  return (
    <nav aria-label="In this article">
      <p className="nav-panel-label mb-4">In this article</p>
      <Links headings={headings} active={active} />
    </nav>
  );
}

/** Phones and tablets: a collapsible panel above the article. */
export function TableOfContentsMobile({ headings }: { headings: PostHeading[] }) {
  if (headings.length === 0) return null;
  return (
    <details className="group rounded-card border border-border px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        In this article
        <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label="In this article" className="mt-4">
        <Links headings={headings} active={null} />
      </nav>
    </details>
  );
}
