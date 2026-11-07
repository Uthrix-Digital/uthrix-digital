"use client";

import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceFaq as ServiceFaqItem } from "@/config/servicePages";

export function ServiceFaq({ faqs }: { faqs: ServiceFaqItem[] }) {
  return (
    <Accordion aria-label="Frequently asked questions">
      {faqs.map((faq) => (
        <AccordionItem key={faq.question} value={faq.question}>
          <AccordionHeader>
            <AccordionTrigger className="flex w-full items-center justify-between gap-6 py-5 text-left text-[clamp(1.05rem,1.8vw,1.5rem)] font-semibold tracking-[-0.03em] transition-colors hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:py-6">
              {faq.question}
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground/75">
                <Plus className="size-4 transition-transform duration-300 group-data-panel-open:rotate-45" />
              </span>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p className="max-w-3xl pb-6 pr-12 text-base leading-relaxed text-foreground/75 sm:text-lg">
              {faq.answer}
            </p>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
