"use client";

import { useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import {
  CAREER_AREAS,
  GENERAL_APPLICATION,
  ROLES,
} from "@/config/careers";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { siteConfig } from "@/config/siteConfig";
import { ApplicationForm } from "./ApplicationForm";

const EYEBROW = "nav-panel-label";
const SECTION =
  "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3.5rem,8vw,8rem)]";
const SECTION_TITLE =
  "font-archivo-black text-[clamp(2.25rem,5.5vw,5rem)] uppercase leading-[0.88] tracking-[-0.07em]";

/**
 * "Open roles" list and the application form. They share state: Apply on a
 * role scrolls to the form with that role pre-selected.
 */
export function CareersApply() {
  const [role, setRole] = useState<string>(GENERAL_APPLICATION);

  const apply = (id: string) => {
    setRole(id);
    const form = document.getElementById("apply");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {/* ── Open roles ───────────────────────────────────────────────── */}
      <section id="roles" aria-labelledby="roles-title" className="scroll-mt-16 border-t border-border">
        <div className={SECTION}>
          <Reveal className="mb-[clamp(2.5rem,6vw,4rem)]">
            <p className={EYEBROW}>/ Open roles</p>
            <h2 id="roles-title" className={`${SECTION_TITLE} mt-4 max-w-[12ch]`}>
              Where you could fit.
            </h2>
          </Reveal>

          {ROLES.length === 0 ? (
            <Reveal className="rounded-card-lg border border-dashed border-border-strong/50 p-6 sm:p-10">
              <p className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-snug tracking-[-0.03em]">
                No open roles right now.
              </p>
              <p className="mt-3 max-w-xl leading-relaxed text-foreground/75">
                We still like meeting people who are good at what they do. Send
                an open application below and tell us how you&apos;d like to
                contribute. We&apos;ll keep it on file and write to you when a
                fitting role opens.
              </p>
              <button
                type="button"
                onClick={() => apply(GENERAL_APPLICATION)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Send an open application
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </Reveal>
          ) : (
            <ul className="grid gap-4">
              {ROLES.map((item, i) => (
                <li key={item.id}>
                  <Reveal
                    delay={i * 0.05}
                    className="grid gap-6 rounded-card-lg border border-border p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"
                  >
                    <div>
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        <span>
                          {CAREER_AREAS.find((a) => a.value === item.area)?.label}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin aria-hidden="true" className="size-3" />
                          {item.location}
                        </span>
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/75">
                        {item.summary}
                      </p>
                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                          <p className={EYEBROW}>What you&apos;ll do</p>
                          <ul className="mt-3 grid gap-2 text-foreground/80">
                            {item.responsibilities.map((line) => (
                              <li key={line} className="flex gap-3">
                                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-bright" />
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className={EYEBROW}>What you bring</p>
                          <ul className="mt-3 grid gap-2 text-foreground/80">
                            {item.requirements.map((line) => (
                              <li key={line} className="flex gap-3">
                                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-bright" />
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => apply(item.id)}
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Apply
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </button>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Application form ─────────────────────────────────────────── */}
      <section
        id="apply"
        aria-labelledby="apply-title"
        className="scroll-mt-16 border-t border-border bg-surface-raised"
      >
        <div
          className={`${SECTION} grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16`}
        >
          <Reveal>
            <p className={EYEBROW}>/ Apply</p>
            <h2 id="apply-title" className={`${SECTION_TITLE} mt-4 max-w-[10ch]`}>
              Say hello.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              A few details and a link to your work is enough. You&apos;ll hear
              back from a person, not an auto-reply.
            </p>
            <p className="mt-6 text-sm text-foreground/70">
              Prefer email? Write to{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-semibold text-foreground underline underline-offset-4 hover:text-brand-text"
              >
                {siteConfig.email}
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ApplicationForm
              selectedRole={role}
              onRoleChange={setRole}
              email={siteConfig.email}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
