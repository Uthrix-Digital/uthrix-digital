import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  caseStudyHref,
  getCaseStudyTaxonomy,
  type CaseStudy,
} from "@/config/caseStudies";

interface CaseStudyCardProps {
  study: CaseStudy;
  /** Position in the list, shown as "01", "02", … */
  index?: number;
  /** `wide` puts the image beside the text from the desktop breakpoint. */
  layout?: "stacked" | "wide";
  /** Load the cover eagerly (use for the first card above the fold). */
  priority?: boolean;
  className?: string;
}

/** One case study as a link card. Used on the listing, home and detail pages. */
export function CaseStudyCard({
  study,
  index,
  layout = "stacked",
  priority = false,
  className = "",
}: CaseStudyCardProps) {
  const isWide = layout === "wide";
  const { group } = getCaseStudyTaxonomy(study);

  return (
    <Link
      href={caseStudyHref(study.slug)}
      className={`group flex h-full flex-col overflow-hidden rounded-card-lg border border-border bg-background text-foreground transition-colors duration-300 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
        isWide ? "lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]" : ""
      } ${className}`}
    >
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-surface-raised ${
          isWide ? "lg:aspect-auto lg:min-h-[26rem]" : ""
        }`}
      >
        <Image
          src={study.cover.src}
          alt={study.cover.alt}
          fill
          priority={priority}
          sizes={
            isWide
              ? "(min-width: 75rem) 55vw, 100vw"
              : "(min-width: 75rem) 40vw, (min-width: 48rem) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur-sm">
          {group.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {index !== undefined && (
            <>
              <span className="text-brand-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>{study.client}</span>
        </p>

        <h3
          className={`mt-4 font-semibold leading-[1.08] tracking-[-0.035em] ${
            isWide
              ? "text-[clamp(1.75rem,3vw,2.75rem)]"
              : "text-[clamp(1.5rem,2.2vw,2rem)]"
          }`}
        >
          {study.title}
        </h3>
        <p className="mb-6 mt-3 text-base leading-relaxed text-foreground/70">
          {study.summary}
        </p>

        <dl className="mt-auto border-t border-border">
          {study.results.map((result) => (
            <div
              key={result.metric}
              className="flex items-baseline justify-between gap-4 border-b border-border py-3"
            >
              <dt className="text-sm text-muted-foreground">{result.metric}</dt>
              <dd className="font-archivo-black text-xl uppercase tracking-[-0.04em] sm:text-2xl">
                {result.value}
              </dd>
            </div>
          ))}
        </dl>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.1em] transition-colors group-hover:text-brand-text">
          View case study
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
