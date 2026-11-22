"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { siteConfig } from "@/config/siteConfig";
import { TOURISM_TYPES } from "./data";

const isTypeId = (value: string | null) =>
  !!value && TOURISM_TYPES.some((t) => t.id === value);

/**
 * "Which kind of tourism business are you?" Pick a type and see what your
 * guests need, what we build and what we measure. Each type has its own link
 * (`?type=safari#types`) so an ad can point straight at it.
 */
export function BusinessTypeExplorer() {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("type");
  const [activeId, setActiveId] = useState(
    isTypeId(fromUrl) ? fromUrl! : TOURISM_TYPES[0].id,
  );
  // Follow the URL when a link elsewhere on the page changes `?type=`.
  const [lastUrl, setLastUrl] = useState(fromUrl);
  if (fromUrl !== lastUrl) {
    setLastUrl(fromUrl);
    if (isTypeId(fromUrl)) setActiveId(fromUrl!);
  }

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const active = TOURISM_TYPES.find((t) => t.id === activeId) ?? TOURISM_TYPES[0];
  const ActiveIcon = active.icon;

  const select = (id: string, focus = false) => {
    setActiveId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("type", id);
    window.history.replaceState(null, "", url);
    const tab = tabRefs.current[id];
    if (focus) tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = TOURISM_TYPES.length - 1;
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
    select(TOURISM_TYPES[next].id, true);
  };

  const whatsappHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    `Hi! I run a ${active.label.toLowerCase()} business and I'd like to talk about my website and bookings.`,
  )}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
      <div
        role="tablist"
        aria-label="Which kind of tourism business are you?"
        aria-orientation="horizontal"
        className="-mx-[clamp(1.25rem,5vw,5rem)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {TOURISM_TYPES.map((type, index) => {
          const Icon = type.icon;
          const isActive = type.id === active.id;
          return (
            <button
              key={type.id}
              ref={(node) => {
                tabRefs.current[type.id] = node;
              }}
              id={`type-tab-${type.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="type-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(type.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`group flex w-[11.5rem] shrink-0 snap-start flex-col gap-4 rounded-card-lg border p-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:p-5 lg:w-auto ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground"
              }`}
            >
              <span className="flex items-start justify-between">
                <span
                  className={`flex size-11 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-brand text-brand-foreground"
                      : "bg-foreground/5 text-foreground group-hover:bg-foreground/10"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span
                  className={`font-mono text-[0.65rem] ${
                    isActive ? "text-background/50" : "text-muted-foreground"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span>
                <span className="block text-base font-semibold leading-tight tracking-[-0.02em]">
                  {type.label}
                </span>
                <span
                  className={`mt-1 block text-xs leading-snug ${
                    isActive ? "text-background/65" : "text-muted-foreground"
                  }`}
                >
                  {type.examples}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="type-panel"
        role="tabpanel"
        aria-labelledby={`type-tab-${active.id}`}
        className="self-start overflow-hidden rounded-card-lg border border-border bg-background lg:sticky lg:top-24"
      >
        <div key={active.id} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <div className="border-b border-border p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                <ActiveIcon aria-hidden="true" className="size-5" />
              </span>
              <p className={EYEBROW}>{active.label}</p>
            </div>
            <p className="mt-5 text-[clamp(1.35rem,2.2vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
              {active.goal}
            </p>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="bg-background p-6 sm:p-8">
              <p className={EYEBROW}>Your guests need to see</p>
              <ul className="mt-4 grid gap-3">
                {active.guestsNeed.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background p-6 sm:p-8">
              <p className={EYEBROW}>What we build</p>
              <ul className="mt-4 grid gap-3">
                {active.weBuild.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-border bg-surface-raised p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className={EYEBROW}>We report on</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {active.measure.map((m) => (
                  <li
                    key={m}
                    className="rounded-full border border-foreground/20 bg-background px-3 py-1 text-xs font-semibold"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              Talk to us about this
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
