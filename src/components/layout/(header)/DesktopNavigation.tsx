"use client";

import { navLinks } from "./NavConfig";

type DesktopNavigationProps = {
  activeSection: string;
  onNavigate: (path: string) => void;
  onContact: () => void;
};

export function DesktopNavigation({
  activeSection,
  onNavigate,
  onContact,
}: DesktopNavigationProps) {
  return (
    <ul className="hidden min-w-0 items-center gap-[clamp(1rem,2.5vw,2.75rem)] lg:flex">
      {navLinks.map((link) => {
        const isActive = activeSection === link.path;

        return (
          <li key={link.path}>
            <button
              type="button"
              onClick={() => onNavigate(link.path)}
              aria-current={isActive ? "location" : undefined}
              className={`whitespace-nowrap px-0.5 py-2 text-[0.9rem] font-sans uppercase tracking-[0.20em] text-white/95 transition-colors duration-150 ease-in-out hover:text-brand ${
                isActive ? "text-white" : ""
              }`}
            >
              {link.name}
            </button>
          </li>
        );
      })}

      <li>
        <button
          type="button"
          onClick={onContact}
          className="rounded-full bg-brand px-5 py-3 text-[0.7rem] font-sans uppercase tracking-[0.20em] text-white transition-colors hover:bg-brand/90"
          aria-label="Start a project — go to contact section"
        >
          Start a project
        </button>
      </li>
    </ul>
  );
}
