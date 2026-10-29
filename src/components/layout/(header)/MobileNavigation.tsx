"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "./NavConfig";

type MobileNavigationProps = {
  isOpen: boolean;
  activeSection: string;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  onContact: () => void;
};

export function MobileNavigation({
  isOpen,
  activeSection,
  onToggle,
  onNavigate,
  onContact,
}: MobileNavigationProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full border border-white/20 p-2 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 top-full mt-2 rounded-2xl border border-white/10 bg-[#151515]/95 p-4 text-white shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    aria-current={
                      activeSection === link.path ? "location" : undefined
                    }
                    className={`block w-full rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-150 ease-in-out ${
                      activeSection === link.path
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}

              <li className="mt-3">
                <button
                  type="button"
                  onClick={onContact}
                  className="mt-2 w-full rounded-full bg-[#d00000] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#e00000]"
                  aria-label="Start a project — go to contact section"
                >
                  Start a project
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
