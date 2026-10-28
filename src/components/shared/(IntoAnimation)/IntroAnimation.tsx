"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LOGO_PATH, LOGO_VIEWBOX, DOT } from "../../../../public/assets/Videos/logoPath";
import { Suspense } from "react";


const REVEAL_DURATION = 2.2;
const START_DELAY = 0.2;
const HOLD_AFTER = 0.7;
const EASE = [0.45, 0, 0.25, 1] as const;
const DOT_START_X = 8;
const LETTERS_END_X = 520.5;

export default function IntroAnimation() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true); // server rendered it, so it's on from first paint
  const finished = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearTimeout(timer.current);
    document.cookie = "introSeen=1; path=/; SameSite=Lax"; // session cookie
    setShow(false);
  }, []);

  // reduced motion: skip entirely
  useEffect(() => {
    if (reduceMotion) finish();
  }, [reduceMotion, finish]);

  // scroll lock without layout shift
  useEffect(() => {
    if (!show) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "stable"; // prevents the ~15px jump
    return () => {
      html.style.overflow = prev;
      html.style.scrollbarGutter = "";
    };
  }, [show]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Suspense>
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <svg
            viewBox={`0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`}
            className="h-auto w-[min(70vw,520px)] overflow-visible"
            role="img"
            aria-label="Uthrix"
          >
            <defs>
              <clipPath id="uthrix-reveal">
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

            <g clipPath="url(#uthrix-reveal)">
              <path d={LOGO_PATH} fill="#fff" fillRule="evenodd" />
            </g>

            <motion.circle
              cy={DOT.cy}
              r={DOT.r}
              fill={DOT.color}
              initial={{ cx: DOT_START_X }}
              animate={{ cx: DOT.cx }}
              transition={{ duration: REVEAL_DURATION, delay: START_DELAY, ease: EASE }}
              onAnimationComplete={() => {
                timer.current = setTimeout(finish, HOLD_AFTER * 1000);
              }}
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
    </Suspense>
  );
}