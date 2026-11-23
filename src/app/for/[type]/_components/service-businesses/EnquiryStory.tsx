"use client";

import { useState } from "react";
import { BellRing, Check, MessageCircle, X } from "lucide-react";
import { ENQUIRY_STORY } from "./data";

type Mode = "without" | "with";

const MODES: { id: Mode; label: string; note: string }[] = [
  { id: "without", label: "Ending 1: no system", note: "Great clinic, slow reply" },
  { id: "with", label: "Ending 2: with Uthrix Digital", note: "Same clinic, ready at 9:47 pm" },
];

const OUTCOMES = [
  { label: "First reply", without: "Next morning", with: "4 seconds" },
  { label: "Where she booked", without: "Another clinic", with: "With you" },
  { label: "Which ad worked", without: "A guess", with: "In the report" },
  { label: "Six months later", without: "Forgotten", with: "Review + 2 referrals" },
];

/**
 * One real-world enquiry followed through two endings. A two-option toggle
 * swaps every moment of the story.
 */
export function EnquiryStory() {
  const [mode, setMode] = useState<Mode>("without");
  const isWith = mode === "with";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
      <div className="flex flex-col gap-6">
        {/* The message that starts it all */}
        <figure className="rounded-card-lg border border-border bg-background p-5">
          <figcaption className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageCircle aria-hidden="true" className="size-4 text-[#25d366]" />
            New WhatsApp message · Monday, 9:47 pm
          </figcaption>
          <blockquote className="mt-3 rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-3 text-base font-semibold leading-snug tracking-[-0.01em]">
            &ldquo;Hi, how much for braces? Do you have any evening slots?&rdquo;
          </blockquote>
          <p className="mt-3 text-xs text-muted-foreground">
            Nadeesha, 29. Sent the same message to three clinics.
          </p>
        </figure>

        <div
          role="radiogroup"
          aria-label="Choose the ending"
          className="grid gap-2 rounded-card-lg border border-border bg-background p-2"
        >
          {MODES.map((m) => {
            const selected = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-4 rounded-card px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  selected
                    ? m.id === "with"
                      ? "bg-foreground text-background"
                      : "bg-surface-raised"
                    : "hover:bg-surface-raised"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    m.id === "with"
                      ? "bg-brand text-brand-foreground"
                      : "border border-foreground/20 text-foreground/70"
                  }`}
                >
                  {m.id === "with" ? <Check className="size-4" /> : <BellRing className="size-4" />}
                </span>
                <span>
                  <span className="block text-base font-semibold tracking-[-0.02em]">{m.label}</span>
                  <span
                    className={`block text-xs ${
                      selected && m.id === "with" ? "text-background/65" : "text-muted-foreground"
                    }`}
                  >
                    {m.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card-lg border border-border bg-border">
          {OUTCOMES.map((row) => (
            <div key={row.label} className="bg-background p-4">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd
                key={mode}
                className={`mt-1 animate-in fade-in-0 text-sm font-semibold duration-300 ${
                  isWith ? "text-brand-text" : ""
                }`}
              >
                {isWith ? row.with : row.without}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ol aria-live="polite" className="relative grid gap-3">
        <span
          aria-hidden="true"
          className={`absolute bottom-6 left-[2.85rem] top-6 w-px transition-colors duration-500 ${
            isWith ? "bg-brand-bright" : "bg-border"
          }`}
        />
        {ENQUIRY_STORY.map((moment, i) => (
          <li key={moment.time} className="relative grid grid-cols-[5.75rem_minmax(0,1fr)] items-start gap-3">
            <span className="relative z-10 mt-3 flex justify-center">
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-semibold tabular-nums transition-colors duration-500 ${
                  isWith
                    ? "bg-brand text-brand-foreground"
                    : "border border-border bg-background text-foreground/70"
                }`}
              >
                {moment.time}
              </span>
            </span>
            <div
              key={`${mode}-${moment.time}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`flex animate-in fade-in-0 slide-in-from-right-2 fill-mode-both items-start gap-3 rounded-card-lg border p-4 duration-500 sm:p-5 ${
                isWith ? "border-foreground/15 bg-background" : "border-dashed border-foreground/20 bg-surface-raised"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  isWith ? "bg-[#1f8a4c] text-white" : "bg-foreground/10 text-foreground/60"
                }`}
              >
                {isWith ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
              </span>
              <p className="text-sm leading-relaxed sm:text-base">
                {isWith ? moment.with : moment.without}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
