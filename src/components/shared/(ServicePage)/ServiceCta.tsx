import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

interface ServiceCtaProps {
  /** Used in the pre-filled WhatsApp message. */
  topic: string;
}

/** Closing "let's talk" band shared by service and growth-path pages. */
export function ServiceCta({ topic }: ServiceCtaProps) {
  const whatsappHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    `Hi! I'd like to talk about ${topic}.`,
  )}`;

  return (
    <section
      aria-labelledby="service-cta-title"
      className="bg-brand-surface text-brand-surface-foreground"
    >
      <div className="mx-auto grid w-full max-w-[100rem] gap-10 px-[clamp(1.25rem,5vw,5rem)] py-[clamp(4rem,9vw,8rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
        <h2
          id="service-cta-title"
          className="font-archivo-black text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.84] tracking-[-0.075em]"
        >
          Let&apos;s connect
          <br />
          the dots<span className="text-brand-foreground">.</span>
        </h2>

        <div className="max-w-md">
          <p className="text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.45] tracking-tight">
            Tell us where you are today. We&apos;ll suggest a good first step,
            whether it is this service alone or part of a bigger path.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-surface-foreground px-6 py-3 text-base font-semibold text-brand-surface transition-colors hover:bg-background hover:text-foreground"
            >
              Chat on WhatsApp
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <Link
              href="/ContactUs"
              className="inline-flex items-center rounded-full border border-brand-surface-foreground/50 px-6 py-3 text-base font-semibold transition-colors hover:border-brand-surface-foreground"
            >
              Contact us
            </Link>
          </div>
          <p className="mt-5 text-sm text-brand-surface-foreground/75">
            No strings attached. Just a chat first.
          </p>
        </div>
      </div>
    </section>
  );
}
