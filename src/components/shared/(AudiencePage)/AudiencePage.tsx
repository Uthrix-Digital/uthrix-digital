import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import {
  getDestinationHref,
  resolveGoal,
} from "@/app/ConnetMainDots/(GrowthPathMap)/data/resolver";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { ServiceFaq } from "@/components/shared/(ServicePage)/ServiceFaq";
import { InquiryForm } from "@/components/shared/InquiryForm";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  STAGES,
  STAGE_ORDER,
  audienceHref,
  type AudienceId,
} from "@/config/audiences";
import { siteConfig } from "@/config/siteConfig";
import { StageExplorer, type StageView } from "./StageExplorer";

const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";
const EYEBROW = "nav-panel-label";

function buildStageViews(id: AudienceId): StageView[] {
  const audience = AUDIENCES[id];

  return STAGE_ORDER.map((stageId) => {
    const stage = STAGES[stageId];
    const plan = audience.stages[stageId];
    const resolved = resolveGoal(plan.pathMask);

    const message = `Hi! I run a ${audience.label.toLowerCase()} business and I'm at the "${stage.label}" stage. I'd like to talk about ${resolved?.hubTitle ?? "a growth path"}.`;

    return {
      id: stageId,
      label: stage.label,
      summary: stage.summary,
      offer: stage.offer,
      pains: plan.pains,
      whatWeDo: plan.whatWeDo,
      measure: plan.measure,
      pack: plan.pack,
      pathTitle: resolved?.hubTitle ?? "Your growth path",
      pathHref: getDestinationHref(plan.pathMask) ?? "/ConnetMainDots",
      pathServices: resolved?.selectedNodes.map((n) => n.label) ?? [],
      whatsappHref: `${siteConfig.whatsappLink}?text=${encodeURIComponent(message)}`,
    };
  });
}

/** One page per business type: story, stage selector, proof and lead form. */
export function AudiencePage({ id }: { id: AudienceId }) {
  const audience = AUDIENCES[id];
  const stages = buildStageViews(id);
  const otherTypes = AUDIENCE_ORDER.filter((type) => type !== id);

  return (
    <div className="bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="audience-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>Who we help</span>
              <span aria-hidden="true">·</span>
              <span className="text-brand-text">{audience.label}</span>
            </p>
            <h1
              id="audience-title"
              className="font-archivo-black mt-6 max-w-[16ch] text-[clamp(3rem,9vw,8.5rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              {audience.headline}
            </h1>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:gap-16">
            <Reveal immediate delay={0.1}>
              <p className="max-w-2xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
                {audience.intro}
              </p>
            </Reveal>
            <Reveal immediate delay={0.2} className="flex flex-col gap-8">
              <div>
                <p className={EYEBROW}>This page is for</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {audience.subTypes.map((sub) => (
                    <li
                      key={sub}
                      className="rounded-full border border-foreground/20 px-4 py-1.5 text-sm font-semibold"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#stage"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  Find where you are
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/BookACall"
                  className="inline-flex items-center rounded-full border border-foreground/25 px-6 py-3 text-base font-semibold transition-colors hover:border-foreground"
                >
                  Book a free 20-min call
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Where are you today? ─────────────────────────────────────── */}
      <section
        id="stage"
        aria-labelledby="audience-stage"
        className="scroll-mt-20 border-t border-border bg-surface-raised"
      >
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,5rem)] grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
            <div>
              <p className={EYEBROW}>Where are you today?</p>
              <h2 id="audience-stage" className={`${SECTION_TITLE} mt-4 max-w-[14ch]`}>
                Pick your stage
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              The right next step depends on where you are. Choose the one that
              sounds most like your business today. You can switch any time.
            </p>
          </Reveal>

          <Suspense
            fallback={
              <div
                className="min-h-96 w-full animate-pulse rounded-card-lg bg-foreground/5"
                aria-label="Loading stages"
              />
            }
          >
            <StageExplorer audienceLabel={audience.label} stages={stages} />
          </Suspense>
        </div>
      </section>

      {/* ── Sub-group extra (tour operators, showrooms) ──────────────── */}
      {audience.extra && (
        <section aria-labelledby="audience-extra" className="border-t border-border">
          <div
            className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}
          >
            <Reveal>
              <p className={EYEBROW}>A closer look</p>
              <h2 id="audience-extra" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
                {audience.extra.title}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
                {audience.extra.body}
              </p>
            </Reveal>
            <ul className="grid gap-4">
              {audience.extra.points.map((point, i) => (
                <li key={point}>
                  <Reveal
                    delay={i * 0.05}
                    className="flex gap-5 rounded-card-lg border border-border p-6 sm:p-8"
                  >
                    <span className="font-mono text-xs text-brand-text">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">
                      {point}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Proof ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="audience-proof"
        className="bg-foreground text-background"
      >
        <div
          className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}
        >
          <Reveal>
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
              Proof
            </p>
            <h2 id="audience-proof" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              {audience.proof.title}
            </h2>
          </Reveal>
          <ul className="grid gap-0">
            {audience.proof.points.map((point, i) => (
              <li key={point} className="border-b border-background/15 last:border-b-0">
                <Reveal delay={i * 0.05} className="flex items-start gap-5 py-5 sm:py-6">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-2.5 shrink-0 rounded-full bg-brand-bright"
                  />
                  <p className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold leading-snug tracking-[-0.03em]">
                    {point}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="audience-faq">
        <div
          className={`${SECTION} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}
        >
          <Reveal>
            <p className={EYEBROW}>FAQ</p>
            <h2 id="audience-faq" className={`${SECTION_TITLE} mt-4 max-w-[10ch]`}>
              Good questions
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ServiceFaq faqs={audience.faqs} />
          </Reveal>
        </div>
      </section>

      {/* ── Lead form ────────────────────────────────────────────────── */}
      <section
        id="enquire"
        aria-labelledby="audience-enquire"
        className="scroll-mt-20 border-t border-border bg-surface-raised"
      >
        <div
          className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,34rem)] lg:items-start lg:gap-16`}
        >
          <Reveal>
            <p className={EYEBROW}>Start a conversation</p>
            <h2 id="audience-enquire" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              Tell us where you are
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              Share your stage and what you&apos;re after. We&apos;ll reply with
              your exact problem named and a clear first step, not a generic
              brochure.
            </p>
            <p className="mt-8 text-sm text-muted-foreground">
              Not a {audience.label.toLowerCase()} business? Try{" "}
              {otherTypes.map((type, i) => (
                <span key={type}>
                  {i > 0 && " or "}
                  <Link
                    href={audienceHref(type)}
                    className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
                  >
                    {AUDIENCES[type].label}
                  </Link>
                </span>
              ))}
              . Agency or IT firm?{" "}
              <Link
                href="/partners"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
              >
                Partner with us
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <InquiryForm defaultValues={{ businessType: id }} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
