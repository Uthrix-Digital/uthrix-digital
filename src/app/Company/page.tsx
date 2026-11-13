import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, UserRound } from "lucide-react";
import { NODES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/nodes";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { ServiceCta } from "@/components/shared/(ServicePage)/ServiceCta";
import {
  COMPANY_FACTS,
  COMPANY_PATH,
  DISCIPLINES,
  MISSION,
  PRINCIPLES,
  STATS,
  TEAM,
  VALUES,
  VISION,
  WHY_POINTS,
} from "@/config/company";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Company | UthriX Digital",
  description:
    "UthriX Digital is a small team from Sri Lanka that blends web and software development with data-driven marketing. See who we are, what guides us and why businesses choose us.",
  alternates: { canonical: COMPANY_PATH },
};

const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";
const EYEBROW = "nav-panel-label";
const ANCHOR = "";

export default function CompanyPage() {
  return (
    <div className="bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="company-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(2.5rem,6vw,5rem)] pt-32 text-center lg:pt-40">
          <Reveal immediate>
            <p className={EYEBROW}>/ Company</p>
            <h1
              id="company-title"
              className="font-archivo-black mx-auto mt-6 max-w-[12ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              We connect the dots<span className="text-brand">.</span>
            </h1>
          </Reveal>
          <Reveal immediate delay={0.12}>
            <p className="mx-auto mt-8 max-w-2xl text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.45] tracking-tight text-foreground/80">
              A small digital team from Sri Lanka. We blend web and software
              development with data-driven marketing, so the work you pay for
              adds up to more customers.
            </p>
          </Reveal>
        </div>
      </section>


      {/* ── Profile ──────────────────────────────────────────────────── */}
      <section id="profile" aria-labelledby="profile-title" className={ANCHOR}>
        <div className={SECTION}>
          <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
            <div>
              <p className={EYEBROW}>/ Company profile</p>
              <h2 id="profile-title" className={`${SECTION_TITLE} mt-4 max-w-[14ch]`}>
                Marketing and software that fit how a business runs.
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              {siteConfig.companyName} designs, builds and looks after
              websites, ads, search visibility and the systems behind them for
              hotels, online sellers and service businesses. One team, one
              plan, and one monthly report that shows what your money brought
              in.
            </p>
          </Reveal>

          <ul className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delay={i * 0.06}
                  className="flex h-full flex-col gap-4 rounded-card-lg border border-border p-6 sm:p-8"
                >
                  <span className="font-mono text-xs text-brand-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-foreground/75">
                    {item.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <dl className="mt-4 grid gap-px overflow-hidden rounded-card-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <Reveal key={stat.label} className="flex flex-col bg-surface-raised p-6 sm:p-8">
                <dt className="order-2 mt-2 text-sm text-foreground/70">
                  {stat.label}
                </dt>
                <dd className="font-archivo-black text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-none tracking-[-0.06em]">
                  {stat.value}
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="mt-[clamp(3rem,6vw,5rem)]">
            <p className={EYEBROW}>What we do</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {NODES.map((node) => (
                <li key={node.id}>
                  <Link
                    href={node.route}
                    className="inline-flex items-center rounded-full border border-foreground/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    {node.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/ConnetMainDots"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
                >
                  Plan your growth path
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section
        id="team"
        aria-labelledby="team-title"
        className={`${ANCHOR} border-t border-border bg-surface-raised`}
      >
        <div className={SECTION}>
          <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
            <div>
              <p className={EYEBROW}>/ Leadership</p>
              <h2 id="team-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
                The team behind UthriX.
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              You talk to the people doing the work. Four disciplines sit in
              one team, so strategy, design, ads and software stay connected.
            </p>
          </Reveal>

          {TEAM.length > 0 && (
            <ul className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-4 md:grid-cols-2">
              {TEAM.map((person, i) => (
                <li key={person.name}>
                  <Reveal
                    delay={i * 0.06}
                    className="flex h-full gap-6 rounded-card-lg border border-border bg-background p-6 sm:p-8"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground/10 text-foreground/60"
                    >
                      {person.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={person.photo} alt="" className="size-full object-cover" />
                      ) : (
                        <UserRound className="size-7" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className={EYEBROW}>{person.role}</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                        {person.name}
                      </h3>
                      <p className="mt-3 leading-relaxed text-foreground/75">
                        {person.bio}
                      </p>
                      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                        {person.email && (
                          <a
                            href={`mailto:${person.email}`}
                            className="underline underline-offset-4 hover:text-brand-text"
                          >
                            {person.email}
                          </a>
                        )}
                        {person.links?.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-brand-text"
                          >
                            {link.label}
                            <ArrowUpRight aria-hidden="true" className="size-3.5" />
                          </a>
                        ))}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-px overflow-hidden rounded-card-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {DISCIPLINES.map((item, i) => (
              <li key={item.title} className="bg-background">
                <Reveal delay={i * 0.05} className="flex h-full flex-col gap-3 p-6 sm:p-8">
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

          <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/BookACall"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              Talk to the team
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <p className="text-sm text-foreground/70">
              A free, short call. No prep needed.{" "}
              <Link
                href="/careers"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
              >
                Want to join us?
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Mission & values ─────────────────────────────────────────── */}
      <section id="mission" aria-labelledby="mission-title" className={ANCHOR}>
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,5rem)]">
            <p className={EYEBROW}>/ Mission &amp; values</p>
            <h2 id="mission-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              Why UthriX exists.
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="rounded-card-lg bg-foreground p-6 text-background sm:p-8">
              <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
                / Mission
              </p>
              <p className="mt-5 text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-snug tracking-[-0.03em]">
                {MISSION}
              </p>
            </Reveal>
            <Reveal delay={0.06} className="rounded-card-lg border border-border p-6 sm:p-8">
              <p className={EYEBROW}>/ Vision</p>
              <p className="mt-5 text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-snug tracking-[-0.03em]">
                {VISION}
              </p>
            </Reveal>
          </div>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <li key={value.title}>
                <Reveal
                  delay={i * 0.05}
                  className="flex h-full flex-col gap-3 rounded-card-lg border border-border p-6"
                >
                  <span className="font-mono text-xs text-brand-text">V{i + 1}</span>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/75 sm:text-base">
                    {value.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-4">
            <dl className="grid gap-px overflow-hidden rounded-card-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {COMPANY_FACTS.map((fact) => (
                <div key={fact.label} className="bg-surface-raised p-5 sm:p-6">
                  <dt className={EYEBROW}>{fact.label}</dt>
                  <dd className="mt-2 font-semibold tracking-[-0.01em]">
                    {fact.href ? (
                      <a
                        href={fact.href}
                        className="underline-offset-4 hover:text-brand-text hover:underline"
                      >
                        {fact.value}
                      </a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Why UthriX ───────────────────────────────────────────────── */}
      <section
        id="why"
        aria-labelledby="why-title"
        className={`${ANCHOR} bg-foreground text-background`}
      >
        <div
          className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}
        >
          <Reveal>
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
              / Why UthriX
            </p>
            <h2 id="why-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              Why businesses choose us.
            </h2>
            <Link
              href="/case-studies"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-background/40 px-6 py-3 text-base font-semibold transition-colors hover:border-background hover:bg-background hover:text-foreground"
            >
              See our work
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
          <ul className="grid gap-0">
            {WHY_POINTS.map((point, i) => (
              <li key={point} className="border-b border-background/15 last:border-b-0">
                <Reveal delay={i * 0.05} className="flex items-start gap-5 py-5 sm:py-6">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-bright text-foreground"
                  >
                    <Check className="size-3.5" />
                  </span>
                  <p className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold leading-snug tracking-[-0.03em]">
                    {point}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Next step ────────────────────────────────────────────────── */}
      <ServiceCta topic="UthriX Digital" />
    </div>
  );
}
