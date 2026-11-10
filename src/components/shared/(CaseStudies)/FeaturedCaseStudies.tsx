import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { CASE_STUDIES_PATH, getFeaturedCaseStudies } from "@/config/caseStudies";
import { CaseStudyCard } from "./CaseStudyCard";

/** Home page teaser: the featured case studies and a link to the rest. */
export function FeaturedCaseStudies() {
  const studies = getFeaturedCaseStudies(3);

  return (
    <section
      id="case-studies"
      aria-labelledby="featured-case-studies-title"
      className="scroll-mt-20 border-t border-border bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,8vw,10rem)]">
        <Reveal className="mb-[clamp(2.5rem,6vw,5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
          <div>
            <p className="nav-panel-label">Case studies</p>
            <h2
              id="featured-case-studies-title"
              className="font-archivo-black mt-4 max-w-[12ch] text-[clamp(2.75rem,7vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              Results you can measure<span className="text-brand">.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-base leading-[1.45]">
              Real projects, each one judged by the numbers it moved. See the
              problem, what we built and what changed.
            </p>
            <Link
              href={CASE_STUDIES_PATH}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              All case studies
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study, i) => (
            <li key={study.slug} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
              <Reveal delay={i * 0.06} className="h-full">
                <CaseStudyCard study={study} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
