"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowRight, ArrowUpRight, Check, Quote, Search, X } from "lucide-react";
import { EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { siteConfig } from "@/config/siteConfig";
import {
  CLIENT_MODELS,
  SEARCH_ALIASES,
  SECTORS,
  SERVICE_TYPES,
  type SectorId,
  type ServiceType,
  typeImage,
} from "./data";

type Filter = SectorId | "all";

const findType = (id: string | null) =>
  id ? SERVICE_TYPES.find((t) => t.id === id) : undefined;
const isSector = (value: string | null): value is SectorId =>
  !!value && SECTORS.some((s) => s.id === value);

const MODEL_BY_ID = Object.fromEntries(CLIENT_MODELS.map((m) => [m.id, m]));
const SECTOR_BY_ID = Object.fromEntries(SECTORS.map((s) => [s.id, s]));
const COUNT_BY_SECTOR = SERVICE_TYPES.reduce<Record<string, number>>((acc, t) => {
  acc[t.sector] = (acc[t.sector] ?? 0) + 1;
  return acc;
}, {});

/** Initial state from `?service=` (wins) or `?sector=`. */
function fromParams(service: string | null, sector: string | null) {
  const type = findType(service);
  if (type) return { filter: type.sector as Filter, activeId: type.id };
  if (isSector(sector)) {
    const first = SERVICE_TYPES.find((t) => t.sector === sector)!;
    return { filter: sector as Filter, activeId: first.id };
  }
  return null;
}

/**
 * "Which one are you?" Pick a sector (or search), pick your business and see
 * what clients check, what we build and what we measure. Each business has
 * its own link (`?service=dental#types`) so an ad can point straight at it.
 */
export function ServiceExplorer() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const sectorParam = searchParams.get("sector");
  const initial = fromParams(serviceParam, sectorParam);

  const [filter, setFilter] = useState<Filter>(initial?.filter ?? SECTORS[0].id);
  const [activeId, setActiveId] = useState(initial?.activeId ?? SERVICE_TYPES[0].id);
  const [query, setQuery] = useState("");

  // Follow the URL when a link elsewhere on the page changes the params.
  const urlKey = `${serviceParam}|${sectorParam}`;
  const [lastUrlKey, setLastUrlKey] = useState(urlKey);
  if (urlKey !== lastUrlKey) {
    setLastUrlKey(urlKey);
    const next = fromParams(serviceParam, sectorParam);
    if (next) {
      setFilter(next.filter);
      setActiveId(next.activeId);
      setQuery("");
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return SERVICE_TYPES.filter((t) =>
        `${t.label} ${t.examples} ${SECTOR_BY_ID[t.sector].label} ${SEARCH_ALIASES[t.id] ?? ""}`
          .toLowerCase()
          .includes(q),
      );
    }
    return filter === "all" ? SERVICE_TYPES : SERVICE_TYPES.filter((t) => t.sector === filter);
  }, [filter, query]);

  // A single sector has few enough types for photo cards; "All" and search stay compact.
  const showCards = !query.trim() && filter !== "all";

  const selected: ServiceType = findType(activeId) ?? SERVICE_TYPES[0];
  // While searching, show the best match if the selected one is filtered out.
  const active: ServiceType = visible.some((t) => t.id === selected.id)
    ? selected
    : (visible[0] ?? selected);
  const ActiveIcon = active.icon;
  const activeModel = MODEL_BY_ID[active.model];

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  const writeUrl = (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", url);
  };

  const select = (id: string, { focus = false, reveal = false } = {}) => {
    setActiveId(id);
    writeUrl({ service: id, sector: null });
    const tab = tabRefs.current[id];
    if (focus) tab?.focus();
    tab?.closest("li")?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    // On small screens the panel sits below the list: bring it into view.
    if (reveal && !window.matchMedia("(min-width: 1024px)").matches) {
      panelRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const pickFilter = (next: Filter) => {
    setFilter(next);
    setQuery("");
    const pool = next === "all" ? SERVICE_TYPES : SERVICE_TYPES.filter((t) => t.sector === next);
    if (!pool.some((t) => t.id === activeId)) setActiveId(pool[0].id);
    writeUrl({ sector: next === "all" ? null : next, service: null });
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = visible.length - 1;
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
    select(visible[next].id, { focus: true });
  };

  const focusableId = active.id;

  const whatsappHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    `Hi! I run a business in ${active.label.toLowerCase()} and I'd like more clients and bookings.`,
  )}`;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      {/* Search + sectors */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search for your type of business</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type what you do: dentist, tutor, plumber, lawyer…"
            className="w-full rounded-full border border-foreground/15 bg-background py-3 pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </label>

        <div
          role="group"
          aria-label="Filter by sector"
          className="-mx-[clamp(1.25rem,5vw,5rem)] flex gap-2 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {[{ id: "all" as const, label: "All", icon: null }, ...SECTORS].map((sector) => {
            const pressed = !query && filter === sector.id;
            const count =
              sector.id === "all" ? SERVICE_TYPES.length : COUNT_BY_SECTOR[sector.id];
            const Icon = sector.icon;
            return (
              <button
                key={sector.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => pickFilter(sector.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  pressed
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/15 hover:border-foreground"
                }`}
              >
                {Icon && <Icon aria-hidden="true" className="size-3.5" />}
                {sector.label}
                <span
                  className={`rounded-full px-1.5 py-px font-mono text-[0.6rem] ${
                    pressed ? "bg-background/20" : "bg-foreground/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
        {/* Business types */}
        <div>
          <p aria-live="polite" className="mb-3 text-xs text-muted-foreground">
            {query
              ? `${visible.length} match${visible.length === 1 ? "" : "es"} for "${query.trim()}"`
              : `${visible.length} types of business${filter === "all" ? "" : ` in ${SECTOR_BY_ID[filter].label.toLowerCase()}`}`}
          </p>

          {visible.length === 0 ? (
            <div className="rounded-card-lg border border-dashed border-foreground/20 p-8 text-center">
              <p className="text-lg font-semibold tracking-[-0.02em]">
                Not on our list? You&apos;re still in the right place.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                If clients book your time or your skills, we can help. Tell us
                what you do and we&apos;ll map it out with you.
              </p>
              <a
                href="#enquire"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                Tell us what you do
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          ) : showCards ? (
            /* One sector picked: few enough types for photo cards. */
            <ul
              role="tablist"
              aria-label="Which business are you?"
              aria-orientation="horizontal"
              className="isolate -mx-[clamp(1.25rem,5vw,5rem)] flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,5vw,5rem)] gap-3 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 xl:grid-cols-3 lg:gap-4"
            >
              {visible.map((type, index) => {
                const Icon = type.icon;
                const isActive = type.id === active.id;
                return (
                  <li
                    key={type.id}
                    role="presentation"
                    style={{ "--tint": type.tint } as CSSProperties}
                    className={`group/type relative flex w-[12.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-card-lg bg-card ring-1 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] animate-in fade-in-0 slide-in-from-bottom-2 has-focus-visible:ring-2 has-focus-visible:ring-brand motion-reduce:transition-none sm:w-auto ${
                      isActive
                        ? "-translate-y-1 shadow-menu ring-2 ring-foreground"
                        : "ring-foreground/10 hover:-translate-y-1 hover:shadow-menu hover:ring-foreground/30 motion-reduce:hover:translate-y-0"
                    }`}
                  >
                    {/* Cover photo */}
                    <div
                      aria-hidden="true"
                      className="relative aspect-[16/10] w-full overflow-hidden bg-[color-mix(in_oklab,var(--tint)_16%,var(--card))]"
                    >
                      <Image
                        src={typeImage(type.id)}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 15rem, (min-width: 640px) 40vw, 12.5rem"
                        className={`object-cover transition-[scale,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[scale] group-hover/type:scale-110 group-hover/type:saturate-100 motion-reduce:transition-none motion-reduce:group-hover/type:scale-100 ${
                          isActive ? "scale-105 saturate-100" : "saturate-[0.85]"
                        }`}
                      />
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,transparent_35%,transparent_55%,rgba(0,0,0,0.55)_100%)] transition-opacity duration-700 group-hover/type:opacity-75" />
                      <span
                        className={`absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-[translate,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/type:-translate-y-1 motion-reduce:transition-none ${
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
                          tabRefs.current[type.id] = node;
                        }}
                        id={`service-tab-${type.id}`}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        aria-controls="service-panel"
                        tabIndex={type.id === focusableId ? 0 : -1}
                        onClick={() => select(type.id)}
                        onKeyDown={(event) => onKeyDown(event, index)}
                        className="text-left text-sm font-semibold leading-tight tracking-[-0.02em] outline-none after:absolute after:inset-0 after:z-10 after:rounded-card-lg after:content-[''] sm:text-[0.95rem]"
                      >
                        {type.label}
                      </button>
                      <p className="text-xs leading-snug text-muted-foreground">{type.examples}</p>
                      <p
                        className={`mt-auto flex items-center justify-between pt-3 text-xs font-semibold ${
                          isActive ? "text-brand-text" : "text-foreground/60"
                        }`}
                      >
                        {isActive ? "Showing your plan" : "See your plan"}
                        <ArrowRight
                          aria-hidden="true"
                          className={`size-3.5 transition-transform duration-300 ${
                            isActive ? "rotate-90 lg:rotate-0" : "group-hover/type:translate-x-0.5"
                          }`}
                        />
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul
              role="tablist"
              aria-label="Which business are you?"
              aria-orientation="vertical"
              className="grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2"
            >
              {visible.map((type, index) => {
                const Icon = type.icon;
                const isActive = type.id === active.id;
                return (
                  <li
                    key={type.id}
                    role="presentation"
                    style={{ "--tint": type.tint } as CSSProperties}
                    className={`group/type relative flex items-center gap-3.5 rounded-card-lg bg-card p-3 ring-1 transition-[translate,box-shadow,background-color] duration-300 has-focus-visible:ring-2 has-focus-visible:ring-brand motion-reduce:transition-none ${
                      isActive
                        ? "shadow-menu ring-2 ring-foreground"
                        : "ring-foreground/10 hover:-translate-y-0.5 hover:shadow-menu hover:ring-foreground/30 motion-reduce:hover:translate-y-0"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] transition-colors duration-300 ${
                        isActive
                          ? "bg-brand text-brand-foreground"
                          : "bg-[color-mix(in_oklab,var(--tint)_16%,var(--card))] text-[color-mix(in_oklab,var(--tint)_80%,var(--foreground))]"
                      }`}
                    >
                      <span className="absolute -right-3 -top-3 size-8 rounded-full bg-white/15" />
                      <Icon className="relative size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {/* The tab itself; its ::after covers the whole card so any part is clickable. */}
                      <button
                        ref={(node) => {
                          tabRefs.current[type.id] = node;
                        }}
                        id={`service-tab-${type.id}`}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        aria-controls="service-panel"
                        tabIndex={type.id === focusableId ? 0 : -1}
                        onClick={() => select(type.id, { reveal: true })}
                        onKeyDown={(event) => onKeyDown(event, index)}
                        className="block w-full truncate text-left text-sm font-semibold leading-tight tracking-[-0.02em] outline-none after:absolute after:inset-0 after:z-10 after:rounded-card-lg after:content-['']"
                      >
                        {type.label}
                      </button>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {type.examples}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className={`size-4 shrink-0 transition-[translate,color] duration-300 ${
                        isActive
                          ? "rotate-90 text-brand-text lg:rotate-0"
                          : "text-foreground/30 group-hover/type:translate-x-0.5 group-hover/type:text-foreground"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* The plan for the selected business */}
        <div
          ref={panelRef}
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${active.id}`}
          style={{ "--tint": active.tint } as CSSProperties}
          className="scroll-mt-24 self-start overflow-hidden rounded-card-lg border border-border bg-background lg:sticky lg:top-24"
        >
          <div key={active.id} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="relative overflow-hidden border-b border-border p-6 sm:p-8">
              <ActiveIcon
                aria-hidden="true"
                strokeWidth={0.75}
                className="pointer-events-none absolute -right-6 -top-6 size-40 text-[color-mix(in_oklab,var(--tint)_22%,transparent)]"
              />
              <div className="relative flex flex-wrap items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <ActiveIcon aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className={`${EYEBROW} block`}>{SECTOR_BY_ID[active.sector].label}</span>
                  <span className="block text-base font-semibold tracking-[-0.02em]">{active.label}</span>
                </span>
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
              <a
                href="#models"
                className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 py-1 pl-1 pr-3 text-xs font-semibold transition-colors hover:border-foreground"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-foreground/10">
                  <activeModel.icon aria-hidden="true" className="size-3.5 text-brand-text" />
                </span>
                Clients come to you by: {activeModel.label.toLowerCase()}
              </a>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="bg-background p-6 sm:p-8">
                <p className={EYEBROW}>Before they book, clients check</p>
                <ul className="mt-4 grid gap-3">
                  {active.clientsCheck.map((item) => (
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
    </div>
  );
}
