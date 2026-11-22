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
import { CategoryExplorer } from "./CategoryExplorer";
import { COMMENTS, BUYER_JOURNEY, FEATURES, PROCESS, SALES_CHANNELS } from "./data";
import { DayInTheLife } from "./DayInTheLife";
import { SellersHero } from "./SellersHero";

/* ── The comment wall ─────────────────────────────────────────────────── */

function CommentRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Rendered twice so the -50% slide loops without a gap.
  const loop = [...items, ...items];
  return (
    <div
      className="comment-marquee flex w-max gap-3"
      style={
        {
          "--marquee-direction": reverse ? "reverse" : "normal",
          "--marquee-duration": reverse ? "52s" : "44s",
        } as CSSProperties
      }
    >
      {loop.map((text, i) => (
        <span
          key={`${text}-${i}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-background/15 bg-background/[0.06] py-2 pl-2 pr-4 text-sm font-semibold"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-background/15 font-mono text-[0.6rem] text-background/70">
            {String.fromCharCode(65 + (i % 26))}
          </span>
          {text}
        </span>
      ))}
    </div>
  );
}

function CommentWallSection() {
  const half = Math.ceil(COMMENTS.length / 2);
  return (
    <section aria-labelledby="sellers-comments" className="overflow-hidden bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-[100rem] gap-6 px-[clamp(1.25rem,5vw,5rem)] pb-8 pt-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
            Sound familiar?
          </p>
          <h2
            id="sellers-comments"
            className="font-archivo-black mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,4rem)] uppercase leading-[0.9] tracking-[-0.07em]"
          >
            Every one of these is an order <span className="text-brand-bright">waiting to happen</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-md text-base leading-relaxed text-background/70 sm:text-lg">
            Buyers don&apos;t leave because they aren&apos;t interested. They
            leave because the answer took three hours. We make sure every
            question gets the price, the details and the order link in seconds.
          </p>
        </Reveal>
      </div>
      {/* Decorative: the list is the same as the copy above says. */}
      <div
        aria-hidden="true"
        className="comment-marquee-wrap grid gap-3 pb-[clamp(3rem,6vw,5rem)] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      >
        <CommentRow items={COMMENTS.slice(0, half)} />
        <CommentRow items={COMMENTS.slice(half)} reverse />
      </div>
    </section>
  );
}

/* ── What you sell ────────────────────────────────────────────────────── */

function CategoriesSection() {
  return (
    <section
      id="categories"
      aria-labelledby="sellers-categories"
      className="scroll-mt-20 border-t border-border bg-surface-raised"
    >
      <div className={SECTION}>
        <SectionHead
          id="sellers-categories"
          eyebrow="Every kind of product"
          title="What do you sell?"
          body="A cake maker and a phone shop don't need the same store. Pick what you sell to see what your buyers look for, what we build and the numbers we'll move."
        />
        <Suspense
          fallback={
            <div
              className="min-h-[32rem] w-full animate-pulse rounded-card-lg bg-foreground/5"
              aria-label="Loading product categories"
            />
          }
        >
          <CategoryExplorer />
        </Suspense>
        <Reveal className="mt-8">
          <p className="text-sm text-muted-foreground">
            Don&apos;t see yours? We work with any business that sells a
            physical product.{" "}
            <Link
              href="#enquire"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
            >
              Tell us what you sell
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── How you sell ─────────────────────────────────────────────────────── */

function ChannelsSection() {
  return (
    <section id="channels" aria-labelledby="sellers-channels" className="scroll-mt-20 border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="sellers-channels"
          eyebrow="Every way of selling"
          title="And how do you sell it?"
          body="Where your orders come from changes what gets stuck. Most sellers use two or three of these. We connect them, so it all ends up in one place."
        />
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SALES_CHANNELS.map(({ id, label, icon: Icon, who, quote, fix, metric }, i) => (
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

/* ── A day in the life ────────────────────────────────────────────────── */

function DaySection() {
  return (
    <section aria-labelledby="sellers-day" className="border-t border-border bg-surface-raised">
      <div className={SECTION}>
        <SectionHead
          id="sellers-day"
          eyebrow="Same business, different day"
          title="What changes for you"
          body="You didn't start a business to copy addresses into Excel at midnight. Switch between the two days and see what a proper order system gives back."
        />
        <DayInTheLife />
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section aria-labelledby="sellers-features" className="bg-foreground text-background">
      <div className={SECTION}>
        <SectionHead
          dark
          id="sellers-features"
          eyebrow="What's included"
          title="Everything a selling business needs"
          body="The store, the content and the systems behind them, built to work together from day one. Pick what you need now, add the rest as you grow."
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

/* ── Buyer journey ────────────────────────────────────────────────────── */

function JourneySection() {
  return (
    <section aria-labelledby="sellers-journey">
      <div className={SECTION}>
        <SectionHead
          id="sellers-journey"
          eyebrow="Beyond the store"
          title="From first scroll to second order"
          body="A sale isn't one moment. Buyers scroll, search, check you out, order, wait and, if you do it right, come back. We make sure you win at every step."
        />

        {/* `isolate` keeps the step numbers' z-index local, below the fixed header. */}
        <ol className="relative isolate grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-0">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-[linear-gradient(90deg,var(--track),var(--brand-bright)_85%,var(--track))] lg:block"
          />
          {BUYER_JOURNEY.map((step, i) => (
            <li key={step.moment} className="relative lg:px-3 lg:first:pl-0 lg:last:pr-0">
              <Reveal delay={i * 0.06} className="flex h-full flex-col">
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-foreground bg-background font-mono text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="mt-5 flex flex-1 flex-col rounded-card-lg border border-border p-5">
                  <p className="font-archivo-black text-2xl uppercase tracking-[-0.05em]">
                    {step.moment}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{step.buyer}</p>
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
    <section aria-labelledby="sellers-process" className="border-t border-border">
      <div className={SECTION}>
        <SectionHead
          id="sellers-process"
          eyebrow="How it works"
          title="From scattered chats to one order system"
          body="Four clear steps. You keep selling the whole time, and you always know what's happening next."
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
            Bring your page link. We&apos;ll show you where orders are leaking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** /for/product-sellers: the landing page for every business that sells products. */
export function ProductSellersPage() {
  return (
    <div className="bg-background text-foreground">
      <SellersHero />
      <CommentWallSection />
      <CategoriesSection />
      <ChannelsSection />
      <DaySection />
      <FeaturesSection />
      <JourneySection />
      <AudienceStageSection
        id="product-sellers"
        intro="Whatever you sell and however you sell it, the right next step depends on where you are today. Pick the stage that sounds most like you."
      />
      <ProcessSection />
      <AudienceProofSection id="product-sellers" />
      <AudienceFaqSection id="product-sellers" />
      <AudienceEnquireSection id="product-sellers" />
    </div>
  );
}
