"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { StageId } from "@/config/audiences";

export interface StageView {
  id: StageId;
  label: string;
  summary: string;
  /** "Set up" / "Fix" / "Scale". */
  offer: string;
  pains: string[];
  whatWeDo: string[];
  measure: string[];
  pack: string;
  pathTitle: string;
  pathHref: string;
  pathServices: string[];
  whatsappHref: string;
}

interface StageExplorerProps {
  audienceLabel: string;
  stages: StageView[];
}

const EYEBROW = "nav-panel-label";

/**
 * "Where are you today?" selector. Each stage has its own link
 * (`?stage=stuck`) so an ad can point at a single stage.
 */
export function StageExplorer({ audienceLabel, stages }: StageExplorerProps) {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("stage");
  const [activeId, setActiveId] = useState<StageId>(
    stages.find((s) => s.id === fromUrl)?.id ?? stages[0].id,
  );
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const active = stages.find((s) => s.id === activeId) ?? stages[0];

  const select = (id: StageId, focus = false) => {
    setActiveId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("stage", id);
    window.history.replaceState(null, "", url);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = stages.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0 ? last : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(stages[next].id, true);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={`Where is your ${audienceLabel.toLowerCase()} business today?`}
        className="grid gap-3 md:grid-cols-3"
      >
        {stages.map((stage, index) => {
          const isActive = stage.id === active.id;
          return (
            <button
              key={stage.id}
              ref={(node) => {
                tabRefs.current[stage.id] = node;
              }}
              id={`stage-tab-${stage.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`stage-panel-${stage.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(stage.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`group flex flex-col gap-3 rounded-card-lg border p-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:p-6 ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={`font-mono text-xs uppercase tracking-[0.16em] ${
                    isActive ? "text-background/60" : "text-muted-foreground"
                  }`}
                >
                  0{index + 1} · {stage.offer}
                </span>
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full transition-colors ${
                    isActive ? "bg-brand-bright" : "bg-foreground/20"
                  }`}
                />
              </span>
              <span className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {stage.label}
              </span>
              <span
                className={`text-sm leading-relaxed ${
                  isActive ? "text-background/75" : "text-foreground/70"
                }`}
              >
                {stage.summary}
              </span>
            </button>
          );
        })}
      </div>

      {stages.map((stage) => (
        <div
          key={stage.id}
          id={`stage-panel-${stage.id}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${stage.id}`}
          hidden={stage.id !== active.id}
          className={`mt-3 gap-px overflow-hidden rounded-card-lg border border-border bg-border lg:grid-cols-2 ${
            stage.id === active.id ? "grid" : "hidden"
          }`}
        >
          <section className="bg-background p-6 sm:p-8" aria-label="What you're thinking">
            <p className={EYEBROW}>What you&apos;re thinking</p>
            <ul className="mt-5 grid gap-4">
              {stage.pains.map((pain) => (
                <li
                  key={pain}
                  className="text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl"
                >
                  {pain}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-background p-6 sm:p-8" aria-label="What we do">
            <p className={EYEBROW}>What we do</p>
            <ul className="mt-5 grid gap-3">
              {stage.whatWeDo.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-foreground/80">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-bright"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface-raised p-6 sm:p-8" aria-label="What you'll measure">
            <p className={EYEBROW}>What you&apos;ll measure</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {stage.measure.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-foreground/20 px-4 py-1.5 text-sm font-semibold"
                >
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-foreground/70">
              Starting point:{" "}
              <span className="font-semibold text-foreground">{stage.pack}</span>.
              We adjust the scope to your business and budget.
            </p>
          </section>

          <section className="bg-surface-raised p-6 sm:p-8" aria-label="Recommended growth path">
            <p className={EYEBROW}>Recommended growth path</p>
            <Link
              href={stage.pathHref}
              className="group mt-5 flex items-center justify-between gap-4 rounded-card border border-border bg-background p-5 transition-colors hover:border-foreground"
            >
              <span>
                <span className="font-archivo-black block text-2xl uppercase tracking-[-0.04em]">
                  {stage.pathTitle}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {stage.pathServices.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-5 shrink-0 text-brand-text transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={stage.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                Talk about this on WhatsApp
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#enquire"
                className="inline-flex items-center rounded-full border border-foreground/25 px-6 py-3 text-base font-semibold transition-colors hover:border-foreground"
              >
                Send an enquiry
              </a>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
