"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { navMenus } from "./NavConfig";
import { SocialLinks } from "./SocialLinks";

type MobileMenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      id="mobile-menu-button"
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
    >
      {isOpen ? (
        <X aria-hidden="true" className="size-4" />
      ) : (
        <Menu aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}

type MobileNavigationProps = {
  isOpen: boolean;
  onNavigate: () => void;
};

export function MobileNavigation({ isOpen, onNavigate }: MobileNavigationProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      id="mobile-navigation"
      hidden={!isOpen}
      className="nav-mobile-menu border-t border-white/10 bg-[#0b0b0b] shadow-[0_1.5rem_3.5rem_rgba(0,0,0,0.4)] lg:hidden"
    >
      <div className="mx-auto max-h-[calc(100dvh-4.25rem)] max-w-[100rem] overflow-y-auto overscroll-contain px-4 pb-6 sm:px-6">
        <ul>
          {navMenus.map((menu) => {
            const isExpanded = expanded === menu.id;

            return (
              <li key={menu.id} className="border-b border-white/10">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`mobile-menu-${menu.id}`}
                  onClick={() => setExpanded(isExpanded ? null : menu.id)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-xs font-extrabold uppercase tracking-[0.15em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {menu.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-brand transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`mobile-menu-${menu.id}`}
                  inert={!isExpanded}
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-1 pb-3 pl-2">
                      {menu.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onNavigate}
                          className="group flex items-center justify-between gap-3 rounded-md px-3 py-3 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                          <span className="min-w-0 font-sans text-sm font-extrabold uppercase tracking-[0.08em] text-white/85 transition-colors group-hover:text-brand">
                            {item.label}
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pt-6">
          <p className="nav-panel-label">Follow UthriX</p>
          <SocialLinks className="mt-4" />
        </div>
      </div>
    </div>
  );
}
