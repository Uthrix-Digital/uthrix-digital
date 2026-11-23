"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import {
  CalendarCheck,
  Check,
  Clock,
  Lock,
  MapPin,
  Navigation,
  Phone,
  RotateCw,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  Floating,
  usePointerParallax,
} from "@/app/for/[type]/_components/hospitality/HeroShowcase";

/*
 * Hero illustration for /for/service-businesses. A fictional clinic's website,
 * with the page's promises around it as real-looking UI: a Google Maps result,
 * an online booking, a WhatsApp reminder and a weekly enquiries report.
 * The "site" keeps its own light palette in both themes.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const IMG = "/assets/Images/service-businesses";

/*
 * Photos: Unsplash (Unsplash License), cropped. Photo IDs:
 * hero-consultation Bg81yWKZlMg (mirrored), service-checkup BiknMFl7iOw,
 * service-whitening Vx71zsOqtSU, service-braces B9lLokDYTMY,
 * team-1 9_1Y_IKP4tY, team-2 ODM_VsTM2QQ, maps-clinic z8BIWPwV3zo,
 * patient ODoUefKfJHE.
 */
const SERVICES = [
  { name: "Check-up & clean", price: "3,500", time: "30 min", image: `${IMG}/service-checkup.jpg` },
  { name: "Teeth whitening", price: "18,000", time: "60 min", image: `${IMG}/service-whitening.jpg` },
  { name: "Braces consult", price: "2,500", time: "20 min", image: `${IMG}/service-braces.jpg` },
];

const TEAM = [`${IMG}/team-1.jpg`, `${IMG}/team-2.jpg`];

function ClinicSite() {
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
          yourclinic.lk
        </span>
        <RotateCw className="size-3 text-[#8a8a90]" />
      </div>

      {/* Site nav */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[0.95rem] font-black tracking-[-0.04em]">
          bright<span className="text-[#0f8b8d]">smile</span>
        </span>
        <span className="hidden gap-4 text-[0.6rem] font-medium text-[#55555c] sm:flex">
          <span className="text-[#16161a]">Treatments</span>
          <span>Our team</span>
          <span>Prices</span>
          <span>Reviews</span>
        </span>
        <span className="rounded-full bg-[#16161a] px-2.5 py-1 text-[0.55rem] font-bold text-white">
          Book online
        </span>
      </div>

      {/* Hero banner */}
      <div className="relative mx-2 overflow-hidden rounded-xl bg-[#0f8b8d] px-5 py-6 text-white sm:px-7 sm:py-7">
        <Image
          src={`${IMG}/hero-consultation.jpg`}
          alt=""
          fill
          preload
          sizes="(min-width: 1200px) 38rem, (min-width: 640px) 36rem, 92vw"
          className="object-cover object-[100%_38%]"
        />
        {/* Clinic-teal wash on the left so the headline reads on the photo */}
        <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(8,74,76,0.95)_0%,rgba(10,96,98,0.82)_45%,rgba(15,139,141,0.15)_72%,transparent_90%)]" />
        <p className="relative text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-white/80">
          Family dental care · Nugegoda
        </p>
        <p className="relative mt-1.5 max-w-[13rem] text-[1.3rem] font-black leading-[1] tracking-[-0.04em] sm:text-[1.6rem]">
          Gentle dentists. Evening &amp; weekend slots.
        </p>
        <div className="relative mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[0.58rem] font-bold text-[#0f5f60]">
            <CalendarCheck className="size-2.5" />
            See today&apos;s slots
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/15 px-2.5 py-1.5 text-[0.55rem] font-semibold">
            <Star className="size-2.5 fill-[#fbbc05] text-[#fbbc05]" />
            4.9 · 312 Google reviews
          </span>
        </div>
      </div>

      {/* Trust strip */}
      <div className="mx-2 mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-lg bg-[#f6f6f7] px-3 py-1.5 text-[0.5rem] font-semibold text-[#55555c]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-2.5 text-[#1f8a4c]" /> SLMC-registered dentists
        </span>
        <span className="flex items-center gap-1">
          <Check className="size-2.5 text-[#1f8a4c]" /> Prices shown up front
        </span>
        <span className="hidden items-center gap-1 @[28rem]:flex">
          <Check className="size-2.5 text-[#1f8a4c]" /> Payment plans
        </span>
      </div>

      {/* Services + team */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 px-2 pb-3 pt-2.5">
        <ul className="grid gap-1.5">
          {SERVICES.map(({ name, price, time, image }) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 ring-1 ring-black/5"
            >
              <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-[#e4e4e9]">
                <Image src={image} alt="" fill sizes="2rem" className="object-cover" />
              </span>
              <span className="mr-auto">
                <span className="block text-[0.58rem] font-semibold">{name}</span>
                <span className="flex items-center gap-1 text-[0.46rem] text-[#8a8a90]">
                  <Clock className="size-2" /> {time}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-[0.45rem] text-[#8a8a90]">from</span>
                <span className="block text-[0.56rem] font-bold">Rs. {price}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex w-[5.5rem] flex-col justify-between rounded-lg bg-[#f6f6f7] p-2 sm:w-[6.5rem]">
          <span className="text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-[#8a8a90]">
            Our team
          </span>
          <span className="flex -space-x-1.5">
            {TEAM.map((src) => (
              <span
                key={src}
                className="relative size-7 overflow-hidden rounded-full bg-[#e4e4e9] ring-2 ring-[#f6f6f7]"
              >
                <Image src={src} alt="" fill sizes="1.75rem" className="object-cover" />
              </span>
            ))}
            <span className="flex size-7 items-center justify-center rounded-full bg-[#0f8b8d] text-[0.45rem] font-bold text-white ring-2 ring-[#f6f6f7]">
              +1
            </span>
          </span>
          <span className="text-[0.48rem] leading-snug text-[#55555c]">3 dentists, 12 years in Nugegoda</span>
        </div>
      </div>
    </div>
  );
}

/* ── Things around the site ──────────────────────────────────────────── */

function MapsCard() {
  return (
    <div className="w-[13.5rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-[15rem]">
      <p className="flex items-center gap-1.5 rounded-full bg-[#f1f3f4] px-2.5 py-1 text-[0.55rem] text-[#55555c]">
        <MapPin className="size-2.5 text-[#ea4335]" />
        dentist near me
      </p>
      <div className="relative mt-2 h-16 overflow-hidden rounded-lg bg-[#e4e4e9]">
        <Image src={`${IMG}/maps-clinic.jpg`} alt="" fill sizes="15rem" className="object-cover object-[50%_30%]" />
        <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1 text-[0.42rem] font-semibold text-white">
          1/48
        </span>
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.66rem] font-semibold leading-tight">Bright Smile Dental</p>
          <p className="mt-0.5 flex items-center gap-1 text-[0.5rem] text-[#55555c]">
            4.9
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-2 fill-[#fbbc05] text-[#fbbc05]" />
              ))}
            </span>
            (312)
          </p>
          <p className="text-[0.5rem] text-[#55555c]">
            <span className="font-semibold text-[#1f8a4c]">Open</span> · Closes 9 pm · 0.8 km
          </p>
        </div>
        <span className="rounded-md bg-[#e8f0fe] px-1.5 py-0.5 text-[0.45rem] font-bold text-[#1a73e8]">#1</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[0.48rem] font-semibold text-[#1a73e8]">
        <span className="flex items-center justify-center gap-1 rounded-full border border-[#dadce0] py-1">
          <Phone className="size-2.5" /> Call
        </span>
        <span className="flex items-center justify-center gap-1 rounded-full border border-[#dadce0] py-1">
          <Navigation className="size-2.5" /> Go
        </span>
        <span className="flex items-center justify-center gap-1 rounded-full bg-[#1a73e8] py-1 text-white">
          Book
        </span>
      </div>
    </div>
  );
}

function ReminderPhone() {
  return (
    <div className="w-[8.5rem] rounded-[1.6rem] bg-[#0d0d10] p-[5px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:w-[10.5rem]">
      <div className="relative overflow-hidden rounded-[1.3rem] bg-[#efeae2]">
        <span className="absolute left-1/2 top-1.5 z-10 h-3 w-10 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center gap-1.5 bg-[#075e54] px-2.5 pb-2 pt-6 text-white">
          <span className="flex size-5 items-center justify-center rounded-full bg-white text-[0.42rem] font-black text-[#0f8b8d]">
            bs
          </span>
          <span className="leading-tight">
            <span className="block text-[0.58rem] font-semibold">Bright Smile</span>
            <span className="block text-[0.46rem] text-white/70">business account</span>
          </span>
        </div>
        <div className="flex flex-col gap-1.5 px-2 py-2.5 text-[0.55rem] leading-snug text-[#111b21] sm:text-[0.6rem]">
          <span className="max-w-[92%] rounded-lg rounded-tl-none bg-white px-2 py-1.5 shadow-sm">
            Hi Nadeesha 👋 Reminder: your appointment is tomorrow at 6:00 pm.
            <span className="mt-1 grid grid-cols-2 gap-1">
              <span className="rounded-md bg-[#f0f2f5] px-1 py-1 text-center text-[0.48rem] font-semibold text-[#027eb5]">
                Confirm
              </span>
              <span className="rounded-md bg-[#f0f2f5] px-1 py-1 text-center text-[0.48rem] font-semibold text-[#027eb5]">
                Reschedule
              </span>
            </span>
          </span>
          <span className="self-end rounded-lg rounded-tr-none bg-[#d9fdd3] px-2 py-1.5 shadow-sm">
            Confirm ✅
            <span className="mt-0.5 block text-right text-[0.42rem] text-[#667781]">18:02 ✓✓</span>
          </span>
          <span className="self-center rounded-full bg-[#d1f4cc] px-2 py-0.5 text-[0.48rem] font-semibold text-[#1f6b3a]">
            ✓ Confirmed · directions sent
          </span>
        </div>
      </div>
    </div>
  );
}

const SLOTS = ["4:30", "5:15", "6:00", "6:45"];

function BookingCard() {
  return (
    <div className="w-[13.5rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-[14.5rem]">
      <div className="flex items-center justify-between">
        <span className="text-[0.62rem] font-semibold">Thu, 14 Nov</span>
        <span className="rounded-full bg-[#e7f6ec] px-1.5 py-0.5 text-[0.48rem] font-semibold text-[#1f8a4c]">
          Booked at 21:52
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-[#e4e4e9]">
          <Image src={`${IMG}/patient.jpg`} alt="" fill sizes="1.75rem" className="object-cover" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-[0.58rem] font-semibold">Nadeesha F.</span>
          <span className="block truncate text-[0.5rem] text-[#55555c]">Braces consult · Dr. Perera</span>
        </span>
        <span className="relative ml-auto size-6 shrink-0 overflow-hidden rounded-full bg-[#e4e4e9] ring-2 ring-white">
          <Image src={`${IMG}/team-1.jpg`} alt="" fill sizes="1.5rem" className="object-cover" />
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {SLOTS.map((slot) => {
          const picked = slot === "6:00";
          const taken = slot === "4:30";
          return (
            <span
              key={slot}
              className={`rounded-md py-1 text-center text-[0.5rem] font-semibold ${
                picked
                  ? "bg-[#c40202] text-white"
                  : taken
                    ? "bg-[#f3f3f5] text-[#b5b5ba] line-through"
                    : "ring-1 ring-black/10"
              }`}
            >
              {slot}
            </span>
          );
        })}
      </div>
      <p className="mt-2 flex items-center gap-1 text-[0.5rem] font-semibold text-[#1f8a4c]">
        <Check className="size-2.5" strokeWidth={3} />
        Deposit paid · reminder scheduled
      </p>
    </div>
  );
}

const FUNNEL = [
  { label: "Enquiries", value: 64, width: 100 },
  { label: "Replied < 1 min", value: 64, width: 100 },
  { label: "Booked", value: 38, width: 59 },
  { label: "Showed up", value: 35, width: 55 },
];

function EnquiriesCard() {
  const reduce = useReducedMotion();

  return (
    <div className="w-[11rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <span className="text-[0.55rem] uppercase tracking-[0.14em] text-[#8a8a90]">This week</span>
        <span className="flex size-4 items-center justify-center rounded-full bg-[#e7f6ec]">
          <TrendingUp className="size-2.5 text-[#1f8a4c]" />
        </span>
      </div>
      <ul className="mt-2 grid gap-1.5">
        {FUNNEL.map(({ label, value, width }, i) => (
          <li key={label}>
            <span className="flex justify-between text-[0.48rem] text-[#55555c]">
              {label}
              <span className="font-bold text-[#16161a]">{value}</span>
            </span>
            <span className="mt-0.5 block h-1.5 rounded-full bg-[#f0f0f2]">
              <motion.span
                className={`block h-full origin-left rounded-full ${
                  i === FUNNEL.length - 1 ? "bg-[#c40202]" : "bg-[#16161a]/70"
                }`}
                style={{ width: `${width}%` }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: 1.4 + i * 0.1 }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The full composition. Decorative: the page text says the same things. */
export function ServiceShowcase() {
  const pointer = usePointerParallax();
  const rotateY = useTransform(pointer.x, (v) => v * 7);
  const rotateX = useTransform(pointer.y, (v) => v * -5);
  const siteX = useTransform(pointer.x, (v) => v * -10);
  const siteY = useTransform(pointer.y, (v) => v * -8);
  const glowX = useTransform(pointer.x, (v) => v * -40);

  return (
    // `isolate` keeps the cards' z-index local, so they never cover the fixed header.
    <div
      aria-hidden="true"
      className="relative isolate mx-auto w-full max-w-[40rem] select-none pb-16 pt-14 [perspective:1400px] sm:pb-20 sm:pl-10 sm:pt-16"
    >
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute inset-x-[10%] top-[15%] h-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(196,2,2,0.28),transparent)] blur-2xl"
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
          <ClinicSite />
        </motion.div>
      </motion.div>

      <Floating
        pointer={pointer}
        depth={26}
        delay={0.7}
        duration={6.5}
        drift={-7}
        tilt={-0.6}
        className="absolute left-0 top-0 z-20 sm:-left-2 lg:-left-10"
      >
        <MapsCard />
      </Floating>

      <Floating
        pointer={pointer}
        depth={34}
        delay={1.05}
        duration={8}
        drift={-9}
        tilt={0.8}
        phase={2.4}
        className="absolute -right-2 top-[14%] z-20 hidden sm:block lg:-right-10"
      >
        <EnquiriesCard />
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
        <BookingCard />
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
        <ReminderPhone />
      </Floating>
    </div>
  );
}
