"use client";

import Image from "next/image";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
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

  // Side insets come from the layout grid (--grid-margin: 24 / 32 / 64px), so
  // the pill lines up with page content at every breakpoint. Only the cap shrinks.
  const navMaxWidth = useTransform(smoothProgress, [0, 1], [1200, 980]);
  const navHeight = useTransform(smoothProgress, [0, 1], [72, 56]);
  const paddingX = useTransform(smoothProgress, [0, 1], [28, 18]);
  const topOffset = useTransform(smoothProgress, [0, 1], [32, 16]);
  const logoScale = useTransform(smoothProgress, [0, 1], [1, 0.9]);

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
        maxWidth: navMaxWidth,
        height: navHeight,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        top: topOffset,
      }}
      className={`fixed left-1/2 z-50 flex w-[calc(100%-2*var(--grid-margin))] -translate-x-1/2 items-center rounded-full border border-foreground/10 text-foreground backdrop-blur-2xl shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isSticky ? "bg-background/90" : "bg-background/80"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-primary/20 via-transparent to-primary/20 blur-2xl transition-opacity duration-500 ${
          isSticky ? "opacity-40" : "opacity-20"
        }`}
      />

      <nav className="relative flex w-full items-center justify-between gap-4 type-button">
        <Link
          href="/"
          aria-label="Uthrix Digital home"
          className="flex items-center gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            style={{ scale: logoScale }}
            className="relative h-10 w-25 shrink-0 transition-transform duration-300 ease-out hover:scale-105 hover:-rotate-1 hover:drop-shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:h-12 sm:w-29"
          >
            <Image
              src="/assets/Images/logo.svg"
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
          className="rounded-full p-2 text-foreground transition-colors hover:bg-foreground/6 focus:outline-none lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden min-w-0 items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.path;

            return (
              <li key={link.path}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.path)}
                  aria-current={isActive ? "location" : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 text-foreground transition-[color,background-color] duration-150 ease-in-out ${
                    isActive
                      ? "bg-foreground/10 hover:bg-foreground/15"
                      : "bg-transparent hover:bg-foreground/6 active:bg-foreground/10"
                  }`}
                >
                  {link.name}
                </button>
              </li>
            );
          })}

          <li>
            <Button
              size="sm"
              onClick={() => scrollToSection("contact")}
              aria-label="Start a project — go to contact section"
            >
              Start a project
            </Button>
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
            className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-foreground/10 bg-background px-3 py-3 text-foreground shadow-lg lg:hidden"
          >
            <ul className="flex flex-col gap-1 text-center">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.path)}
                    aria-current={
                      activeSection === link.path ? "location" : undefined
                    }
                    className={`block w-full rounded-full px-3 py-2 transition-[color,background-color] duration-150 ease-in-out ${
                      activeSection === link.path
                        ? "bg-foreground/10 text-foreground hover:bg-foreground/15"
                        : "text-foreground hover:bg-foreground/6 active:bg-foreground/10"
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}

              <li className="mt-3">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => scrollToSection("contact")}
                  aria-label="Start a project — go to contact section"
                >
                  Start a project
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
