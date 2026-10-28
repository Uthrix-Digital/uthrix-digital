"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const orbitDots = [
  { className: "left-[16%] top-[23%] size-2 bg-white/80" },
  { className: "left-[38%] top-[12%] size-1.5 bg-black/35" },
  { className: "right-[20%] top-[20%] size-2 bg-white/75" },
  { className: "right-[12%] top-[42%] size-1.5 bg-black/35" },
  { className: "left-[23%] bottom-[23%] size-1.5 bg-black/35" },
  { className: "right-[22%] bottom-[18%] size-2 bg-white/70" },
];

export function ConnectsDots() {
  return (
    <section
      id="contact"
      aria-labelledby="connects-dots-title"
      className="relative isolate overflow-hidden bg-[#ff302f] text-[#111113]"
    >
      <div className="mx-auto grid min-h-[min(100svh,58rem)] w-full max-w-[100rem] items-center gap-14 px-[clamp(1.25rem,5vw,5rem)] py-[clamp(4rem,9vw,8rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(24rem,1.2fr)] lg:gap-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-[clamp(2.5rem,7vw,6rem)] text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">
            A good time to take the first step
          </p>

          <h2
            id="connects-dots-title"
            className="font-hkg max-w-[10ch] text-[clamp(3.75rem,8vw,8.5rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]"
          >
            Let&apos;s
            <br />
            connect
            <br />
            <span className="inline-flex w-[clamp(7rem,18vw,11rem)] align-baseline">
              <Image
                src="/assets/whiteLarge.svg"
                alt="Uthrix Digital"
                fill
                priority
                className="h-auto w-full"
              />
            </span>{" "}
            <br></br>
            dots<span className="text-white">.</span>
          </h2>

          <p className="mt-[clamp(2rem,4vw,3.5rem)] max-w-md text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.45] tracking-[-0.025em]">
            One project or several areas? Describe your needs. We&apos;ll
            establish a good first step.
          </p>

          <Link
            href="mailto:contact@acme.com"
            className="group mt-[clamp(2rem,5vw,4rem)] flex w-fit items-center gap-10 border-b border-[#111113]/60 pb-4 text-base font-semibold transition-colors hover:border-[#111113] sm:text-lg"
          >
            Let&apos;s talk about your company
            <ArrowUpRight
              aria-hidden="true"
              className="size-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

          <p className="mt-5 text-sm text-[#111113]/75">
            No strings attached. Just a chat first.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto aspect-square w-full max-w-[min(80vw,38rem)] lg:max-w-2xl"
        >
          <div className="absolute inset-[8%] rounded-full border border-black/10" />
          <div className="absolute inset-[18%] rounded-full border border-black/10" />
          <div className="absolute inset-[28%] rounded-full border border-black/10" />
          <div className="absolute inset-[38%] rounded-full border border-black/10" />

          <div className="absolute inset-0 rotate-[-18deg]">
            <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 bg-black/10" />
            <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-90 bg-black/10" />
            <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-45 bg-black/10" />
            <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-[-45deg] bg-black/10" />
          </div>

          {orbitDots.map((dot, index) => (
            <span
              key={index}
              className={`absolute rounded-full ${dot.className}`}
            />
          ))}

          <Link
            href="mailto:contact@acme.com"
            aria-label="Start a conversation by email"
            className="absolute left-1/2 top-1/2 flex size-[clamp(8.5rem,20vw,12rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#111113] text-white transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#ff302f]"
          >
            <ArrowUpRight className="size-[clamp(3rem,6vw,4.5rem)] stroke-[1.5]" />
          </Link>

          <span className="absolute bottom-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium sm:text-sm">
            From idea to first step
          </span>
        </div>
      </div>
    </section>
  );
}
