import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export interface OrbitDot {
  className: string;
}

export interface OrbitDotsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  dots?: readonly OrbitDot[];
  href?: string;
  linkLabel?: string;
  caption?: string;
}

const defaultDots: readonly OrbitDot[] = [
  { className: "left-[16%] top-[23%] size-2 bg-white/80" },
  { className: "left-[38%] top-[12%] size-1.5 bg-black/35" },
  { className: "right-[20%] top-[20%] size-2 bg-white/75" },
  { className: "right-[12%] top-[42%] size-1.5 bg-black/35" },
  { className: "left-[23%] bottom-[23%] size-1.5 bg-black/35" },
  { className: "right-[22%] bottom-[18%] size-2 bg-white/70" },
];

export function OrbitDots({
  dots = defaultDots,
  href = "/ConnetMainDots",
  linkLabel = "View our brand identity services",
  caption = "From idea to first step",
  className = "",
  ...props
}: OrbitDotsProps) {
  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[min(80vw,38rem)] lg:max-w-2xl ${className}`}
      {...props}
    >
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-black/10" />
      <div aria-hidden="true" className="absolute inset-[18%] rounded-full border border-black/10" />
      <div aria-hidden="true" className="absolute inset-[28%] rounded-full border border-black/10" />
      <div aria-hidden="true" className="absolute inset-[38%] rounded-full border border-black/10" />

      <div aria-hidden="true" className="absolute inset-0 rotate-[-18deg]">
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 bg-black/10" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-90 bg-black/10" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-45 bg-black/10" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top -translate-x-1/2 rotate-45 bg-black/10" />
      </div>

      <div aria-hidden="true">
        {dots.map((dot, index) => (
          <span
            key={`${dot.className}-${index}`}
            className={`absolute rounded-full ${dot.className}`}
          />
        ))}
      </div>

      <Link
        href={href}
        aria-label={linkLabel}
        className="absolute left-1/2 top-1/2 flex size-[clamp(8.5rem,20vw,12rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#111113] text-white transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#ff302f]"
      >
        <ArrowUpRight
          aria-hidden="true"
          className="size-[clamp(3rem,6vw,4.5rem)] stroke-[1.5]"
        />
      </Link>
      <span className="absolute bottom-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium sm:text-sm">
        {caption}
      </span>
    </div>
  );
}
