import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudyHref, type CaseStudy } from "@/config/caseStudies";

/** Full-width link to the next case study in the list. */
export function CaseStudyNext({ study }: { study: CaseStudy }) {
  return (
    <section aria-label="Next case study" className="border-t border-border">
      <Link
        href={caseStudyHref(study.slug)}
        className="group mx-auto grid w-full max-w-[100rem] items-center gap-8 px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,6vw,6rem)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16"
      >
        <div>
          <p className="nav-panel-label">Next case study</p>
          <p className="font-archivo-black mt-4 flex max-w-[16ch] flex-wrap items-end gap-x-[0.3em] text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.9] tracking-[-0.07em] transition-colors duration-300 group-hover:text-brand">
            {study.title}
            <ArrowRight
              aria-hidden="true"
              className="mb-[0.08em] size-[0.7em] shrink-0 transition-transform duration-300 group-hover:translate-x-[0.2em]"
            />
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {study.client} · {study.results[0]?.value} {study.results[0]?.metric}
          </p>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-card-lg bg-surface-raised">
          <Image
            src={study.cover.src}
            alt=""
            fill
            sizes="(min-width: 75rem) 40vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </Link>
    </section>
  );
}
