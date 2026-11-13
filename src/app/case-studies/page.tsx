import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { CASE_STUDIES, CASE_STUDY_GROUPS } from "@/config/caseStudies";
import { CaseStudyExplorer } from "./_components/CaseStudyExplorer";

export const metadata: Metadata = {
  title: "Case Studies | UthriX Digital",
  description:
    "Marketing and development projects from UthriX Digital: the problem, what we built and the results it produced.",
};

export default function CaseStudiesPage() {
  const industries = new Set(CASE_STUDIES.map((study) => study.industry)).size;

  const stats = [
    { value: CASE_STUDIES.length, label: "Case studies" },
    { value: Object.keys(CASE_STUDY_GROUPS).length, label: "Services" },
    { value: industries, label: "Industries" },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="case-studies-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Case studies
            </p>
            <h1
              id="case-studies-title"
              className="font-archivo-black mt-6 max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              Real work. Measured results<span className="text-brand">.</span>
            </h1>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
            <Reveal immediate delay={0.1}>
              <p className="max-w-2xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
                Every project starts with a business problem and ends with a
                number that moved. Here is what we built and what changed.
              </p>
            </Reveal>
            {CASE_STUDIES.length > 0 && (
              <Reveal immediate delay={0.2}>
                <dl className="grid grid-cols-3 border-t border-border">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col-reverse gap-2 pt-5">
                      <dt className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {stat.label}
                      </dt>
                      <dd className="font-archivo-black text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.06em]">
                        {String(stat.value).padStart(2, "0")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter + grid ────────────────────────────────────────────── */}
      <section
        id="work"
        aria-label="All case studies"
        className="scroll-mt-20 border-t border-border bg-surface-raised"
      >
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,6vw,6rem)]">
          <Suspense
            fallback={
              <div
                className="min-h-[40rem] w-full animate-pulse rounded-card-lg bg-foreground/5"
                aria-label="Loading case studies"
              />
            }
          >
            <CaseStudyExplorer studies={CASE_STUDIES} />
          </Suspense>
        </div>
      </section>

    </div>
  );
}
