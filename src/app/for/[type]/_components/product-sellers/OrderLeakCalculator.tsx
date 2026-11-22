"use client";

import { useState } from "react";
import { Slider } from "@/app/for/[type]/_components/hospitality/CommissionCalculator";
import { EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { CALCULATOR } from "./data";

// Fixed locale so server and client render the same string.
const num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const rs = (value: number) => `Rs. ${num.format(Math.max(0, value))}`;

const DOTS = Array.from({ length: 100 }, (_, i) => i);

/**
 * "Where your orders leak": messages → orders → delivered, with a 100-dot
 * picture of every 100 messages and a modest, stated improvement scenario.
 */
export function OrderLeakCalculator() {
  const [messages, setMessages] = useState<number>(CALCULATOR.messages.initial);
  const [value, setValue] = useState<number>(CALCULATOR.value.initial);
  const [conversion, setConversion] = useState<number>(CALCULATOR.conversion.initial);
  const [returns, setReturns] = useState<number>(CALCULATOR.returns.initial);

  // Today
  const orders = (messages * conversion) / 100;
  const delivered = orders * (1 - returns / 100);
  const yearlySales = delivered * value * 12;
  const yearlyReturned = (orders - delivered) * value * 12;

  // Scenario: a few more orders per 100 messages, and fewer returns.
  const conversion2 = Math.min(100, conversion + CALCULATOR.liftPoints);
  const returns2 = returns * (1 - CALCULATOR.returnCut);
  const delivered2 = ((messages * conversion2) / 100) * (1 - returns2 / 100);
  const extraYearly = (delivered2 - delivered) * value * 12;

  // Per 100 messages, for the dot picture.
  const dotDelivered = Math.round(conversion * (1 - returns / 100));
  const dotReturned = Math.round(conversion) - dotDelivered;
  const dotExtra = Math.max(
    0,
    Math.round(conversion2 * (1 - returns2 / 100)) - dotDelivered,
  );

  const dotClass = (i: number) => {
    if (i < dotDelivered) return "bg-brand-bright";
    if (i < dotDelivered + dotReturned)
      return "bg-[repeating-linear-gradient(45deg,var(--brand-bright)_0_2px,transparent_2px_4px)] ring-1 ring-brand-bright/70";
    if (i < dotDelivered + dotReturned + dotExtra)
      return "ring-2 ring-[#3fd47e] ring-inset";
    return "bg-background/15";
  };

  return (
    <div className="grid overflow-hidden rounded-card-lg border border-border bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="grid content-start gap-7 p-6 sm:p-8 lg:p-10">
        <p className={EYEBROW}>Your numbers</p>
        <Slider
          label="Messages, comments and enquiries per month"
          value={messages}
          display={num.format(messages)}
          range={CALCULATOR.messages}
          onChange={setMessages}
        />
        <Slider
          label="Average order value"
          value={value}
          display={rs(value)}
          range={CALCULATOR.value}
          onChange={setValue}
        />
        <Slider
          label="Out of every 100 messages, how many order?"
          value={conversion}
          display={`${conversion}`}
          range={CALCULATOR.conversion}
          onChange={setConversion}
        />
        <Slider
          label="Orders returned or cancelled (COD)"
          value={returns}
          display={`${returns}%`}
          range={CALCULATOR.returns}
          onChange={setReturns}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Not sure? Leave the defaults. They&apos;re typical for a small social
          seller in Sri Lanka.
        </p>
      </div>

      <div
        aria-live="polite"
        className="flex flex-col gap-8 bg-foreground p-6 text-background sm:p-8 lg:p-10"
      >
        {/* Every 100 messages, as dots */}
        <div>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
            Every 100 messages, today
          </p>
          <div aria-hidden="true" className="mt-4 grid max-w-[22rem] grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5">
            {DOTS.map((i) => (
              <span
                key={i}
                className={`aspect-square rounded-full transition-colors duration-300 ${dotClass(i)}`}
              />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-background/70">
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-brand-bright" />
              {dotDelivered} delivered &amp; paid
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[repeating-linear-gradient(45deg,var(--brand-bright)_0_2px,transparent_2px_4px)] ring-1 ring-brand-bright/70" />
              {dotReturned} sent back
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-full ring-2 ring-inset ring-[#3fd47e]" />
              +{dotExtra} you could win
            </li>
          </ul>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-card border border-background/15 bg-background/15 sm:grid-cols-2">
          <div className="bg-foreground p-4">
            <dt className="text-xs text-background/60">Delivered sales each year</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums tracking-[-0.03em]">{rs(yearlySales)}</dd>
          </div>
          <div className="bg-foreground p-4">
            <dt className="text-xs text-background/60">Orders sent back each year</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums tracking-[-0.03em]">{rs(yearlyReturned)}</dd>
          </div>
        </dl>

        <div className="rounded-card border border-background/15 p-5">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
            Extra sales you could win, each year
          </p>
          <p className="font-archivo-black mt-2 text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[-0.05em] text-brand-bright tabular-nums">
            {rs(extraYearly)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-background/60">
            If faster replies and a clear order link turn {CALCULATOR.liftPoints} more
            of every 100 messages into orders, and order confirmation cuts
            returns by a third. A rough estimate, not a promise. We report the
            real figures every month.
          </p>
        </div>
      </div>
    </div>
  );
}
