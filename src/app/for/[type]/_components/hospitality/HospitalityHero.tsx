import Link from "next/link";
import { ArrowRight, BadgePercent, CalendarCheck, MessageCircle, Star } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { BTN_PRIMARY, BTN_SECONDARY, EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { HERO_HIGHLIGHTS, TOURISM_TYPES } from "./data";

/**
 * Illustration of the kind of site we build: a fictional villa with a direct
 * booking widget and the moments that matter floating around it.
 */
function BookingMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl select-none">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-card-lg border border-border bg-background shadow-dock">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="ml-3 flex-1 truncate rounded-full bg-foreground/5 px-3 py-1 font-mono text-[0.65rem] text-muted-foreground">
            yourvilla.lk
          </span>
        </div>

        {/* "Photo" area: dusk sky over the sea, drawn in CSS */}
        <div className="relative h-52 overflow-hidden bg-[linear-gradient(180deg,#1b1530_0%,#6b1d2a_48%,#e0553b_78%,#f5a65b_100%)] sm:h-60">
          <div className="absolute bottom-10 left-1/2 size-24 -translate-x-1/2 rounded-full bg-[#ffd08a]/90 blur-[1px]" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(180deg,#24314f_0%,#0f1426_100%)]" />
          <div className="absolute inset-x-0 bottom-11 h-px bg-[#ffd08a]/50" />
          {/* Palms */}
          <svg viewBox="0 0 120 120" className="absolute -left-2 bottom-8 h-40 w-40 text-[#0f1020]">
            <path fill="currentColor" d="M58 120c2-28 4-52 12-74l4 1c-7 22-9 46-11 73z" />
            <path fill="currentColor" d="M72 46c-14-10-34-10-48 2 16-4 30-2 46 2zM72 46c-4-16-18-26-34-26 14 6 24 14 32 28zM72 46c8-14 24-20 40-16-16 2-28 8-38 18zM72 46c14-4 30 2 40 14-14-6-26-8-40-12z" />
          </svg>
          <div className="absolute left-5 top-5 max-w-[14rem] text-white">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/70">
              Private villa · South coast
            </p>
            <p className="font-archivo-black mt-1 text-2xl uppercase leading-[0.9] tracking-[-0.05em]">
              Wake up to the ocean
            </p>
          </div>
        </div>

        {/* Booking widget */}
        <div className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="rounded-control border border-border px-3 py-2">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
              Check in
            </p>
            <p className="text-sm font-semibold">12 Feb</p>
          </div>
          <div className="rounded-control border border-border px-3 py-2">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
              Guests
            </p>
            <p className="text-sm font-semibold">2 adults</p>
          </div>
          <span className="inline-flex items-center justify-center gap-1.5 rounded-control bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground">
            <CalendarCheck className="size-4" />
            Book direct
          </span>
        </div>
      </div>

      {/* Floating moments */}
      <div className="absolute -right-3 -top-6 hidden items-center gap-3 rounded-card border border-border bg-background p-3 pr-4 shadow-menu sm:flex lg:-right-8">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#25d366] text-white">
          <MessageCircle className="size-4" />
        </span>
        <span>
          <span className="block text-xs font-semibold">New WhatsApp enquiry</span>
          <span className="block text-[0.7rem] text-muted-foreground">&quot;Is the villa free in Feb?&quot;</span>
        </span>
      </div>

      <div className="absolute -left-3 bottom-28 hidden items-center gap-3 rounded-card border border-border bg-background p-3 pr-4 shadow-menu sm:flex lg:-left-10">
        <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
          <BadgePercent className="size-4" />
        </span>
        <span>
          <span className="block text-xs font-semibold">Booked direct</span>
          <span className="block text-[0.7rem] text-muted-foreground">No commission on this one</span>
        </span>
      </div>

      <div className="absolute -bottom-5 left-8 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-menu">
        <span className="flex text-[#f5b301]">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3.5 fill-current" />
          ))}
        </span>
        <span className="text-xs font-semibold">Your reviews, on your site</span>
      </div>
    </div>
  );
}

export function HospitalityHero() {
  return (
    <section aria-labelledby="audience-title" className="overflow-hidden">
      <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,6vw,5rem)] pt-32 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <Reveal immediate>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <span>Who we help</span>
                <span aria-hidden="true">·</span>
                <span className="text-brand-text">Hospitality &amp; travel</span>
              </p>
              <h1
                id="audience-title"
                className="font-archivo-black mt-6 text-[clamp(2.75rem,5.6vw,5.5rem)] uppercase leading-[0.86] tracking-[-0.075em]"
              >
                Tourism websites that turn visitors into{" "}
                <span className="text-brand-text">bookings</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.1}>
              <p className="mt-8 max-w-xl text-[clamp(1.1rem,1.8vw,1.45rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-foreground/85">
                Hotels, villas, guest houses, tour operators, safari jeeps, surf
                schools and every business in between. We build the website,
                get you found and bring in direct bookings, so you pay less
                commission to booking sites.
              </p>
            </Reveal>
            <Reveal immediate delay={0.2} className="mt-10 flex flex-wrap gap-3">
              <Link href="#types" className={BTN_PRIMARY}>
                See what we build for you
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/book-a-call" className={BTN_SECONDARY}>
                Book a free 20-min call
              </Link>
            </Reveal>
          </div>

          <Reveal immediate delay={0.25} className="px-2 pb-6 sm:px-6">
            <BookingMockup />
          </Reveal>
        </div>

        {/* Highlights strip */}
        <Reveal immediate delay={0.35} className="mt-[clamp(3.5rem,7vw,6rem)]">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card-lg border border-border bg-border md:grid-cols-5">
            {HERO_HIGHLIGHTS.map(({ icon: Icon, label, note }, i) => (
              <li
                key={label}
                className={`flex items-center gap-3 bg-background p-4 sm:p-5 ${
                  i === HERO_HIGHLIGHTS.length - 1 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-brand-text" />
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-muted-foreground">{note}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal immediate delay={0.4} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className={EYEBROW}>Built for</p>
          <ul className="flex flex-wrap gap-2">
            {TOURISM_TYPES.map((type) => (
              <li key={type.id}>
                <Link
                  href={`?type=${type.id}#types`}
                  className="inline-flex rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold transition-colors hover:border-foreground"
                >
                  {type.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
