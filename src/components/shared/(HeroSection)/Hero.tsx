import Link from "next/link";
import { InquiryForm } from "@/components/shared/InquiryForm";
import { audienceHref } from "@/config/audiences";
import { RotatingHeadline } from "./RotatingHeadline";

// "Show me for" shortcuts into the "Who we help" pages.
const AUDIENCE_PILLS = [
  { label: "Hotels & villas", href: audienceHref("hospitality") },
  { label: "Tour companies", href: audienceHref("hospitality") },
  { label: "Online stores", href: audienceHref("product-sellers") },
  { label: "Furniture & showrooms", href: audienceHref("product-sellers") },
  { label: "Service businesses", href: audienceHref("service-businesses") },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background";

/** Staggered entrance: each block starts 0.1s after the previous one. */
const stagger = (step: number) => ({ animationDelay: `${step * 0.1}s` });

/**
 * Entrance animations are plain CSS (.hero-rise / .fade-up in globals.css),
 * so they start at first paint instead of waiting for hydration. The
 * headline and intro paragraph are the page's largest content (LCP): they
 * only slide, never start invisible.
 */
export function Hero() {
  return (
    <section
      id="home"
      aria-label="Uthrix Digital introduction"
      className="flex min-h-screen items-start overflow-hidden bg-background text-foreground"
    >
      <div className="mx-auto flex w-full max-w-none px-4 pb-12 pt-[clamp(7rem,20vw,9.5rem)] sm:px-6 sm:pb-20 sm:pt-[clamp(8rem,16vw,10rem)] lg:px-12 lg:pt-38">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_clamp(26rem,30vw,34rem)] lg:items-start lg:gap-12">
          {/* Left column is a size container so the headline scales to the
              space left beside the form instead of the viewport. */}
          <div className="@container flex min-w-0 flex-col">
            <h1 className="hero-rise font-archivo-black w-full uppercase">
              <RotatingHeadline />
            </h1>

            <p
              style={stagger(1)}
              className="hero-rise font-sans mt-4 max-w-250 text-[clamp(1.05rem,4.7vw,1.5rem)] leading-[1.3] tracking-tight text-foreground/95 sm:mt-4 sm:text-[clamp(1.25rem,2.1vw,2rem)] sm:leading-[1.18]"
            >
              We build your website, run your Meta and Google ads, and follow
              up every lead. One small team, one plan, and one monthly report
              that shows what your money brought in.
            </p>

            <div
              style={stagger(2)}
              className="fade-up mt-8 flex flex-wrap gap-3 sm:mt-2 sm:gap-2"
            >
              <a
                href="#services"
                className={`inline-flex h-15 items-center justify-center rounded-full bg-brand px-8 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03] hover:bg-brand-hover ${focusRing}`}
              >
                See how we help
              </a>
              <Link
                href="/case-studies"
                className={`inline-flex h-15 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/85 ${focusRing}`}
              >
                View Case Studies
              </Link>
            </div>

            <nav
              style={stagger(3)}
              aria-label="Show me for"
              className="fade-up mt-8 sm:mt-6"
            >
              <p className="nav-panel-label">Show me for</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {AUDIENCE_PILLS.map((pill) => (
                  <li key={pill.label}>
                    <Link
                      href={pill.href}
                      className={`inline-flex items-center rounded-full border border-foreground/25 px-4 py-2 text-sm font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background ${focusRing}`}
                    >
                      {pill.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div
            style={stagger(4)}
            className="fade-up w-full max-w-xl lg:-mt-14 lg:max-w-none"
          >
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
