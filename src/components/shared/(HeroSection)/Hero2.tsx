"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import { Suspense } from "react";
import { GrowthPathMap } from "@/components/shared/(GrowthPathMap)/GrowthPathMap";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
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

export function Hero2() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        aria-label="Uthrix Digital introduction"
        className="overflow-hidden bg-white pt-4 text-black sm:pt-32"
      >
        <div className="mx-auto w-full max-w-310 px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_425px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_548px]">
            {/* Left: headline + copy, actions */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <div>
                <motion.h1
                  variants={fadeUp}
                  className="type-display font-normal leading-[0.95] tracking-[-0.065em]"
                >
                  Digital
                  <br />
                  Excellence
                  <br />
                  Engineered for
                  <br />
                  <span className="text-[#c1121f]">Growth.</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-136 type-h5 leading-tight tracking-[-0.035em] text-black/90 sm:mt-4"
                >
                  We blend cutting-edge software development with data-driven
                  digital marketing to accelerate your business growth and
                  market dominance.
                </motion.p>
              </div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-1 lg:mt-6"
              >
                <a
                  href="#services"
                  className={`inline-flex h-14 items-center justify-center rounded-full bg-black px-9 text-sm font-medium text-white transition-transform hover:scale-[1.03] ${focusRing}`}
                >
                  See how we help
                </a>
                <a
                  href="#portfolio"
                  className={`inline-flex h-14 items-center justify-center rounded-full bg-[#eeeeee] px-8 text-sm font-medium text-black transition-colors hover:bg-[#e4e4e4] ${focusRing}`}
                >
                  View Case Studies
                </a>
              </motion.div>
            </motion.div>

            {/* Right: growth path map */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="w-full self-start"
            >
              <Suspense
                fallback={
                  <div
                    className="min-h-130 w-full animate-pulse rounded-2xl bg-black/3"
                    aria-label="Loading growth path map"
                  />
                }
              >
                
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
