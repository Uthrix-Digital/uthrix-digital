"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OrbitDots } from "./OrbitDots";

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
            className="font-archivo-black max-w-[10ch] text-[clamp(3.75rem,8vw,8.5rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]"
          >
            Let&apos;s
            <br />
            connect
            <br />
            dots<span className="text-white">.</span>
          </h2>

          <p className="mt-[clamp(2rem,4vw,3.5rem)] max-w-md text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.45] tracking-tight">
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

        <OrbitDots />
      </div>
    </section>
  );
}
