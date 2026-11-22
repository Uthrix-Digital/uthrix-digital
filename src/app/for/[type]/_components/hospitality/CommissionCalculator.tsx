"use client";

import { useId, useState } from "react";
import { EYEBROW } from "@/components/shared/(AudiencePage)/styles";
import { CALCULATOR } from "./data";

// Fixed locale so server and client render the same string.
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface SliderProps {
  label: string;
  value: number;
  display: string;
  range: { min: number; max: number; step: number };
  onChange: (value: number) => void;
}

export function Slider({ label, value, display, range, onChange }: SliderProps) {
  const id = useId();
  const { min, max, step } = range;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm tabular-nums text-brand-text">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, var(--brand) ${pct}%, var(--track) ${pct}%)`,
        }}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-brand [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--brand)]"
      />
    </div>
  );
}

/** "What booking sites cost you" estimate with four sliders. */
export function CommissionCalculator() {
  const [bookings, setBookings] = useState<number>(CALCULATOR.bookings.initial);
  const [value, setValue] = useState<number>(CALCULATOR.value.initial);
  const [commission, setCommission] = useState<number>(CALCULATOR.commission.initial);
  const [directShare, setDirectShare] = useState<number>(CALCULATOR.directShare.initial);

  const yearlyRevenue = bookings * value * 12;
  const yearlyCommission = yearlyRevenue * (commission / 100);
  const kept = yearlyCommission * (directShare / 100);
  const remaining = yearlyCommission - kept;

  return (
    <div className="grid overflow-hidden rounded-card-lg border border-border bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="grid gap-7 p-6 sm:p-8 lg:p-10">
        <p className={EYEBROW}>Your numbers</p>
        <Slider
          label="Bookings from booking sites, per month"
          value={bookings}
          display={String(bookings)}
          range={CALCULATOR.bookings}
          onChange={setBookings}
        />
        <Slider
          label="Average booking value"
          value={value}
          display={usd.format(value)}
          range={CALCULATOR.value}
          onChange={setValue}
        />
        <Slider
          label="Commission you pay"
          value={commission}
          display={`${commission}%`}
          range={CALCULATOR.commission}
          onChange={setCommission}
        />
        <Slider
          label="Share of those guests booking direct instead"
          value={directShare}
          display={`${directShare}%`}
          range={CALCULATOR.directShare}
          onChange={setDirectShare}
        />
      </div>

      <div
        aria-live="polite"
        className="flex flex-col justify-between gap-8 bg-foreground p-6 text-background sm:p-8 lg:p-10"
      >
        <div>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
            Commission paid each year
          </p>
          <p className="font-archivo-black mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-none tracking-[-0.05em] tabular-nums">
            {usd.format(yearlyCommission)}
          </p>
          <p className="mt-2 text-sm text-background/60">
            on {usd.format(yearlyRevenue)} of bookings
          </p>
        </div>

        {/* Bar: what you'd keep vs what still goes to booking sites */}
        <div>
          <div className="flex h-3 overflow-hidden rounded-full bg-background/15" aria-hidden="true">
            <div
              className="h-full bg-brand-bright transition-[width] duration-300"
              style={{ width: `${directShare}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between gap-4 text-xs text-background/60">
            <span>Kept by you</span>
            <span className="tabular-nums">Still paid: {usd.format(remaining)}</span>
          </div>
        </div>

        <div className="rounded-card border border-background/15 p-5">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60">
            You could keep, each year
          </p>
          <p className="font-archivo-black mt-2 text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[-0.05em] text-brand-bright tabular-nums">
            {usd.format(kept)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-background/60">
            A rough estimate before the cost of winning those guests directly
            (ads, payment fees). We report the net figure every month.
          </p>
        </div>
      </div>
    </div>
  );
}
