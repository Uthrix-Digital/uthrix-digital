import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { HIRING_STEPS, LOOKING_FOR, REASONS } from "@/config/careers";
import { CareersApply } from "./_components/CareersApply";

export const metadata: Metadata = {
  title: "Careers | UthriX Digital",
  description:
    "Work with UthriX Digital. See how we work, how we hire and how to apply for roles in marketing, design and software development.",
  alternates: { canonical: "/careers" },
};

const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";
const EYEBROW = "nav-panel-label";

export default function CareersPage() {
  return (
    <div className="bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="careers-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>About</span>
              <span aria-hidden="true">·</span>
              <span className="text-brand-text">Careers</span>
            </p>
            <h1
              id="careers-title"
              className="font-archivo-black mt-6 max-w-[14ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              Build growth with us<span className="text-brand">.</span>
            </h1>
          </Reveal>
          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:gap-16">
            <Reveal immediate delay={0.1}>
              <p className="max-w-2xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
                We&apos;re a small team that blends marketing and software. We
                like people who care how their work performs and who enjoy
                explaining it plainly.
              </p>
            </Reveal>
            <Reveal immediate delay={0.2} className="flex flex-wrap items-start gap-3">
              <a
                href="#roles"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                See open roles
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#apply"
                className="inline-flex items-center rounded-full border border-foreground/25 px-6 py-3 text-base font-semibold transition-colors hover:border-foreground"
              >
                Apply now
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why work here ────────────────────────────────────────────── */}
      <section aria-labelledby="why-work-title" className="border-t border-border bg-surface-raised">
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,4rem)]">
            <p className={EYEBROW}>/ Working here</p>
            <h2 id="why-work-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              What it&apos;s like.
            </h2>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delay={i * 0.05}
                  className="flex h-full flex-col gap-4 rounded-card-lg border border-border bg-background p-6"
                >
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-brand-bright" />
                  <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/75 sm:text-base">
                    {item.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What we look for ─────────────────────────────────────────── */}
      <section aria-labelledby="looking-title">
        <div
          className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}
        >
          <Reveal>
            <p className={EYEBROW}>/ Who fits</p>
            <h2 id="looking-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              What we look for.
            </h2>
          </Reveal>
          <ul className="grid gap-0">
            {LOOKING_FOR.map((line, i) => (
              <li key={line} className="border-b border-border last:border-b-0">
                <Reveal delay={i * 0.05} className="flex items-start gap-5 py-5 sm:py-6">
                  <span className="mt-1 font-mono text-xs text-brand-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold leading-snug tracking-[-0.03em]">
                    {line}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How we hire ──────────────────────────────────────────────── */}
      <section aria-labelledby="hiring-title" className="border-t border-border">
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,4rem)]">
            <p className={EYEBROW}>/ How we hire</p>
            <h2 id="hiring-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              Four simple steps.
            </h2>
          </Reveal>
          <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {HIRING_STEPS.map((step, i) => (
              <li key={step.title}>
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

      <CareersApply />

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-10">
          <p className="text-sm text-foreground/70">
            Want to know us first?{" "}
            <Link
              href="/Company"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
            >
              Read about the company
            </Link>{" "}
            or{" "}
            <Link
              href="/blog"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
            >
              what we write
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
