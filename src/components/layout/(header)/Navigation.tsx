"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4";

/** Paste your existing logo markup (Image / SVG) here. */
function Logo() {
  return (
    <a
      href="#home"
      aria-label="Uthrix Digital home"
      className={`text-4xl font-semibold leading-none tracking-[-0.06em] sm:text-5xl ${focusRing}`}
    >
      Uthrix<span className="text-[#D1001F]">.</span>
    </a>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-4">
      <div className="mx-auto w-full max-w-[1440px]">
        <nav
          aria-label="Main"
          className="flex h-20 items-center justify-between rounded-full bg-white px-6 text-black shadow-[0_8px_18px_-4px_rgba(0,0,0,0.28)] sm:h-24 lg:px-12"
        >
          <Logo />

          <div className="flex items-center gap-8 xl:gap-10">
            <ul className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-sm font-medium transition-opacity hover:opacity-60 ${focusRing}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`hidden h-12 items-center rounded-full bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-black/85 sm:inline-flex ${focusRing}`}
            >
              Start a project
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`inline-flex size-11 items-center justify-center rounded-full hover:bg-black/5 lg:hidden ${focusRing}`}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-3xl bg-white p-4 text-black shadow-[0_8px_18px_-4px_rgba(0,0,0,0.28)] lg:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-lg font-medium tracking-tight hover:bg-black/5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-12 items-center justify-center rounded-full bg-black text-sm font-medium text-white"
            >
              Start a project
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
