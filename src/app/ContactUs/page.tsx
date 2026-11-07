import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { InquiryForm } from "@/components/shared/InquiryForm";
import { AUDIENCES, AUDIENCE_ORDER, audienceHref } from "@/config/audiences";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Contact | UthriX Digital",
  description:
    "Tell UthriX Digital about your business. Send an enquiry, message us on WhatsApp or book a free 20-minute call.",
};

const EYEBROW = "nav-panel-label";

export default function ContactUs() {
  const whatsappHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    "Hi! I'd like to talk about my business.",
  )}`;

  return (
    <div className="bg-background text-foreground">
      <section aria-labelledby="contact-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3.5rem,8vw,8rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className={EYEBROW}>Contact</p>
            <h1
              id="contact-title"
              className="font-archivo-black mt-6 max-w-[12ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              Let&apos;s talk.
            </h1>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,34rem)] lg:items-start lg:gap-16">
            <Reveal immediate delay={0.1} className="flex flex-col gap-10">
              <p className="max-w-xl text-[clamp(1.25rem,2.2vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
                Tell us where your business is today. We&apos;ll come back with
                your exact problem named and a clear first step.
              </p>

              <div>
                <p className={EYEBROW}>Prefer to talk it through?</p>
                <ul className="mt-5 grid gap-3">
                  <li>
                    <Link
                      href="/BookACall"
                      className="group inline-flex items-center gap-2 text-lg font-semibold underline-offset-4 hover:text-brand-text hover:underline"
                    >
                      Book a free 20-min call
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-lg font-semibold underline-offset-4 hover:text-brand-text hover:underline"
                    >
                      Message us on WhatsApp
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-lg font-semibold underline-offset-4 hover:text-brand-text hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className={EYEBROW}>See what fits your business first</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {AUDIENCE_ORDER.map((id) => (
                    <li key={id}>
                      <Link
                        href={audienceHref(id)}
                        className="inline-flex items-center rounded-full border border-foreground/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                      >
                        {AUDIENCES[id].label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/partners"
                      className="inline-flex items-center rounded-full border border-foreground/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      Agency or IT firm
                    </Link>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal immediate delay={0.2}>
              <InquiryForm />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
