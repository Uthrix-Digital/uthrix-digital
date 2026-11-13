"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { InquiryForm } from "@/components/shared/InquiryForm";
import { audienceHref } from "@/config/audiences";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

// Each frame pairs what we deliver with who it's for.
const PAIRS = [
  { outcome: "Direct bookings", business: "boutique hotel" },
  { outcome: "Purchases", business: "online store" },
  { outcome: "Travel Enquiries", business: "tour company" },
  { outcome: "Showroom visits", business: "furniture store" },
  { outcome: "Qualified leads", business: "service business" },
] as const;

// "Show me for" shortcuts into the "Who we help" pages.
const AUDIENCE_PILLS = [
  { label: "Hotels & villas", href: audienceHref("hospitality") },
  { label: "Tour companies", href: audienceHref("hospitality") },
  { label: "Online stores", href: audienceHref("product-sellers") },
  { label: "Furniture & showrooms", href: audienceHref("product-sellers") },
  { label: "Service businesses", href: audienceHref("service-businesses") },
] as const;

const ROTATE_MS = 3200;
// The business word follows the outcome word a beat later.
const BUSINESS_DELAY = 0.18;

const lineClassBlack =
  "block whitespace-nowrap text-[10cqw] sm:text-[15cqw] leading-[0.78] tracking-[-0.07em] sm:-tracking-widest";

const lineClassGray =
  "block whitespace-nowrap text-chart-4 text-[10cqw] sm:text-[10.4cqw] leading-[0.78] tracking-[-0.07em] sm:-tracking-widest";

const lineClassRed =
  "block whitespace-nowrap text-brand text-[10cqw] sm:text-[10.4cqw] leading-[0.78] tracking-[-0.07em] sm:-tracking-widest";

function SlotWord({
  id,
  delay,
  children,
}: {
  id: number;
  delay: number;
  children: ReactNode;
}) {
  return (
    // Grid stacking lets the outgoing and incoming words overlap while sliding.
    <span className="-my-[0.08em] grid overflow-hidden py-[0.08em]">
      {/* presenceAffectsLayout={false}: with the default (true), framer-motion
          calls Math.random() during render, which cacheComponents rejects as
          an unstable prerender value. Nothing here uses layout animations. */}
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        <motion.span
          key={id}
          className="[grid-area:1/1]"
          initial={{ y: "110%", opacity: 0 }}
          animate={{
            y: "0%",
            opacity: 1,
            transition: { duration: 0.6, ease: EASE, delay },
          }}
          exit={{
            y: "-110%",
            opacity: 0,
            transition: { duration: 0.45, ease: EASE, delay },
          }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    // Skip ticks while the tab is hidden: animations pause there, so exiting
    // words would otherwise pile up and all fly out at once on return.
    const id = setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % PAIRS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const pair = PAIRS[index];

  return (
    <>
      <span className="sr-only">More customers for your business.</span>
      <span aria-hidden="true">
        <span className={lineClassBlack}>More</span>
        <span className={lineClassRed}>
          <SlotWord id={index} delay={0}>
            {pair.outcome}
          </SlotWord>
        </span>
        <span className={lineClassBlack}>For your</span>
        <span className={lineClassGray}>
          <SlotWord id={index} delay={BUSINESS_DELAY}>
            {pair.business}
          </SlotWord>
        </span>
      </span>
    </>
  );
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background";

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        aria-label="Uthrix Digital introduction"
        className="flex min-h-screen items-start overflow-hidden bg-background text-foreground"
      >
        <div className="mx-auto flex w-full max-w-none px-4 pb-12 pt-[clamp(7rem,20vw,9.5rem)] sm:px-6 sm:pb-20 sm:pt-[clamp(8rem,16vw,10rem)] lg:px-12 lg:pt-38">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_clamp(26rem,30vw,34rem)] lg:items-start lg:gap-12"
          >
            {/* Left column is a size container so the headline scales to the
                space left beside the form instead of the viewport. */}
            <div className="@container flex min-w-0 flex-col">
              <motion.h1
                variants={fadeUp}
                className="font-archivo-black w-full uppercase"
              >
                <RotatingHeadline />
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="font-sans mt-4 max-w-250 text-[clamp(1.05rem,4.7vw,1.5rem)] leading-[1.3] tracking-tight text-foreground/95 sm:mt-4 sm:text-[clamp(1.25rem,2.1vw,2rem)] sm:leading-[1.18]"
              >
                We build your website, run your Meta and Google ads, and follow
                up every lead. One small team, one plan, and one monthly report
                that shows what your money brought in.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3 sm:mt-2 sm:gap-2"
              >
                <a
                  href="#services"
                  className={`inline-flex h-15 items-center justify-center rounded-full bg-brand px-8 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03] hover:bg-brand-hover ${focusRing}`}
                >
                  See how we help
                </a>
                <Link
                  href="/case-studies"
                  className={`inline-flex h-15 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/85 ${focusRing}`}
                >
                  View Case Studies
                </Link>
              </motion.div>

              <motion.nav
                variants={fadeUp}
                aria-label="Show me for"
                className="mt-8 sm:mt-6"
              >
                <p className="nav-panel-label">Show me for</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {AUDIENCE_PILLS.map((pill) => (
                    <li key={pill.label}>
                      <Link
                        href={pill.href}
                        className={`inline-flex items-center rounded-full border border-foreground/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background ${focusRing}`}
                      >
                        {pill.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            </div>

            <motion.div
              variants={fadeUp}
              className="w-full max-w-xl lg:-mt-14 lg:max-w-none"
            >
              <InquiryForm />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
