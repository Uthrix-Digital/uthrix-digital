import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AudienceEnquireSection,
  AudienceFaqSection,
  AudienceProofSection,
  AudienceStageSection,
} from "@/components/shared/(AudiencePage)/AudiencePage";
import {
  BTN_PRIMARY,
  SECTION,
} from "@/components/shared/(AudiencePage)/styles";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { SectionHead } from "@/app/for/[type]/_components/SectionHead";
import { BusinessTypeExplorer } from "./BusinessTypeExplorer";
import { CommissionCalculator } from "./CommissionCalculator";
import { FEATURES, GUEST_JOURNEY, PROCESS } from "./data";
import { HospitalityHero } from "./HospitalityHero";

function TypesSection() {
  return (
    <section
      id="types"
      aria-labelledby="hosp-types"
      className="scroll-mt-20 border-t border-border bg-surface-raised"
    >
      <div className={SECTION}>
        <SectionHead
          id="hosp-types"
          eyebrow="Every kind of tourism business"
          title="Which one are you?"
          body="A safari jeep and a city hotel don't need the same website. Pick your business to see what your guests look for, what we build and how we measure it."
        />
        <Suspense
          fallback={
            <div
              className="min-h-[32rem] w-full animate-pulse rounded-card-lg bg-foreground/5"
              aria-label="Loading business types"
            />
          }
        >
          <BusinessTypeExplorer />
        </Suspense>
      </div>
    </section>
  );
}

function CommissionSection() {
  return (
    <section aria-labelledby="hosp-commission" className="border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="hosp-commission"
          eyebrow="The commission problem"
          title="What booking sites cost you"
          body="Booking sites bring you guests, and keep 15 to 25% of every booking. Move even a small share of those guests to your own website and the difference adds up quickly. Try your own numbers."
        />
        <Reveal>
          <CommissionCalculator />
        </Reveal>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section aria-labelledby="hosp-features" className="bg-foreground text-background">
      <div className={SECTION}>
        <SectionHead
          dark
          id="hosp-features"
          eyebrow="What's included"
          title="Everything a tourism website needs"
          body="The things that make a traveller trust you and book, built in from the start. Not add-ons you discover later."
        />
        <ul className="grid gap-px overflow-hidden rounded-card-lg border border-background/15 bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="bg-foreground">
              <Reveal delay={(i % 4) * 0.05} className="flex h-full flex-col gap-4 p-6 sm:p-7">
                <span className="flex size-11 items-center justify-center rounded-full border border-background/20 text-brand-bright">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-lg font-semibold tracking-[-0.02em]">{title}</span>
                <span className="text-sm leading-relaxed text-background/65">{body}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section aria-labelledby="hosp-journey">
      <div className={SECTION}>
        <SectionHead
          id="hosp-journey"
          eyebrow="Beyond the website"
          title="Be there at every step of the trip"
          body="A website is one stop on a long journey. Travellers dream, search, compare and ask long before they book. We make sure you show up at each step, and that they come back."
        />

        {/* `isolate` keeps the step numbers' z-index local, below the fixed header. */}
        <ol className="relative isolate grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-0">
          {/* The track the steps sit on (desktop) */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-[linear-gradient(90deg,var(--track),var(--brand-bright)_85%,var(--track))] lg:block"
          />
          {GUEST_JOURNEY.map((step, i) => (
            <li key={step.moment} className="relative lg:px-3 lg:first:pl-0 lg:last:pr-0">
              <Reveal delay={i * 0.06} className="flex h-full flex-col">
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-foreground bg-background font-mono text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="mt-5 flex flex-1 flex-col rounded-card-lg border border-border p-5">
                  <p className="font-archivo-black text-2xl uppercase tracking-[-0.05em]">
                    {step.moment}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{step.guest}</p>
                  <p className="mt-4 border-t border-border pt-4 text-sm font-semibold leading-snug">
                    {step.weDo}
                  </p>
                  <Link
                    href={step.service.href}
                    className="group mt-auto inline-flex items-center gap-1 pt-5 text-xs font-semibold text-brand-text"
                  >
                    {step.service.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section aria-labelledby="hosp-process" className="border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="hosp-process"
          eyebrow="How it works"
          title="From your idea to a site that books"
          body="Four clear steps. You always know what's happening, what you'll get next and what we need from you."
        />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title}>
              <Reveal
                delay={i * 0.06}
                className="flex h-full flex-col rounded-card-lg border border-border p-6 sm:p-7"
              >
                <span className="font-archivo-black text-5xl leading-none tracking-[-0.06em] text-foreground/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{step.body}</p>
                <p className="mt-auto pt-6 text-sm">
                  <span className="mr-2 inline-block size-2 rounded-full bg-brand-bright align-middle" />
                  <span className="font-semibold">{step.youGet}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/book-a-call" className={BTN_PRIMARY}>
            Book a free 20-min call
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            No pressure. We&apos;ll tell you honestly what would help most.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** /for/hospitality: the tourism-specific landing page. */
export function HospitalityPage() {
  return (
    <div className="bg-background text-foreground">
      <HospitalityHero />
      <TypesSection />
      <CommissionSection />
      <FeaturesSection />
      <JourneySection />
      <AudienceStageSection
        id="hospitality"
        intro="Whatever kind of tourism business you run, the right next step depends on where you are today. Pick the stage that sounds most like you."
      />
      <ProcessSection />
      <AudienceProofSection id="hospitality" />
      <AudienceFaqSection id="hospitality" />
      <AudienceEnquireSection id="hospitality" />
    </div>
  );
}
