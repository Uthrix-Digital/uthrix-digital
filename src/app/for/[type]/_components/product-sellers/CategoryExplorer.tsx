"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, Quote } from "lucide-react";
import { EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { siteConfig } from "@/config/siteConfig";
import { SELLER_CATEGORIES } from "./data";

const isCategoryId = (value: string | null) =>
  !!value && SELLER_CATEGORIES.some((c) => c.id === value);

/**
 * "What do you sell?" Pick a category and see what buyers need, what we
 * build and what we measure. Each category has its own link
 * (`?category=fashion#categories`) so an ad can point straight at it.
 */
export function CategoryExplorer() {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("category");
  const [activeId, setActiveId] = useState(
    isCategoryId(fromUrl) ? fromUrl! : SELLER_CATEGORIES[0].id,
  );
  // Follow the URL when a link elsewhere on the page changes `?category=`.
  const [lastUrl, setLastUrl] = useState(fromUrl);
  if (fromUrl !== lastUrl) {
    setLastUrl(fromUrl);
    if (isCategoryId(fromUrl)) setActiveId(fromUrl!);
  }

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const active = SELLER_CATEGORIES.find((c) => c.id === activeId) ?? SELLER_CATEGORIES[0];
  const ActiveIcon = active.icon;

  const select = (id: string, focus = false) => {
    setActiveId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
    const tab = tabRefs.current[id];
    if (focus) tab?.focus();
    tab?.closest("li")?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = SELLER_CATEGORIES.length - 1;
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
    select(SELLER_CATEGORIES[next].id, true);
  };

  const whatsappHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    `Hi! I sell ${active.label.toLowerCase()} and I'd like to talk about getting more orders.`,
  )}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
      <ul
        role="tablist"
        aria-label="What do you sell?"
        aria-orientation="horizontal"
        className="isolate -mx-[clamp(1.25rem,5vw,5rem)] flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,5vw,5rem)] gap-3 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:gap-4"
      >
        {SELLER_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          const isActive = category.id === active.id;
          return (
            <li
              key={category.id}
              role="presentation"
              style={{ "--tint": category.tint } as CSSProperties}
              className={`group/cat relative flex w-[11.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-card-lg bg-card ring-1 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] has-focus-visible:ring-2 has-focus-visible:ring-brand motion-reduce:transition-none sm:w-auto ${
                isActive
                  ? "-translate-y-1 shadow-menu ring-2 ring-foreground"
                  : "ring-foreground/10 hover:-translate-y-1 hover:shadow-menu hover:ring-foreground/30 motion-reduce:hover:translate-y-0"
              }`}
            >
              {/* Cover photo */}
              <div aria-hidden="true" className="relative aspect-[16/10] w-full overflow-hidden bg-[color-mix(in_oklab,var(--tint)_16%,var(--card))]">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 17rem, (min-width: 640px) 30vw, 11.5rem"
                  className={`object-cover transition-[scale,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[scale] group-hover/cat:scale-110 group-hover/cat:saturate-100 motion-reduce:transition-none motion-reduce:group-hover/cat:scale-100 ${
                    isActive ? "scale-105 saturate-100" : "saturate-[0.85]"
                  }`}
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,transparent_35%,transparent_55%,rgba(0,0,0,0.55)_100%)] transition-opacity duration-700 group-hover/cat:opacity-75" />
                <span
                  className={`absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-[translate,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cat:-translate-y-1 motion-reduce:transition-none ${
                    isActive ? "bg-brand text-brand-foreground" : "bg-white/85 text-[#16161a]"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="absolute right-3 top-2.5 rounded-full bg-black/40 px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-white backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1 p-3.5">
                {/* The tab itself; its ::after covers the whole card so any part is clickable. */}
                <button
                  ref={(node) => {
                    tabRefs.current[category.id] = node;
                  }}
                  id={`category-tab-${category.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="category-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(category.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className="text-left text-sm font-semibold leading-tight tracking-[-0.02em] outline-none after:absolute after:inset-0 after:z-10 after:rounded-card-lg after:content-[''] sm:text-[0.95rem]"
                >
                  {category.label}
                </button>
                <p className="text-xs leading-snug text-muted-foreground">{category.examples}</p>
                <p
                  className={`mt-auto flex items-center justify-between pt-3 text-xs font-semibold ${
                    isActive ? "text-brand-text" : "text-foreground/60"
                  }`}
                >
                  {isActive ? "Showing your plan" : "See your plan"}
                  <ArrowRight
                    aria-hidden="true"
                    className={`size-3.5 transition-transform duration-300 ${
                      isActive ? "rotate-90 lg:rotate-0" : "group-hover/cat:translate-x-0.5"
                    }`}
                  />
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        id="category-panel"
        role="tabpanel"
        aria-labelledby={`category-tab-${active.id}`}
        style={{ "--tint": active.tint } as CSSProperties}
        className="self-start overflow-hidden rounded-card-lg border border-border bg-background lg:sticky lg:top-24"
      >
        <div key={active.id} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <div className="relative overflow-hidden border-b border-border p-6 sm:p-8">
            <ActiveIcon
              aria-hidden="true"
              strokeWidth={0.75}
              className="pointer-events-none absolute -right-6 -top-6 size-40 text-[color-mix(in_oklab,var(--tint)_22%,transparent)]"
            />
            <div className="relative flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                <ActiveIcon aria-hidden="true" className="size-5" />
              </span>
              <p className={EYEBROW}>{active.label}</p>
            </div>
            <p className="relative mt-5 text-[clamp(1.35rem,2.2vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
              {active.goal}
            </p>
            <figure className="relative mt-5 flex gap-3 rounded-card border border-dashed border-foreground/20 bg-surface-raised p-4">
              <Quote aria-hidden="true" className="size-4 shrink-0 text-brand-text" />
              <blockquote className="text-sm italic leading-relaxed text-foreground/80">
                {active.headache}
              </blockquote>
            </figure>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="bg-background p-6 sm:p-8">
              <p className={EYEBROW}>Your buyers need to see</p>
              <ul className="mt-4 grid gap-3">
                {active.buyersNeed.map((item) => (
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
