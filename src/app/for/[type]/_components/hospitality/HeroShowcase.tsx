"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Lock,
  MapPin,
  RotateCw,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

/*
 * Hero illustration for /for/hospitality. A fictional villa's website, with
 * the page's promises around it as real-looking UI: WhatsApp enquiries on a
 * phone, a direct booking notification, reviews and a direct-booking report.
 * The "site" keeps its own light palette in both themes, like a screenshot.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft spring shared by the pointer parallax: settles without wobbling. */
const SPRING = { stiffness: 70, damping: 20, mass: 0.9 };

interface Pointer {
  /** -0.5 … 0.5 across the viewport, spring-smoothed. */
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * A floating card in three layers, each owning one kind of motion so they
 * never fight over the same transform:
 *  1. entry   – pops in once after `delay` (framer-motion)
 *  2. depth   – drifts against the pointer by `depth` px (spring)
 *  3. idle    – a slow float loop in pure CSS, on the compositor
 */
function Floating({
  children,
  className,
  delay,
  pointer,
  depth,
  drift = -8,
  tilt = 0,
  duration = 7,
  phase = 0,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  pointer: Pointer;
  /** How far (px) the card shifts at full pointer travel. Bigger = closer. */
  depth: number;
  drift?: number;
  tilt?: number;
  duration?: number;
  /** Seconds into the float loop to start, so cards don't move in sync. */
  phase?: number;
}) {
  const x = useTransform(pointer.x, (v) => v * depth);
  const y = useTransform(pointer.y, (v) => v * depth);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      <motion.div style={{ x, y }}>
        <div
          className="showcase-float"
          style={
            {
              "--float-drift": `${drift}px`,
              "--float-tilt": `${tilt}deg`,
              "--float-duration": `${duration}s`,
              "--float-delay": `${-phase}s`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Pointer position over the viewport as two spring values. Only follows
 * a fine pointer (mouse/trackpad) and stays still for reduced motion.
 */
function usePointerParallax(): Pointer {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, rawX, rawY]);

  return { x, y };
}

/* ── Pieces of the fake website ──────────────────────────────────────── */

function Palm({ className, flip = false }: { className: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 140 200"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        fill="currentColor"
        d="M70 200c-1-40 2-82 16-122l5 2c-12 38-15 80-14 120z"
      />
      <path
        fill="currentColor"
        d="M88 78C70 60 38 56 10 70c26-6 52-2 76 12zM88 78c-6-26-28-44-56-46 24 10 40 26 52 48zM88 78c10-24 34-36 60-32-26 4-44 16-58 34zM88 78c22-6 44 4 52 24-18-12-34-16-52-20zM88 78c-22 2-40 18-46 40 12-18 28-30 48-36z"
      />
    </svg>
  );
}

function SunsetScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#241d47_0%,#5e2f5f_30%,#c4566a_52%,#f08a5d_66%,#f9c27a_74%)]" />
      {/* Sun + glow */}
      <div className="absolute left-[60%] top-[47%] size-16 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#fff8dc_0%,#ffd98a_55%,#ffb35c_100%)] shadow-[0_0_60px_24px_rgba(255,186,110,0.55)] sm:size-20" />
      {/* Far hills */}
      <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 top-[58%] h-[9%] w-full text-[#4a2b52]">
        <path fill="currentColor" d="M0 40V22c30-10 60-16 95-8s60 12 90 2 55-6 80 0 40 8 70-6 45-8 65-4v34z" />
      </svg>
      {/* Sea */}
      <div className="absolute inset-x-0 bottom-0 top-[66%] bg-[linear-gradient(180deg,#5a4a78_0%,#2b2c55_45%,#141834_100%)]" />
      <div className="absolute inset-x-0 top-[66%] h-px bg-[#ffd9a0]/70" />
      {/* Sun reflection */}
      <div className="absolute left-[60%] top-[66%] h-[34%] w-20 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,rgba(255,206,140,0.75)_0_2px,transparent_2px_7px)] [mask-image:linear-gradient(180deg,#000,transparent)]" />
      {/* Infinity pool edge + deck in the foreground */}
      <div className="absolute inset-x-0 bottom-0 h-[20%] bg-[linear-gradient(180deg,#3fa3b3_0%,#1f6876_100%)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[#e9f3f1]" />
        <div className="absolute inset-x-[30%] top-2 h-px bg-white/40" />
        <div className="absolute inset-x-[45%] top-4 h-px bg-white/30" />
      </div>
      {/* Palms */}
      <Palm className="absolute -left-6 bottom-[14%] h-[95%] text-[#160f22]" />
      <Palm flip className="absolute -right-10 bottom-[16%] h-[70%] text-[#160f22]" />
    </div>
  );
}

const ROOMS = [
  {
    name: "Ocean Suite",
    price: "$180",
    scene: "bg-[linear-gradient(160deg,#f6e3c4_0%,#e2b483_55%,#b97c52_100%)]",
    detail: "bg-white/80",
  },
  {
    name: "Garden Villa",
    price: "$220",
    scene: "bg-[linear-gradient(160deg,#cfe6c4_0%,#79ac78_55%,#3d6e48_100%)]",
    detail: "bg-[#f4efe6]/85",
  },
  {
    name: "Pool House",
    price: "$260",
    scene: "bg-[linear-gradient(160deg,#cdeff2_0%,#6cc0cc_55%,#2a7f90_100%)]",
    detail: "bg-white/75",
  },
];

function VillaSite() {
  return (
    <div className="@container overflow-hidden rounded-[1.1rem] bg-white text-[#16161a] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-black/5 bg-[#f3f3f5] px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-md bg-white px-3 py-1 text-[0.62rem] text-[#55555c] ring-1 ring-black/5">
          <Lock className="size-2.5" />
          yourvilla.lk
        </span>
        <RotateCw className="size-3 text-[#8a8a90]" />
      </div>

      {/* Site nav */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="font-serif text-[0.95rem] font-semibold italic tracking-tight">
          Serenity<span className="text-[#c4566a]">.</span>
        </span>
        <span className="hidden gap-4 text-[0.6rem] font-medium text-[#55555c] sm:flex">
          <span>Rooms</span>
          <span>Experiences</span>
          <span>Gallery</span>
          <span>Reviews</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="hidden items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.55rem] font-semibold text-[#55555c] ring-1 ring-black/10 sm:flex">
            EN · USD <ChevronDown className="size-2.5" />
          </span>
          <span className="rounded-full bg-[#16161a] px-2.5 py-1 text-[0.55rem] font-semibold text-white">
            Book now
          </span>
        </span>
      </div>

      {/* Hero "photo" */}
      <div className="relative mx-2 h-52 rounded-xl sm:h-64">
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <SunsetScene />
          <div className="absolute left-5 top-5 max-w-[15rem] text-white sm:left-7 sm:top-7">
            <p className="flex items-center gap-1 text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/80">
              <MapPin className="size-2.5" />
              Mirissa, Sri Lanka
            </p>
            <p className="mt-1.5 font-serif text-[1.45rem] leading-[1.05] sm:text-[1.8rem]">
              Wake up to the Indian Ocean
            </p>
          </div>
        </div>

        {/* Booking bar */}
        <div className="absolute inset-x-3 bottom-0 grid translate-y-1/2 grid-cols-[1fr_1fr_auto] items-center gap-1 whitespace-nowrap rounded-xl bg-white p-1.5 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 @[34rem]:inset-x-6 @[34rem]:grid-cols-[1fr_1fr_1fr_auto]">
          <span className="flex items-center gap-2 rounded-lg px-2.5 py-1.5">
            <CalendarDays className="size-3.5 text-[#c4566a]" />
            <span>
              <span className="block text-[0.5rem] uppercase tracking-[0.12em] text-[#8a8a90]">Check in</span>
              <span className="block text-[0.68rem] font-semibold">12 Feb</span>
            </span>
          </span>
          <span className="flex items-center gap-2 border-l border-black/5 px-2.5 py-1.5">
            <CalendarDays className="size-3.5 text-[#c4566a]" />
            <span>
              <span className="block text-[0.5rem] uppercase tracking-[0.12em] text-[#8a8a90]">Check out</span>
              <span className="block text-[0.68rem] font-semibold">15 Feb</span>
            </span>
          </span>
          <span className="hidden items-center gap-2 border-l border-black/5 px-2.5 py-1.5 @[34rem]:flex">
            <Users className="size-3.5 text-[#c4566a]" />
            <span>
              <span className="block text-[0.5rem] uppercase tracking-[0.12em] text-[#8a8a90]">Guests</span>
              <span className="block text-[0.68rem] font-semibold">2 adults</span>
            </span>
          </span>
          <span className="rounded-lg bg-[#c40202] px-3 py-2.5 text-[0.65rem] font-semibold text-white">
            Book direct
          </span>
        </div>
      </div>

      {/* Below the fold: rooms */}
      <div className="px-4 pb-4 pt-10">
        <div className="flex items-center justify-between">
          <p className="font-serif text-[0.85rem] font-semibold">Choose your stay</p>
          <p className="flex items-center gap-1 text-[0.55rem] font-semibold text-[#1f8a4c]">
            <Check className="size-3" />
            Best rate when you book direct
          </p>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {ROOMS.map((room) => (
            <div key={room.name} className="overflow-hidden rounded-lg ring-1 ring-black/5">
              <div className={`relative h-12 sm:h-16 ${room.scene}`}>
                {/* a bed / lounger shape so it reads as a room photo */}
                <span className={`absolute bottom-2 left-1/2 h-2.5 w-3/5 -translate-x-1/2 rounded-sm ${room.detail}`} />
                <span className={`absolute bottom-[1.05rem] left-[24%] h-1.5 w-[18%] rounded-sm ${room.detail}`} />
              </div>
              <div className="px-2 py-1.5">
                <p className="truncate text-[0.6rem] font-semibold">{room.name}</p>
                <p className="text-[0.52rem] text-[#8a8a90]">
                  from <span className="font-semibold text-[#16161a]">{room.price}</span> / night
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Things around the site ──────────────────────────────────────────── */

function WhatsAppPhone() {
  return (
    <div className="w-[8.25rem] rounded-[1.6rem] bg-[#0d0d10] p-[5px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:w-[10.5rem]">
      <div className="relative overflow-hidden rounded-[1.3rem] bg-[#efeae2]">
        {/* Dynamic island */}
        <span className="absolute left-1/2 top-1.5 z-10 h-3 w-10 -translate-x-1/2 rounded-full bg-black" />
        {/* Chat header */}
        <div className="flex items-center gap-1.5 bg-[#075e54] px-2.5 pb-2 pt-6 text-white">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#f9c27a] font-serif text-[0.55rem] font-bold italic text-[#5e2f5f]">
            S
          </span>
          <span className="leading-tight">
            <span className="block text-[0.58rem] font-semibold">Serenity Villa</span>
            <span className="block text-[0.46rem] text-white/70">online</span>
          </span>
        </div>
        {/* Messages */}
        <div className="flex flex-col gap-1.5 px-2 py-2.5 text-[0.55rem] leading-snug text-[#111b21] sm:text-[0.6rem]">
          <span className="self-center rounded bg-white/80 px-1.5 py-0.5 text-[0.45rem] text-[#54656f]">TODAY</span>
          <span className="max-w-[85%] self-end rounded-lg rounded-tr-none bg-[#d9fdd3] px-2 py-1.5 shadow-sm">
            Hi! Is the villa free 12–15 Feb for 2?
            <span className="mt-0.5 block text-right text-[0.42rem] text-[#667781]">09:41 ✓✓</span>
          </span>
          <span className="max-w-[88%] rounded-lg rounded-tl-none bg-white px-2 py-1.5 shadow-sm">
            Yes, it is! 3 nights from $540, breakfast included.
            <span className="mt-1 block overflow-hidden rounded-md bg-[#f0f2f5]">
              <span className="block h-6 bg-[linear-gradient(180deg,#c4566a,#f9c27a)]" />
              <span className="block px-1.5 py-1 text-[0.48rem] font-semibold text-[#027eb5]">
                yourvilla.lk/book
              </span>
            </span>
            <span className="mt-0.5 block text-right text-[0.42rem] text-[#667781]">09:42</span>
          </span>
          {/* Typing */}
          <span className="flex w-fit items-center gap-0.5 rounded-lg rounded-tl-none bg-white px-2 py-1.5 shadow-sm">
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                className="size-1 animate-bounce rounded-full bg-[#8696a0]"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

function BookingNotification() {
  return (
    <div className="flex w-[13.5rem] items-start gap-2.5 rounded-2xl bg-white p-2.5 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-[15.5rem]">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#c40202] text-white">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[0.62rem] font-semibold">New direct booking</span>
          <span className="text-[0.5rem] text-[#8a8a90]">now</span>
        </span>
        <span className="block text-[0.58rem] text-[#55555c]">Ocean Suite · 3 nights · $540</span>
        <span className="mt-1 inline-flex rounded-full bg-[#e7f6ec] px-1.5 py-0.5 text-[0.5rem] font-semibold text-[#1f8a4c]">
          0% commission paid
        </span>
      </span>
    </div>
  );
}

function ReviewsCard() {
  return (
    <div className="w-[11rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <span className="text-[0.85rem] font-bold leading-none">
          <span className="text-[#4285f4]">G</span>
          <span className="text-[#ea4335]">o</span>
          <span className="text-[#fbbc05]">o</span>
          <span className="text-[#4285f4]">g</span>
          <span className="text-[#34a853]">l</span>
          <span className="text-[#ea4335]">e</span>
        </span>
        <span className="text-[0.55rem] text-[#8a8a90]">reviews</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="text-xl font-bold leading-none">4.9</span>
        <span className="flex text-[#fbbc05]">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3 fill-current" />
          ))}
        </span>
      </div>
      <p className="mt-1.5 text-[0.55rem] leading-snug text-[#55555c]">
        &ldquo;Booked on their site, and the host replied on WhatsApp in minutes.&rdquo;
      </p>
    </div>
  );
}

const BARS = [28, 34, 31, 45, 52, 64];

function DirectShareCard() {
  const reduce = useReducedMotion();

  return (
    <div className="w-[10.5rem] rounded-2xl bg-[#16161a] p-3 text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <span className="text-[0.55rem] uppercase tracking-[0.14em] text-white/55">Direct bookings</span>
        <TrendingUp className="size-3 text-[#4ade80]" />
      </div>
      <p className="mt-1 text-lg font-bold leading-none">
        64<span className="text-xs text-white/55">% of all</span>
      </p>
      <div className="mt-2.5 flex h-10 items-end gap-1.5">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className={`flex-1 origin-bottom rounded-sm ${
              i === BARS.length - 1 ? "bg-[#ff1f28]" : "bg-white/25"
            }`}
            style={{ height: `${h * 1.5}%` }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.4 + i * 0.07 }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[0.45rem] text-white/40">
        <span>Sep</span>
        <span>Feb</span>
      </div>
    </div>
  );
}

/** The full composition. Decorative: the page text says the same things. */
export function HeroShowcase() {
  const pointer = usePointerParallax();
  // The site leans a few degrees toward the pointer, like a card on a table.
  const rotateY = useTransform(pointer.x, (v) => v * 7);
  const rotateX = useTransform(pointer.y, (v) => v * -5);
  const siteX = useTransform(pointer.x, (v) => v * -10);
  const siteY = useTransform(pointer.y, (v) => v * -8);
  const glowX = useTransform(pointer.x, (v) => v * -40);

  return (
    // `isolate` keeps the cards' z-index local, so they never cover the fixed header.
    <div
      aria-hidden="true"
      className="relative isolate mx-auto w-full max-w-[40rem] select-none pb-14 pt-10 [perspective:1400px] sm:pb-16 sm:pl-10 sm:pt-12"
    >
      {/* Soft brand glow behind everything; drifts the other way for depth */}
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute inset-x-[10%] top-[15%] h-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(240,138,93,0.35),transparent)] blur-2xl"
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 32, rotateX: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
        style={{ transformPerspective: 1400 }}
      >
        <motion.div
          style={{ rotateX, rotateY, x: siteX, y: siteY, transformPerspective: 1400 }}
          className="will-change-transform"
        >
          <VillaSite />
        </motion.div>
      </motion.div>

      <Floating
        pointer={pointer}
        depth={26}
        delay={0.7}
        duration={6.5}
        drift={-7}
        tilt={-0.6}
        phase={0}
        className="absolute left-0 top-0 z-20 sm:-left-2 lg:-left-10"
      >
        <BookingNotification />
      </Floating>

      <Floating
        pointer={pointer}
        depth={34}
        delay={1.05}
        duration={8}
        drift={-9}
        tilt={0.8}
        phase={2.4}
        className="absolute -right-2 top-[18%] z-20 hidden sm:block lg:-right-10"
      >
        <DirectShareCard />
      </Floating>

      <Floating
        pointer={pointer}
        depth={22}
        delay={1.35}
        duration={9}
        drift={-6}
        tilt={0.5}
        phase={4.1}
        className="absolute bottom-0 left-0 z-20 hidden sm:block lg:-left-12"
      >
        <ReviewsCard />
      </Floating>

      <Floating
        pointer={pointer}
        depth={44}
        delay={0.9}
        duration={7.5}
        drift={-10}
        tilt={-0.8}
        phase={1.2}
        className="absolute -bottom-2 -right-1 z-30 sm:-right-4 lg:-right-12"
      >
        <WhatsAppPhone />
      </Floating>
    </div>
  );
}
