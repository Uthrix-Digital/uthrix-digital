import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { CASE_STUDIES_PATH } from "@/config/caseStudies";
import { CookieSettingsButton } from "@/components/shared/(CookieConsent)/CookieSettingsButton";
import { navCta, navMenus } from "@/components/layout/(header)/NavConfig";
import { SocialLinks } from "@/components/layout/(header)/SocialLinks";

const COPYRIGHT_YEAR = 2026;

const PHONE = { label: "+94 72 82 82 122", href: "tel:+94728282122" };

type FooterLinkItem = { label: string; href: string };

/** Links for a header menu, so the footer never drifts from the main nav. */
function menuItems(id: string): FooterLinkItem[] {
  const menu = navMenus.find((m) => m.id === id);
  return menu ? menu.items.map(({ label, href }) => ({ label, href })) : [];
}

function menuSecondaryItems(id: string): FooterLinkItem[] {
  const menu = navMenus.find((m) => m.id === id);
  return menu?.secondary
    ? menu.secondary.items.map(({ label, href }) => ({ label, href }))
    : [];
}

const linkColumns: { title: string; links: FooterLinkItem[] }[] = [
  { title: "What we do", links: menuItems("services") },
  {
    title: "Who we help",
    links: [...menuItems("forwhoom"), ...menuSecondaryItems("forwhoom")],
  },
  { title: "Growth paths", links: menuItems("growth") },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/AboutUs" },
      { label: "Case studies", href: CASE_STUDIES_PATH },
      { label: "Partners", href: "/partners" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/ContactUs" },
    ],
  },
];

const contactLinkClass =
  "text-foreground underline-offset-4 transition-colors hover:text-brand-text hover:underline focus-visible:text-brand-text";

const legalLinkClass =
  "cursor-pointer transition-colors hover:text-foreground focus-visible:text-foreground";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-border bg-surface-raised text-foreground">
      {/* Soft brand glow, top-left: the only decoration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-56 size-[42rem] rounded-full bg-brand-bright/10 blur-3xl dark:bg-brand-bright/15"
      />

      <div className="layout-container relative">
        {/* ── Call to action ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-10 py-16 md:py-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:py-24">
          <div>
            <p className="nav-panel-label">Start a project</p>
            <h2 className="font-archivo-black mt-4 text-[clamp(3.5rem,11vw,9rem)] uppercase leading-[0.9] tracking-[-0.03em]">
              Let&rsquo;s <span className="text-brand">talk</span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-3">
            <p className="type-body text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={navCta.href}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {navCta.label}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-strong px-6 text-[0.75rem] font-extrabold uppercase tracking-[0.12em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                WhatsApp us
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ── Brand + link columns ───────────────────────────────────── */}
        <div className="grid gap-x-6 gap-y-14 border-t border-border py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4 lg:pr-10">
            <Link
              href="/"
              aria-label={`${siteConfig.companyName} home`}
              className="relative block h-11 w-32 transition-opacity hover:opacity-80"
            >
              <Image
                src="/assets/Images/logoBlack.svg"
                alt={siteConfig.companyName}
                fill
                sizes="128px"
                className="object-contain object-left dark:hidden"
              />
              <Image
                src="/assets/Images/logoWhite.svg"
                alt={siteConfig.companyName}
                fill
                sizes="128px"
                className="hidden object-contain object-left dark:block"
              />
            </Link>
            <p className="type-body-sm mt-6 max-w-xs text-muted-foreground">
              {siteConfig.tagline}
            </p>

            <dl className="mt-8 space-y-5">
              <div>
                <dt className="nav-panel-label">Email</dt>
                <dd className="type-h6 mt-1.5">
                  <a href={`mailto:${siteConfig.email}`} className={contactLinkClass}>
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="nav-panel-label">Phone &amp; WhatsApp</dt>
                <dd className="type-h6 mt-1.5">
                  <a href={PHONE.href} className={contactLinkClass}>
                    {PHONE.label}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <p className="nav-panel-label">Follow us</p>
              <SocialLinks className="mt-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:col-span-8">
            {linkColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="nav-panel-label">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="type-body-sm inline-block text-foreground/80 underline-offset-4 transition-colors hover:text-brand-text hover:underline focus-visible:text-brand-text"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* ── Legal bar ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 border-t border-border py-6 text-sm leading-6 text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {siteConfig.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link href="/privacy" className={legalLinkClass}>
              Privacy policy
            </Link>
            <Link href="/terms" className={legalLinkClass}>
              Terms of use
            </Link>
            <CookieSettingsButton className={legalLinkClass} />
          </div>
        </div>
      </div>
    </footer>
  );
}
