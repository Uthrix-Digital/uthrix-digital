"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LOGO_PATH, LOGO_VIEWBOX, DOT } from "../../../public/assets/Videos/logoPath";

const REVEAL_DURATION = 2.2; // seconds the wipe takes
const START_DELAY = 0.2;
const HOLD_AFTER = 0.7; // how long the finished logo stays before fading out
const EASE = [0.45, 0, 0.25, 1] as const;

const DOT_START_X = 8; // dot starts at the far left
const LETTERS_END_X = 520.5; // clip width that fully reveals the letters

export default function IntroAnimation() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState<boolean | null>(null); // null = undecided

  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");
    setShow(!seen && !reduceMotion);
  }, [reduceMotion]);

  // lock scroll while the intro is visible
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const finish = () => {
    sessionStorage.setItem("introSeen", "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <svg
            viewBox={`0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`}
            className="w-[min(70vw,520px)] h-auto overflow-visible"
            role="img"
            aria-label="Uthrix"
          >
            <defs>
              <clipPath id="uthrix-reveal">
                {/* wipe: grows left → right */}
                <motion.rect
                  x={0}
                  y={-20}
                  height={LOGO_VIEWBOX.h + 40}
                  initial={{ width: 0 }}
                  animate={{ width: LETTERS_END_X }}
                  transition={{ duration: REVEAL_DURATION, delay: START_DELAY, ease: EASE }}
                />
              </clipPath>
            </defs>

            {/* white wordmark, revealed by the clip */}
            <g clipPath="url(#uthrix-reveal)">
              <path d={LOGO_PATH} fill="#fff" fillRule="evenodd" />
            </g>

            {/* red dot rides the leading edge and ends as the full stop */}
            <motion.circle
              cy={DOT.cy}
              r={DOT.r}
              fill={DOT.color}
              initial={{ cx: DOT_START_X }}
              animate={{ cx: DOT.cx }}
              transition={{ duration: REVEAL_DURATION, delay: START_DELAY, ease: EASE }}
              onAnimationComplete={() => setTimeout(finish, HOLD_AFTER * 1000)}
            />
          </svg>

          <button
            onClick={finish}
            className="absolute bottom-6 right-6 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/25"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
