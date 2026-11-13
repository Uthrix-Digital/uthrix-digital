import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import type { CaseStudyResult } from "@/config/caseStudies";

/** Inverted band with the headline numbers. */
export function CaseStudyResults({ results }: { results: CaseStudyResult[] }) {
  return (
    <section aria-labelledby="case-study-results" className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,7vw,7rem)]">
        <Reveal>
          <p
            id="case-study-results"
            className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60"
          >
            Measurable results
          </p>
        </Reveal>
        <dl className="mt-8 grid gap-x-10 lg:grid-flow-col lg:auto-cols-fr">
          {results.map((result, i) => (
            <Reveal
              key={result.metric}
              delay={i * 0.08}
              className="flex min-w-0 flex-col-reverse gap-3 border-t border-background/15 py-6 lg:pb-0 lg:pt-8"
            >
              <dt className="flex items-center gap-3 text-base font-semibold sm:text-lg">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full bg-brand-bright"
                />
                {result.metric}
              </dt>
              <dd className="font-archivo-black text-[clamp(2.5rem,4vw,3.75rem)] uppercase leading-[0.95] tracking-[-0.06em]">
                {result.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
