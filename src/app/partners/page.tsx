import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { ServiceCta } from "@/components/shared/(ServicePage)/ServiceCta";
import { ServiceFaq } from "@/components/shared/(ServicePage)/ServiceFaq";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Partners | UthriX Digital",
  description:
    "UthriX Digital builds websites, software and marketing systems for agencies and IT firms that have more client work than developers.",
};

const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";

const situations = [
  "You've won the client work, but your team doesn't have the time or the skills to build it.",
  "A project needs a skill you don't keep in-house, like custom software or automation.",
  "You want a reliable overflow team that follows your process, not a new vendor to manage.",
  "Your client wants marketing and a build from one team, and you only offer one of them.",
];

const offers = [
  {
    title: "Build for your clients",
    description:
      "Websites, web apps and integrations built to your brief and your client's brand, delivered the way you'd deliver them yourself.",
  },
  {
    title: "Marketing and growth",
    description:
      "Meta and Google Ads, SEO and content for your clients' campaigns, with reporting your clients can understand.",
  },
  {
    title: "Systems and automation",
    description:
      "Follow-up, order tracking and enquiry systems that turn a one-off project into something the client depends on.",
  },
  {
    title: "Overflow and rescue",
    description:
      "Extra hands when you're stretched, and a calm second pair of eyes when a project has gone off track.",
  },
];

const steps = [
  {
    title: "Share the brief",
    description:
      "Send us the project and what you've promised the client. A short call is enough to start.",
  },
  {
    title: "Agree the scope",
    description:
      "We confirm what we'll build, the timeline and the price, in writing, before work begins.",
  },
  {
    title: "We build, you lead",
    description:
      "You stay the client's main contact. We work behind the scenes or alongside you, as you prefer.",
  },
  {
    title: "Hand over cleanly",
    description:
      "You receive tidy code, documentation and a handover, so the work is yours to support.",
  },
];

const faqs = [
  {
    question: "Can you work under our brand?",
    answer:
      "Yes. We can work white-label, so the client sees you. We'll agree how we're introduced and what's shared before the project starts.",
  },
  {
    question: "Do you work with NDAs?",
    answer:
      "Yes. We're happy to sign an NDA before you share any client details.",
  },
  {
    question: "What size of project do you take on?",
    answer:
      "From a single landing page to a custom business system. Tell us what you have and we'll say honestly whether we're the right fit.",
  },
  {
    question: "How do we start?",
    answer:
      "Book a short call or message us on WhatsApp with a line about the project. We'll come back with questions and a rough scope.",
  },
];

export default function PartnersPage() {
  const whatsappHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    "Hi! I run an agency / IT firm and I'd like to talk about partnering with UthriX.",
  )}`;

  return (
    <div className="bg-background text-foreground">
      <section aria-labelledby="partners-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>About</span>
              <span aria-hidden="true">·</span>
              <span className="text-brand-text">Partners</span>
            </p>
            <h1
              id="partners-title"
              className="font-archivo-black mt-6 max-w-[14ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              More work than developers?
            </h1>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:gap-16">
            <Reveal immediate delay={0.1}>
              <p className="max-w-2xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
                We partner with agencies and IT firms that have won the work
                and need a dependable team to build it.
              </p>
            </Reveal>
            <Reveal immediate delay={0.2} className="flex flex-col gap-6">
              <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
                Agencies and IT firms aren&apos;t customers with the pains on
                our other pages. They&apos;re partners, so this page works
                differently: no stages, just a straight conversation about
                how we can fit into how you already work.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  Message us on WhatsApp
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
                <Link
                  href="/BookACall"
                  className="inline-flex items-center rounded-full border border-foreground/25 px-6 py-3 text-base font-semibold transition-colors hover:border-foreground"
                >
                  Book a free 20-min call
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="partners-situations" className="border-t border-border">
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,5rem)]">
            <p className="nav-panel-label">Sounds familiar?</p>
            <h2 id="partners-situations" className={`${SECTION_TITLE} mt-4 max-w-[14ch]`}>
              When partners call us
            </h2>
          </Reveal>
          <ul className="grid gap-px overflow-hidden rounded-card-lg border border-border bg-border sm:grid-cols-2">
            {situations.map((situation, i) => (
              <li key={situation} className="bg-background">
                <Reveal delay={i * 0.05} className="flex h-full gap-5 p-6 sm:p-8">
                  <span className="font-mono text-xs text-brand-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">
                    {situation}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="partners-offers" className="bg-surface-raised">
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,5rem)]">
            <p className="nav-panel-label">What we offer</p>
            <h2 id="partners-offers" className={`${SECTION_TITLE} mt-4 max-w-[14ch]`}>
              How we can help your team
            </h2>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-2">
            {offers.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delay={i * 0.05}
                  className="flex h-full flex-col gap-4 rounded-card-lg border border-border bg-background p-6 sm:p-8"
                >
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-brand-bright" />
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-foreground/75">{item.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="partners-process">
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,5rem)]">
            <p className="nav-panel-label">How it works</p>
            <h2 id="partners-process" className={`${SECTION_TITLE} mt-4 max-w-[14ch]`}>
              Four clear steps
            </h2>
          </Reveal>
          <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 0.08}>
                  <p className="font-mono text-xs text-muted-foreground">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-foreground/75">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="partners-faq" className="border-t border-border">
        <div className={`${SECTION} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
          <Reveal>
            <p className="nav-panel-label">FAQ</p>
            <h2 id="partners-faq" className={`${SECTION_TITLE} mt-4 max-w-[10ch]`}>
              Good questions
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ServiceFaq faqs={faqs} />
          </Reveal>
        </div>
      </section>

      <ServiceCta topic="partnering with UthriX as an agency or IT firm" />
    </div>
  );
}
