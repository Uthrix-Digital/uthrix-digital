import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { SectionHead } from "@/app/for/[type]/_components/SectionHead";
import {
  AudienceEnquireSection,
  AudienceFaqSection,
  AudienceProofSection,
  AudienceStageSection,
} from "@/components/shared/(AudiencePage)/AudiencePage";
import { BTN_PRIMARY, EYEBROW, SECTION } from "@/components/shared/(AudiencePage)/styles";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import {
  CLIENT_JOURNEY,
  CLIENT_MODELS,
  FEATURES,
  PROCESS,
  QUESTIONS,
  SERVICE_TYPES,
  SILENT_QUESTIONS,
} from "./data";
import { EnquiryStory } from "./EnquiryStory";
import { ServiceExplorer } from "./ServiceExplorer";
import { ServicesHero } from "./ServicesHero";

/* ── The question wall ────────────────────────────────────────────────── */

/** Fake "sent at" hours: after work, when nobody is answering. */
const HOURS = [9, 10, 7, 11, 8, 6];

function QuestionRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Rendered twice so the -50% slide loops without a gap.
  const loop = [...items, ...items];
  return (
    <div
      className="comment-marquee flex w-max gap-3"
      style={
        {
          "--marquee-direction": reverse ? "reverse" : "normal",
          "--marquee-duration": reverse ? "56s" : "46s",
        } as CSSProperties
      }
    >
      {loop.map((text, i) => (
        <span
          key={`${text}-${i}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl rounded-bl-sm border border-background/15 bg-background/[0.06] px-4 py-2 text-sm font-semibold"
        >
          {text}
          <span className="font-mono text-[0.6rem] font-normal text-background/45">
            {`${HOURS[i % HOURS.length]}:${String((i * 17) % 60).padStart(2, "0")} pm`}
          </span>
        </span>
      ))}
    </div>
  );
}

function QuestionWallSection() {
  const half = Math.ceil(QUESTIONS.length / 2);
  return (
    <section aria-labelledby="services-questions" className="overflow-hidden bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-[100rem] gap-6 px-[clamp(1.25rem,5vw,5rem)] pb-8 pt-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
            Sound familiar?
          </p>
          <h2
            id="services-questions"
            className="font-archivo-black mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,4rem)] uppercase leading-[0.9] tracking-[-0.07em]"
          >
            Every unanswered one is a client <span className="text-brand-bright">booking someone else</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-md text-base leading-relaxed text-background/70 sm:text-lg">
            Most enquiries arrive after hours, while you&apos;re with a client,
            or all at once. People rarely wait. They message three businesses
            and book with whoever answers first, clearly. Let that be you,
            every time.
          </p>
        </Reveal>
      </div>
      {/* Decorative: the copy above says the same thing. */}
      <div
        aria-hidden="true"
        className="comment-marquee-wrap grid gap-3 pb-[clamp(3rem,6vw,5rem)] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      >
        <QuestionRow items={QUESTIONS.slice(0, half)} />
        <QuestionRow items={QUESTIONS.slice(half)} reverse />
      </div>
    </section>
  );
}

/* ── The three silent questions ───────────────────────────────────────── */

function SilentQuestionsSection() {
  return (
    <section aria-labelledby="services-silent" className="border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="services-silent"
          eyebrow="Why service is harder to sell"
          title="Every client asks three silent questions"
          body="You can't hold a haircut, a lawsuit or a tuition class before you pay for it. So before anyone books, they quietly ask three things. If your website, your Google profile or your reply can't answer them, they move on, without telling you why."
        />
        <ol className="grid gap-4 lg:grid-cols-3">
          {SILENT_QUESTIONS.map(({ icon: Icon, question, why, answers }, i) => (
            <li key={question}>
              <Reveal
                delay={i * 0.08}
                className="group relative flex h-full flex-col overflow-hidden rounded-card-lg border border-border bg-background p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-menu sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="font-archivo-black pointer-events-none absolute -right-2 -top-6 text-[9rem] leading-none tracking-[-0.08em] text-foreground/[0.05] transition-colors duration-500 group-hover:text-brand/10"
                >
                  {i + 1}
                </span>
                <span className="relative flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="relative mt-6 text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                  &ldquo;{question}&rdquo;
                </h3>
                <p className="relative mt-4 text-sm leading-relaxed text-foreground/70 sm:text-base">{why}</p>
                <p className={`${EYEBROW} relative mt-6 border-t border-border pt-5`}>So we answer it with</p>
                <ul className="relative mt-3 grid gap-2.5">
                  {answers.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-text" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── What service you offer ───────────────────────────────────────────── */

function TypesSection() {
  return (
    <section
      id="types"
      aria-labelledby="services-types"
      className="scroll-mt-20 border-t border-border bg-surface-raised"
    >
      <div className={SECTION}>
        <SectionHead
          id="services-types"
          eyebrow={`${SERVICE_TYPES.length} kinds of service business`}
          title="Which one are you?"
          body="A dentist and a driving school don't win clients the same way. Pick your sector, or just type what you do, to see what your clients check before they book, what we build and the numbers we'll move."
        />
        <Suspense
          fallback={
            <div
              className="min-h-[36rem] w-full animate-pulse rounded-card-lg bg-foreground/5"
              aria-label="Loading business types"
            />
          }
        >
          <ServiceExplorer />
        </Suspense>
      </div>
    </section>
  );
}

/* ── How clients come to you ──────────────────────────────────────────── */

function ModelsSection() {
  return (
    <section id="models" aria-labelledby="services-models" className="scroll-mt-20 border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="services-models"
          eyebrow="Every way of winning clients"
          title="And how do clients come to you?"
          body="How a client says yes changes where you lose them. Most businesses use one or two of these. We build around yours, so the right person gets from first message to paid client without falling through a gap."
        />
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CLIENT_MODELS.map(({ id, label, icon: Icon, who, quote, fix, metric }, i) => (
            <li key={id}>
              <Reveal
                delay={(i % 3) * 0.06}
                className="group flex h-full flex-col rounded-card-lg border border-border bg-background transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-menu"
              >
                <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-7 sm:pb-0">
                  <span className="flex size-11 items-center justify-center rounded-full border border-foreground/15 text-brand-text transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{who}</p>
                  <p className="mt-5 border-l-2 border-brand pl-4 text-base font-semibold italic leading-snug tracking-[-0.01em]">
                    {quote}
                  </p>
                  <p className={`${EYEBROW} mt-6`}>So we set up</p>
                  <ul className="mt-3 grid gap-2.5">
                    {fix.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-text" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-auto flex items-center justify-between gap-3 rounded-b-card-lg border-t border-border bg-surface-raised px-6 py-4 text-xs sm:px-7">
                  <span className="text-muted-foreground">First number we move</span>
                  <span className="font-semibold">{metric}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── One enquiry, two endings ─────────────────────────────────────────── */

function StorySection() {
  return (
    <section aria-labelledby="services-story" className="border-t border-border bg-surface-raised">
      <div className={SECTION}>
        <SectionHead
          id="services-story"
          eyebrow="One enquiry, two endings"
          title="It's 9:47 pm. A client messages."
          body="Same clinic. Same dentists. Same prices. The only difference is what happens after the message arrives. Switch between the two endings and follow one enquiry for six months."
        />
        <EnquiryStory />
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section aria-labelledby="services-features" className="bg-foreground text-background">
      <div className={SECTION}>
        <SectionHead
          dark
          id="services-features"
          eyebrow="What's included"
          title="Everything a service business needs"
          body="The trust, the booking and the follow-up, built to work together from day one. Start with what hurts most today, and add the rest as you grow."
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

/* ── Client journey ───────────────────────────────────────────────────── */

function JourneySection() {
  return (
    <section aria-labelledby="services-journey">
      <div className={SECTION}>
        <SectionHead
          id="services-journey"
          eyebrow="Beyond the website"
          title="From “near me” to “I recommend them”"
          body="A new client isn't won in one moment. They search, check, ask, book, turn up and, if you do it right, come back and bring friends. We make sure you win every step."
        />

        {/* `isolate` keeps the step numbers' z-index local, below the fixed header. */}
        <ol className="relative isolate grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-0">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-[linear-gradient(90deg,var(--track),var(--brand-bright)_85%,var(--track))] lg:block"
          />
          {CLIENT_JOURNEY.map((step, i) => (
            <li key={step.moment} className="relative lg:px-3 lg:first:pl-0 lg:last:pr-0">
              <Reveal delay={i * 0.06} className="flex h-full flex-col">
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-foreground bg-background font-mono text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="mt-5 flex flex-1 flex-col rounded-card-lg border border-border p-5">
                  <p className="font-archivo-black text-2xl uppercase tracking-[-0.05em]">
                    {step.moment}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{step.client}</p>
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

/* ── Process ──────────────────────────────────────────────────────────── */

function ProcessSection() {
  return (
    <section aria-labelledby="services-process" className="border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="services-process"
          eyebrow="How it works"
          title="From missed messages to a full calendar"
          body="Four clear steps. You keep serving clients the whole time, and you always know what's happening next."
        />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map(({ icon: Icon, title, body, youGet }, i) => (
            <li key={title}>
              <Reveal
                delay={i * 0.06}
                className="flex h-full flex-col rounded-card-lg border border-border p-6 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="font-archivo-black text-5xl leading-none tracking-[-0.06em] text-foreground/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden="true" className="size-5 text-brand-text" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{body}</p>
                <p className="mt-auto pt-6 text-sm">
                  <span className="mr-2 inline-block size-2 rounded-full bg-brand-bright align-middle" />
                  <span className="font-semibold">{youGet}</span>
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
            Bring your website or Google profile. We&apos;ll show you where
            enquiries are going cold.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** /for/service-businesses: the landing page for every business that sells its time and skill. */
export function ServiceBusinessesPage() {
  return (
    <div className="bg-background text-foreground">
      <ServicesHero />
      <QuestionWallSection />
      <SilentQuestionsSection />
      <TypesSection />
      <ModelsSection />
      <StorySection />
      <FeaturesSection />
      <JourneySection />
      <AudienceStageSection
        id="service-businesses"
        intro="Whatever service you offer, the right next step depends on where you are today. Pick the stage that sounds most like you."
      />
      <ProcessSection />
      <AudienceProofSection id="service-businesses" />
      <AudienceFaqSection id="service-businesses" />
      <AudienceEnquireSection id="service-businesses" />
    </div>
  );
}
