import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { ServiceCta } from "@/components/shared/(ServicePage)/ServiceCta";
import {
  CASE_STUDIES,
  CASE_STUDIES_PATH,
  caseStudyCategoryHref,
  caseStudyGroupHref,
  getCaseStudy,
  getCaseStudyTaxonomy,
  getNextCaseStudy,
} from "@/config/caseStudies";
import { CaseStudyNext } from "./_components/CaseStudyNext";
import { CaseStudyResults } from "./_components/CaseStudyResults";

// Every slug is prerendered below, so reading `params` never blocks for long.
export const instant = false;

interface CaseStudyRouteProps {
  params: Promise<{ slug: string }>;
}

const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";
const STORY_GRID = "grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16";
const STORY_TEXT =
  "max-w-3xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.25] tracking-[-0.03em]";
const EYEBROW = "nav-panel-label";

/** Never a real slug: it resolves to the 404 page. */
const PLACEHOLDER_SLUG = "coming-soon";

export function generateStaticParams() {
  // Cache Components rejects an empty list, so prerender one placeholder
  // until the first case study is published.
  return CASE_STUDIES.length > 0
    ? CASE_STUDIES.map(({ slug }) => ({ slug }))
    : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `${study.title} | Case Study | UthriX Digital`,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      images: [{ url: study.cover.src, alt: study.cover.alt }],
    },
  };
}

export default async function CaseStudyRoute({ params }: CaseStudyRouteProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { category, group } = getCaseStudyTaxonomy(study);
  const next = getNextCaseStudy(study.slug);

  const facts = [
    { label: "Client", value: study.client },
    { label: "Industry", value: study.industry },
    { label: "Discipline", value: category.label },
    { label: "Service", value: group.label },
  ];

  return (
    <article className="bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)] pt-32 lg:pt-40">
        <Reveal immediate>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <Link
              href={CASE_STUDIES_PATH}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Case studies
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href={caseStudyCategoryHref(category.id)}
              className="transition-colors hover:text-foreground"
            >
              {category.label}
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href={caseStudyGroupHref(group.id)}
              className="text-brand-text underline-offset-4 hover:underline"
            >
              {group.label}
            </Link>
          </p>
          <h1 className="font-archivo-black mt-6 max-w-[18ch] text-[clamp(2.5rem,7vw,6.5rem)] uppercase leading-[0.88] tracking-[-0.07em]">
            {study.title}
          </h1>
        </Reveal>

        <div className="mt-[clamp(2rem,5vw,4rem)] grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
          <Reveal immediate delay={0.1}>
            <p className={STORY_TEXT}>{study.summary}</p>
          </Reveal>
          <Reveal immediate delay={0.2}>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-border">
              {facts.map((fact) => (
                <div key={fact.label} className="pt-5">
                  <dt className={EYEBROW}>{fact.label}</dt>
                  <dd className="mt-2 text-base font-semibold leading-snug">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                Visit the live project
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            )}
          </Reveal>
        </div>
      </header>

      {/* ── Cover ────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,6vw,6rem)]">
        <Reveal immediate delay={0.25}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg bg-surface-raised sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={study.cover.src}
              alt={study.cover.alt}
              fill
              priority
              sizes="(min-width: 100rem) 1440px, 92vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <CaseStudyResults results={study.results} />

      {/* ── Challenge ────────────────────────────────────────────────── */}
      <section aria-labelledby="case-study-challenge">
        <div className={`${SECTION} ${STORY_GRID}`}>
          <Reveal>
            <p className={EYEBROW}>01 · Where they started</p>
            <h2 id="case-study-challenge" className={`${SECTION_TITLE} mt-4`}>
              The challenge
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className={STORY_TEXT}>{study.challenge}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Solution ─────────────────────────────────────────────────── */}
      <section
        aria-labelledby="case-study-solution"
        className="border-t border-border bg-surface-raised"
      >
        <div className={`${SECTION} ${STORY_GRID}`}>
          <Reveal>
            <p className={EYEBROW}>02 · What we did</p>
            <h2 id="case-study-solution" className={`${SECTION_TITLE} mt-4`}>
              Our solution
            </h2>
          </Reveal>
          <div>
            <Reveal delay={0.08}>
              <p className={STORY_TEXT}>{study.solution}</p>
            </Reveal>

            <p className={`${EYEBROW} mt-12`}>What we delivered</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {study.deliverables.map((item, i) => (
                <li key={item}>
                  <Reveal
                    delay={i * 0.05}
                    className="flex h-full gap-4 rounded-card-lg border border-border bg-background p-5 sm:p-6"
                  >
                    <span className="font-mono text-xs leading-7 text-brand-text">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-semibold leading-snug tracking-[-0.02em]">
                      {item}
                    </span>
                  </Reveal>
                </li>
              ))}
            </ol>

            <p className={`${EYEBROW} mt-12`}>Tools &amp; technologies</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {study.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-foreground/20 bg-background px-4 py-1.5 text-sm font-semibold"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Gallery (optional) ───────────────────────────────────────── */}
      {study.gallery && study.gallery.length > 0 && (
        <section aria-label="Project gallery" className="border-t border-border">
          <ul className={`${SECTION} grid gap-4 md:grid-cols-2`}>
            {study.gallery.map((image, i) => (
              <li
                key={image.src}
                className={
                  // A lone last image spans the full row.
                  i === study.gallery!.length - 1 && i % 2 === 0 ? "md:col-span-2" : ""
                }
              >
                <Reveal
                  delay={(i % 2) * 0.06}
                  className="relative aspect-[16/10] overflow-hidden rounded-card-lg bg-surface-raised"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 48rem) 50vw, 100vw"
                    className="object-cover"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Testimonial (optional) ───────────────────────────────────── */}
      {study.testimonial && (
        <section aria-label="Client testimonial" className="border-t border-border">
          <Reveal className={SECTION}>
            <figure className="max-w-5xl">
              <span
                aria-hidden="true"
                className="block size-3 rounded-full bg-brand-bright"
              />
              <blockquote className="mt-8 text-[clamp(1.5rem,3.4vw,3rem)] font-semibold leading-[1.15] tracking-[-0.035em]">
                “{study.testimonial.quote}”
              </blockquote>
              <figcaption className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <span className="text-foreground">{study.testimonial.name}</span>
                {" · "}
                {study.testimonial.role}
              </figcaption>
            </figure>
          </Reveal>
        </section>
      )}

      {next && <CaseStudyNext study={next} />}

      <ServiceCta topic={`a project like "${study.title}"`} />
    </article>
  );
}
