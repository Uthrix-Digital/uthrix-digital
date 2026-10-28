"use client"
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
export default function ConnectDots() {
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
              className="font-hkg w-full text-[clamp(3.25rem,13vw,11rem)] font-black uppercase leading-[0.86] tracking-[-0.07em] sm:text-[clamp(4rem,10vw,11rem)] sm:leading-[0.82] sm:tracking-[-0.075em]"
            >
              <span className="block sm:whitespace-nowrap">
                Let&apos;s connect dots.
              </span>
            </motion.h1>
          </motion.div>
        </div>
      </div>
    
  );
}
