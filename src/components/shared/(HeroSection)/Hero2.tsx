"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";

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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4";

export function Hero2() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        aria-label="Uthrix Digital introduction"
        className="flex min-h-screen items-start overflow-hidden bg-[#0b0b0b] text-white"
      >
        <div className="mx-auto flex w-full max-w-none px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:px-12 lg:pt-38">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex w-full flex-col"
          >
            <motion.h1
              variants={fadeUp}
              className="font-hkg w-full text-[clamp(3.25rem,13vw,11rem)] font-black uppercase leading-[0.86] tracking-[-0.07em] sm:text-[clamp(4rem,10vw,11rem)] sm:leading-[0.82] sm:tracking-[-0.075em]"
            >
              <span className="block sm:whitespace-nowrap">
                Digital Excellence
              </span>

              <span className="block sm:whitespace-nowrap">
                Engineered for
              </span>

              <span className="block text-[#d00000] sm:whitespace-nowrap">
                Growth.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans mt-6 max-w-250 text-[clamp(1.05rem,3.8vw,2rem)] leading-[1.3] tracking-tight text-white/95 sm:mt-4 sm:text-[clamp(1.25rem,2.1vw,2rem)] sm:leading-[1.18]"
            >
              We blend cutting-edge web & software development with data-driven
              digital marketing to accelerate your business growth and market
              dominance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-20 flex flex-wrap gap-2 sm:mt-2"
            >
              <a
                href="#services"
                className={`inline-flex h-15 items-center justify-center rounded-full bg-[#d00000] px-8 text-base font-medium text-white transition-transform hover:scale-[1.03] hover:bg-[#e00000] ${focusRing}`}
              >
                See how we help
              </a>
              <a
                href="#portfolio"
                className={`inline-flex h-15 items-center justify-center rounded-full bg-[#f1f1f1] px-8 text-base font-medium text-black transition-colors hover:bg-white ${focusRing}`}
              >
                View Case Studies
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
