"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import { InquiryForm } from "@/components/shared/InquiryForm";

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
              className="font-archivo-black w-full uppercase tracking-[-0.08em]"
            >
              <span className="block text-[clamp(3.5rem,17vw,8rem)] leading-[0.78] tracking-[-0.07em] sm:hidden">
                WE
              </span>
              <span className="block text-[clamp(3.5rem,17vw,8rem)] leading-[0.78] tracking-[-0.07em] sm:hidden">
                DESIGN
              </span>
              <span className="block text-[clamp(3.5rem,17vw,8rem)] leading-[0.78] tracking-[-0.07em] sm:hidden">
                PRODUCTS
              </span>
              <span className="block text-[clamp(3.5rem,17vw,8rem)] leading-[0.78] tracking-[-0.07em] sm:hidden">
                THAT <span className="text-brand">GROW.</span>
              </span>

              <span className="hidden whitespace-nowrap text-[clamp(6rem,10vw,20rem)] leading-[0.78] sm:block sm:-tracking-widest lg:text-[15.5cqw]">
                WE DESIGN
              </span>

              <span className="hidden whitespace-nowrap text-[clamp(6rem,10vw,20rem)] leading-[0.78] sm:block sm:-tracking-widest lg:text-[15.5cqw]">
                {" "}
                PRODUCTS
              </span>

              <span className="hidden whitespace-nowrap text-[clamp(6rem,10vw,20rem)] leading-[0.78] sm:block sm:-tracking-widest lg:text-[15.5cqw]">
                {" "}
                THAT <span className="text-brand">GROW.</span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans mt-4 max-w-250 text-[clamp(1.05rem,4.7vw,1.5rem)] leading-[1.3] tracking-tight text-foreground/95 sm:mt-4 sm:text-[clamp(1.25rem,2.1vw,2rem)] sm:leading-[1.18]"
            >
              We blend cutting-edge web & software development with data-driven
              digital marketing to accelerate your business growth and market
              dominance.
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
              <a
                href="#portfolio"
                className={`inline-flex h-15 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/85 ${focusRing}`}
              >
                View Case Studies
              </a>
            </motion.div>
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
