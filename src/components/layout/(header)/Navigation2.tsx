"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "./NavConfig";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isSticky, setIsSticky] = useState(false);

  const pendingScrollRef = useRef<string | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (value) => {
      setIsSticky(value > 12);
    });
  }, [scrollY]);

  const smoothProgress = useSpring(useTransform(scrollY, [0, 180], [0, 1]), {
    stiffness: 140,
    damping: 22,
    mass: 0.9,
  });

  const navOpacity = useTransform(smoothProgress, [0, 1], [0.94, 1]);

  const scrollToElement = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);

      if (!element) {
        return;
      }

      const navbarHeight = isSticky ? 72 : 96;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    },
    [isSticky],
  );

    const logoScale = useTransform(smoothProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    if (pathname !== "/" || !pendingScrollRef.current) {
      return;
    }

    const target = pendingScrollRef.current;
    pendingScrollRef.current = null;

    const frame = window.requestAnimationFrame(() => {
      scrollToElement(target);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, scrollToElement]);

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 150;

      for (const link of navLinks) {
        const section = document.getElementById(link.path);

        if (!section) {
          continue;
        }

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(link.path);
          break;
        }
      }
    };

    handleScrollSpy();
    window.addEventListener("scroll", handleScrollSpy, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);

    if (pathname !== "/") {
      pendingScrollRef.current = sectionId;
      router.push("/");
      return;
    }

    scrollToElement(sectionId);
  };

  if (pathname === "/careers") {
    return null;
  }

  return (
    <motion.header
      initial={false}
      style={{
        opacity: navOpacity,
      }}
      className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${
        isSticky
          ? "border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[clamp(4.5rem,8vw,6.5rem)] w-full max-w-[100rem] items-center justify-between gap-6 px-[clamp(1.25rem,4vw,4rem)]">
        <Link
          href="/"
          aria-label="Uthrix Digital home"
          className="font-hkg text-[clamp(1.25rem,2vw,1.8rem)] font-black tracking-[-0.06em] text-white transition-opacity hover:opacity-75"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
                      style={{ scale: logoScale }}
                      className="relative h-10 w-25 shrink-0 transition-transform duration-300 ease-out hover:scale-105 hover:-rotate-1 hover:drop-shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:h-12 sm:w-29"
                    >
                      <Image
                        src="/assets/logoWhite.svg"
                        alt="Uthrix Digital logo"
                        fill
                        priority
                        sizes="(max-width: 540px) 100px, 156px"
                        className="object-contain object-left"
                      />
                    </motion.div>
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-full border border-white/20 p-2 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden min-w-0 items-center gap-[clamp(1rem,2.5vw,2.75rem)] lg:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.path;

            return (
              <li key={link.path}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.path)}
                  aria-current={isActive ? "location" : undefined}
                  className={`whitespace-nowrap px-0.5 py-2 text-[0.9rem] font-sans uppercase tracking-[0.20em] text-white/95 transition-colors duration-150 ease-in-out hover:text-brand ${
                    isActive
                      ? "text-white"
                      : ""
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
              onClick={() => scrollToSection("contact")}
              className="rounded-full bg-brand px-5 py-3 text-[0.7rem] font-sans uppercase tracking-[0.20em] text-white transition-colors hover:bg-brand/90"
              aria-label="Start a project — go to contact section"
            >
              Start a project
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
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
                    onClick={() => scrollToSection(link.path)}
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
                  onClick={() => scrollToSection("contact")}
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
    </motion.header>
  );
}
