import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";

interface ComingSoonProps {
  /** Small label above the title, e.g. "Careers". */
  eyebrow: string;
  title: string;
  description: string;
  /** Optional primary action. Falls back to the contact page. */
  action?: { label: string; href: string };
}

/** Placeholder for a page whose route is live but whose content isn't ready. */
export function ComingSoon({
  eyebrow,
  title,
  description,
  action = { label: "Contact us", href: "/ContactUs" },
}: ComingSoonProps) {
  return (
    <section
      aria-labelledby="coming-soon-title"
      className="bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-[80vh] w-full max-w-[100rem] flex-col justify-center px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(4rem,9vw,8rem)] pt-32 lg:pt-40">
        <Reveal immediate>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span>{eyebrow}</span>
            <span aria-hidden="true">·</span>
            <span className="text-brand-text">Coming soon</span>
          </p>
          <h1
            id="coming-soon-title"
            className="font-archivo-black mt-6 max-w-[14ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
          >
            {title}
            <span className="text-brand">.</span>
          </h1>
        </Reveal>
        <Reveal immediate delay={0.1}>
          <p className="mt-[clamp(2rem,5vw,4rem)] max-w-2xl text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.4] tracking-[-0.02em] text-foreground/80">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={action.href}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              {action.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-foreground/25 px-6 py-3 text-base font-semibold transition-colors hover:border-foreground"
            >
              Back to home
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
