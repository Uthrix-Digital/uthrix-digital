import Link from "next/link";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { NODES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/nodes";
import { bundlesWith } from "@/app/ConnetMainDots/(GrowthPathMap)/data/resolver";
import type { NodeDef } from "@/app/ConnetMainDots/(GrowthPathMap)/types";
import { SERVICE_PAGES, type ServiceId } from "@/config/servicePages";
import { PHASE_INFO, PhaseTrack } from "./PhaseTrack";
import { Reveal } from "./Reveal";
import { ServiceFaq } from "./ServiceFaq";

const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";
const EYEBROW = "nav-panel-label";

export function getServiceNode(id: ServiceId): NodeDef {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown service node: ${id}`);
  return node as NodeDef;
}

export function getServiceMetadata(id: ServiceId) {
  const node = getServiceNode(id);
  return {
    title: `${SERVICE_PAGES[id].metaTitle} | UthriX Digital`,
    description: node.summary,
  };
}

function SectionHeading({
  eyebrow,
  title,
  aside,
  id,
}: {
  eyebrow: string;
  title: string;
  aside?: string;
  id: string;
}) {
  return (
    <Reveal className="mb-[clamp(2.5rem,6vw,5rem)] grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
      <div>
        <p className={EYEBROW}>{eyebrow}</p>
        <h2 id={id} className={`${SECTION_TITLE} mt-4 max-w-[14ch]`}>
          {title}
        </h2>
      </div>
      {aside && (
        <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
          {aside}
        </p>
      )}
    </Reveal>
  );
}

export function ServicePage({ id }: { id: ServiceId }) {
  const node = getServiceNode(id);
  const content = SERVICE_PAGES[id];
  const index = NODES.findIndex((n) => n.id === id);
  const previous = index > 0 ? NODES[index - 1] : null;
  const next = index < NODES.length - 1 ? NODES[index + 1] : null;
  const phase = PHASE_INFO.find((p) => p.id === node.phase);
  const bundles = bundlesWith(node.bit);
  const number = `${String(index + 1).padStart(2, "0")} / ${String(NODES.length).padStart(2, "0")}`;

  return (
    <main className="bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="service-title" className="relative">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>What we do</span>
              <span aria-hidden="true">·</span>
              <span>{number}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-2 text-brand-text">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-brand-bright shadow-glow-sm"
                />
                {phase?.label} phase
              </span>
            </p>
            <h1
              id="service-title"
              className="font-archivo-black mt-6 text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.84] tracking-[-0.075em]"
            >
              {node.label}
            </h1>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:gap-16">
            <Reveal immediate delay={0.1}>
              <p className="max-w-[22ch] text-[clamp(1.6rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em]">
                {content.headline}
              </p>
            </Reveal>
            <Reveal immediate delay={0.2} className="flex flex-col gap-8">
              <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
                {content.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/BookACall"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  Start with {node.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/ConnetMainDots"
                  className="inline-flex items-center rounded-full border border-foreground/25 px-6 py-3 text-base font-semibold transition-colors hover:border-foreground"
                >
                  Combine with others
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Sounds familiar ──────────────────────────────────────────── */}
      <section aria-labelledby="service-problems" className="border-t border-border">
        <div className={SECTION}>
          <SectionHeading
            id="service-problems"
            eyebrow="Sounds familiar?"
            title="Where most businesses start"
            aside={node.summary}
          />
          <ul className="grid gap-px overflow-hidden rounded-card-lg border border-border bg-border sm:grid-cols-2">
            {content.problems.map((problem, i) => (
              <li key={problem} className="bg-background">
                <Reveal delay={i * 0.05} className="flex h-full gap-5 p-6 sm:p-8">
                  <span className="font-mono text-xs text-brand-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">
                    {problem}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────────────────── */}
      <section aria-labelledby="service-included" className="bg-surface-raised">
        <div className={SECTION}>
          <SectionHeading
            id="service-included"
            eyebrow="What you get"
            title="What's included"
            aside="Every engagement is scoped to your goals. These are the building blocks we tailor it from."
          />
          <ul className="grid gap-4 md:grid-cols-2">
            {content.deliverables.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delay={i * 0.05}
                  className="flex h-full flex-col gap-4 rounded-card-lg border border-border bg-background p-6 sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full bg-brand-bright"
                  />
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-foreground/75">
                    {item.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section aria-labelledby="service-process">
        <div className={SECTION}>
          <SectionHeading
            id="service-process"
            eyebrow="How it works"
            title="Four clear steps"
          />
          <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <span
              aria-hidden="true"
              className="absolute left-[0.4rem] top-2 bottom-2 w-px bg-track md:hidden lg:block lg:left-0 lg:right-0 lg:top-[0.4rem] lg:bottom-auto lg:h-px lg:w-auto"
            />
            {content.process.map((step, i) => (
              <li key={step.title} className="relative pl-10 lg:pl-0 lg:pt-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0.5 size-3.5 rounded-full border-2 border-background bg-brand-bright shadow-glow-sm lg:top-0"
                />
                <Reveal delay={i * 0.08}>
                  <p className="font-mono text-xs text-muted-foreground">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-foreground/75">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Outcomes ─────────────────────────────────────────────────── */}
      <section aria-labelledby="service-outcomes" className="bg-foreground text-background">
        <div className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
          <Reveal>
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
              The result
            </p>
            <h2 id="service-outcomes" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              What changes for you
            </h2>
          </Reveal>
          <ul className="grid gap-0">
            {content.outcomes.map((outcome, i) => (
              <li key={outcome} className="border-b border-background/15 last:border-b-0">
                <Reveal delay={i * 0.05} className="flex items-start gap-5 py-5 sm:py-6">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-2.5 shrink-0 rounded-full bg-brand-bright"
                  />
                  <p className="text-[clamp(1.15rem,2vw,1.6rem)] font-semibold leading-snug tracking-[-0.03em]">
                    {outcome}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How it connects ──────────────────────────────────────────── */}
      <section aria-labelledby="service-connects" className="border-b border-border">
        <div className={SECTION}>
          <SectionHeading
            id="service-connects"
            eyebrow="Connect the dots"
            title="Works alone. Stronger together."
            aside={`${node.label} sits in the ${phase?.label.toLowerCase()} phase of your growth path. Each step feeds the next, so you can start here and add the rest when you're ready.`}
          />

          <Reveal>
            <PhaseTrack mask={node.bit} />
          </Reveal>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Reveal className="h-full">
              {previous ? (
                <Link
                  href={previous.route}
                  className="group flex h-full flex-col gap-3 rounded-card-lg border border-border p-6 transition-colors hover:border-foreground sm:p-8"
                >
                  <span className={EYEBROW}>Builds on</span>
                  <span className="text-2xl font-semibold tracking-[-0.03em]">
                    {previous.label}
                  </span>
                  <span className="leading-relaxed text-foreground/75">
                    {previous.why}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-text">
                    Explore {previous.label}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ) : (
                <div className="flex h-full flex-col gap-3 rounded-card-lg border border-border p-6 sm:p-8">
                  <span className={EYEBROW}>Where it starts</span>
                  <span className="text-2xl font-semibold tracking-[-0.03em]">
                    The very first dot
                  </span>
                  <span className="leading-relaxed text-foreground/75">
                    Everything else builds on a clear plan. This is where we
                    get to know your business.
                  </span>
                </div>
              )}
            </Reveal>

            <Reveal delay={0.08} className="h-full">
              <Link
                href={next ? next.route : "/ConnetMainDots"}
                className="group flex h-full flex-col gap-3 rounded-card-lg border border-border p-6 transition-colors hover:border-foreground sm:p-8"
              >
                <span className={EYEBROW}>{next ? "Leads into" : "Restarts the cycle"}</span>
                <span className="inline-flex items-center gap-2 text-2xl font-semibold tracking-[-0.03em]">
                  {next ? next.label : "Your next goal"}
                  {!next && <RotateCcw aria-hidden="true" className="size-5" />}
                </span>
                <span className="leading-relaxed text-foreground/75">{node.why}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-text">
                  {next ? `Explore ${next.label}` : "Plan your growth path"}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          </div>

          {bundles.length > 0 && (
            <Reveal className="mt-[clamp(3rem,6vw,5rem)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={EYEBROW}>Popular combinations</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    Paths that include {node.label}
                  </h3>
                </div>
                <Link
                  href="/ConnetMainDots"
                  className="inline-flex w-fit items-center gap-1 text-sm font-semibold underline underline-offset-4 hover:text-brand-text"
                >
                  Build your own <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bundles.map((bundle) => (
                  <li key={bundle.mask}>
                    <Link
                      href={bundle.href}
                      className="group flex h-full flex-col gap-4 rounded-card-lg bg-surface-raised p-6 transition-colors hover:bg-foreground hover:text-background"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-archivo-black text-xl uppercase tracking-[-0.03em]">
                          {bundle.title}
                        </span>
                        <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {bundle.nodes.map((n) => (
                          <span
                            key={n.id}
                            className={`rounded-full px-2.5 py-0.5 text-xs ${
                              n.id === node.id
                                ? "bg-brand text-brand-foreground"
                                : "bg-foreground/10 group-hover:bg-background/15"
                            }`}
                          >
                            {n.label}
                          </span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="service-faq">
        <div className={`${SECTION} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
          <Reveal>
            <p className={EYEBROW}>FAQ</p>
            <h2 id="service-faq" className={`${SECTION_TITLE} mt-4 max-w-[10ch]`}>
              Good questions
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ServiceFaq faqs={content.faqs} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
