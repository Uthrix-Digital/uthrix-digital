import Link from "next/link";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { siteConfig } from "@/config/siteConfig";

export interface LegalSection {
  /** Anchor id, also used by the table of contents. */
  id: string;
  title: string;
  paragraphs?: string[];
  /** Rendered as a bulleted list after the paragraphs. */
  items?: string[];
}

interface LegalDocumentProps {
  title: string;
  /** Human-readable date, e.g. "13 November 2026". */
  lastUpdated: string;
  /** ISO date for the <time> element, e.g. "2026-11-13". */
  lastUpdatedIso: string;
  intro: string;
  sections: LegalSection[];
}

/** Shared layout for long-form legal pages (privacy policy, terms of use). */
export function LegalDocument({
  title,
  lastUpdated,
  lastUpdatedIso,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <div className="bg-background text-foreground">
      <section aria-labelledby="legal-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>Legal</span>
              <span aria-hidden="true">·</span>
              <span>
                Last updated <time dateTime={lastUpdatedIso}>{lastUpdated}</time>
              </span>
            </p>
            <h1
              id="legal-title"
              className="font-archivo-black mt-6 max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              {title}
              <span className="text-brand">.</span>
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mt-[clamp(2rem,5vw,4rem)] max-w-3xl text-[clamp(1.125rem,1.8vw,1.5rem)] font-semibold leading-[1.35] tracking-[-0.02em]">
              {intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label={title} className="border-t border-border">
        <div className="mx-auto grid w-full max-w-[100rem] gap-12 px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,6vw,6rem)] lg:grid-cols-[minmax(14rem,0.35fr)_minmax(0,1fr)] lg:gap-20">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              On this page
            </p>
            <ol className="mt-4 space-y-2 text-sm leading-6 text-foreground/75">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex gap-3 transition-colors hover:text-foreground"
                  >
                    <span className="font-mono text-xs leading-6 text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-12">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-28"
              >
                <h2
                  id={`${section.id}-title`}
                  className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl"
                >
                  <span className="mr-3 font-mono text-sm font-normal tracking-normal text-brand-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-foreground/80">
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-foreground/80 marker:text-brand-text">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section
              id="contact"
              aria-labelledby="legal-contact-title"
              className="scroll-mt-28 rounded-card-lg border border-border bg-surface-raised p-6 sm:p-8"
            >
              <h2
                id="legal-contact-title"
                className="text-2xl font-semibold tracking-[-0.03em]"
              >
                Questions about this page?
              </h2>
              <p className="mt-3 leading-relaxed text-foreground/80">
                Email us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold underline underline-offset-4 transition-colors hover:text-brand-text"
                >
                  {siteConfig.email}
                </a>{" "}
                or use our{" "}
                <Link
                  href="/ContactUs"
                  className="font-semibold underline underline-offset-4 transition-colors hover:text-brand-text"
                >
                  contact page
                </Link>
                . We&apos;ll reply as soon as we can.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
