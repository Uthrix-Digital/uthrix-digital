"use client";
import { Suspense } from "react";
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

export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-foreground text-white transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-none px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:px-12 lg:pt-38">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-col"
        >
          <motion.h1
            variants={fadeUp}
            className="font-archivo-black w-full text-[clamp(2.25rem,12vw,10rem)] font-black uppercase leading-[0.86] tracking-[-0.07em] sm:text-[clamp(1rem,8vw,10rem)] sm:leading-[0.82] sm:tracking-[-0.075em]"
          >
            <span className="block sm:whitespace-nowrap">
              About Us
            </span>
          </motion.h1>
          <div>
            <Suspense
              fallback={
                <div
                  className="min-h-130 w-full animate-pulse rounded-2xl bg-black/3"
                  aria-label="Loading growth path map"
                />
              }
            ></Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
