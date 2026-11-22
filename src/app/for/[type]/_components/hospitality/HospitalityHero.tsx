import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { BTN_PRIMARY, BTN_SECONDARY, EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { HERO_HIGHLIGHTS, TOURISM_TYPES } from "./data";
import { HeroShowcase } from "./HeroShowcase";

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

          <HeroShowcase />
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
