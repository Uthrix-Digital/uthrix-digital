import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  STAGES,
  STAGE_ORDER,
  audienceHref,
  isStageId,
} from "@/config/audiences";

export const instant = false;

interface StageRouteProps {
  params: Promise<{ stage: string }>;
}

export function generateStaticParams() {
  return STAGE_ORDER.map((stage) => ({ stage }));
}

export async function generateMetadata({
  params,
}: StageRouteProps): Promise<Metadata> {
  const { stage } = await params;
  if (!isStageId(stage)) return {};

  return {
    title: `${STAGES[stage].label} | UthriX Digital`,
    description: STAGES[stage].description,
  };
}

/**
 * Short stage-first page: the visitor knows where they are but not which
 * business-type page to open, so we ask for the business type next.
 */
export default async function StageRoute({ params }: StageRouteProps) {
  const { stage: stageId } = await params;
  if (!isStageId(stageId)) notFound();

  const stage = STAGES[stageId];
  const otherStages = STAGE_ORDER.filter((id) => id !== stageId);

  return (
    <div className="bg-background text-foreground">
      <section aria-labelledby="stage-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>Who we help</span>
              <span aria-hidden="true">·</span>
              <span className="text-brand-text">Where are you today?</span>
            </p>
            <h1
              id="stage-title"
              className="font-archivo-black mt-6 max-w-[14ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              {stage.label}
            </h1>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:gap-16">
            <Reveal immediate delay={0.1}>
              <p className="max-w-2xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
                {stage.description}
              </p>
            </Reveal>
            <Reveal immediate delay={0.2}>
              <p className="nav-panel-label">Sounds familiar?</p>
              <ul className="mt-4 grid gap-3">
                {stage.commonPains.map((pain) => (
                  <li
                    key={pain}
                    className="text-lg font-semibold leading-snug tracking-[-0.02em]"
                  >
                    {pain}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="stage-type"
        className="border-t border-border bg-surface-raised"
      >
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]">
          <Reveal className="mb-[clamp(2.5rem,6vw,4rem)]">
            <p className="nav-panel-label">Step 2 of 2</p>
            <h2
              id="stage-type"
              className="font-archivo-black mt-4 max-w-[14ch] text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]"
            >
              What kind of business?
            </h2>
          </Reveal>

          <ul className="grid gap-4 md:grid-cols-3">
            {AUDIENCE_ORDER.map((type, i) => {
              const audience = AUDIENCES[type];
              return (
                <li key={type}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <Link
                      href={audienceHref(type, stageId)}
                      className="group flex h-full flex-col gap-4 rounded-card-lg border border-border bg-background p-6 transition-colors hover:border-foreground sm:p-8"
                    >
                      <span className="font-mono text-xs text-brand-text">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-archivo-black text-3xl uppercase leading-[0.95] tracking-[-0.04em]">
                        {audience.label}
                      </span>
                      <span className="leading-relaxed text-foreground/75">
                        {audience.summary}
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {audience.subTypes.map((sub) => (
                          <span
                            key={sub}
                            className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs"
                          >
                            {sub}
                          </span>
                        ))}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-text">
                        See the {stage.label.toLowerCase()} plan
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <p className="mt-10 text-sm text-muted-foreground">
            Not at this stage?{" "}
            {otherStages.map((id, i) => (
              <span key={id}>
                {i > 0 && " or "}
                <Link
                  href={`/for/stage/${id}`}
                  className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
                >
                  {STAGES[id].label}
                </Link>
              </span>
            ))}
            . An agency or IT firm?{" "}
            <Link
              href="/partners"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
            >
              Partner with us
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
