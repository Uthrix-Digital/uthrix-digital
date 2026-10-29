"use client";

import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    title: "Social media and content",
    description:
      "We focus on a specific area or combine several activities. We tailor the scope to your goals.",
    details:
      "We create a clear content direction, from planning and production to publishing and ongoing improvement.",
  },
  {
    title: "Websites",
    description:
      "Websites and landing pages: concept, design and implementation.",
    details:
      "We turn your message into a responsive, accessible digital experience that is easy to use and built to perform.",
  },
  {
    title: "Meta Ads and Google Ads",
    description: "Campaigns, messaging, testing and optimization.",
    details:
      "We connect the right audience, offer and creative with measurable campaigns that keep improving over time.",
  },
  {
    title: "SEO and visibility",
    description: "Content and optimization that help your offer be found.",
    details:
      "We build a practical search strategy around the questions your customers ask and the actions you want them to take.",
  },
  {
    title: "Strategy and diagnosis",
    description: "Clear offer, priorities and action plan.",
    details:
      "We identify what is holding your growth back and turn the findings into focused next steps.",
  },
  {
    title: "Follow-up and automation",
    description: "Structured follow-up and reminders.",
    details:
      "We simplify repetitive work with thoughtful processes and automations that keep your team moving.",
  },
];

export function HowCanWeHelp() {
  return (
    <section
      id="services"
      aria-labelledby="how-can-we-help-title"
      className="bg-[#111113] text-white"
    >
      <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,8vw,10rem)]">
        <div className="mb-[clamp(3.5rem,8vw,6.5rem)] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:gap-16">
          <h2
            id="how-can-we-help-title"
            className="font-archivo-black max-w-[10ch] text-[clamp(2.75rem,7vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.075em]"
          >
            How can we
            <br />
            help you?
          </h2>
          <p className="max-w-sm self-end text-[clamp(1rem,1.8vw,2.5rem)] leading-[1.45] text-base">
            We can focus on a specific area or combine several activities. We
            tailor the scope to your goals.
          </p>
        </div>

        <Accordion aria-label="Our services">
          {services.map((service, index) => (
            <AccordionItem key={service.title} value={service.title}>
              <AccordionHeader>
                <AccordionTrigger className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:py-6 lg:grid lg:grid-cols-[1.5rem_minmax(0,1.2fr)_minmax(15rem,0.8fr)_2rem] lg:items-center lg:gap-7">
                  <span className="shrink-0 font-mono text-[0.6rem] text-white/45 sm:text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-[clamp(1.1rem,2.4vw,2.75rem)] font-semibold tracking-[-0.035em]">
                    {service.title}
                  </span>
                  <span className="hidden text-[clamp(1.1rem,2.4vw,1.5rem)] leading-[1.35] text-white/55 lg:block">
                    {service.description}
                  </span>
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/35 text-white/75 transition-colors group-hover:border-white group-hover:text-white sm:size-6">
                    <Plus className="size-3.5 transition-transform duration-300 group-data-panel-open:rotate-45 sm:size-4" />
                  </span>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                <div className="grid gap-3 pb-6 pl-9 pr-10 leading-relaxed text-white/70ashi sm:pl-10 lg:hidden">
                  <p className="text-[0.95rem]">{service.description}</p>
                  <p className="text-[0.8rem] text-brand/90">
                    {service.details}
                  </p>
                </div>
                <p className="hidden pb-6 pl-15 text-[clamp(1.1rem,2.4vw,1.25rem)] leading-relaxed text-brand lg:block">
                  {service.details}
                </p>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
