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
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.15 },
  },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4";

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        aria-label="Uthrix Digital introduction"
        className="overflow-hidden bg-white pt-28 text-black sm:pt-32"
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_425px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_548px]">
            {/* Left: headline + copy centred, actions pinned to the form's bottom edge */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col lg:min-h-[calc(100svh-9rem)]"
            >
              <div className="my-auto">
                <motion.h1
                  variants={fadeUp}
                  className="text-[clamp(2.75rem,7.25vw,6.9rem)] font-normal leading-[0.95] tracking-[-0.065em]"
                >
                  Digital
                  <br />
                  Excellence
                  <br />
                  Engineered for
                  <br />
                  Growth
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-[34rem] text-[clamp(1.05rem,1.7vw,1.5rem)] leading-[1.25] tracking-[-0.035em] text-black/90 sm:mt-8"
                >
                  We blend cutting-edge software development with data-driven
                  digital marketing to accelerate your business growth and
                  market dominance.
                </motion.p>
              </div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-3 lg:mt-12"
              >
                <a
                  href="#contact"
                  className={`inline-flex h-14 items-center justify-center rounded-full bg-black px-9 text-sm font-medium text-white transition-transform hover:scale-[1.03] ${focusRing}`}
                >
                  Start a project
                </a>
                <a
                  href="#portfolio"
                  className={`inline-flex h-14 items-center justify-center rounded-full bg-[#eeeeee] px-8 text-sm font-medium text-black transition-colors hover:bg-[#e4e4e4] ${focusRing}`}
                >
                  View Case Studies
                </a>
              </motion.div>
            </motion.div>

            {/* Right: lead form */}
            <motion.div
              id="contact"
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="w-full scroll-mt-28 self-start"
            >
              <InquiryForm />
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
