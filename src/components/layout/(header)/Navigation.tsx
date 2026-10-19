"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "home" },
  { name: "Services", path: "services" },
  { name: "Projects", path: "portfolio" },
  { name: "About", path: "about" },
  { name: "Contact", path: "contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const pendingScrollRef = useRef<string | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (value) => {
      setIsSticky(value > 12);
    });
  }, [scrollY]);

  const smoothProgress = useSpring(
    useTransform(scrollY, [0, 180], [0, 1]),
    { stiffness: 140, damping: 22, mass: 0.9 },
  );

  const navWidth = useTransform(
    smoothProgress,
    [0, 1],
    ["min(96vw, 1200px)", "min(84vw, 980px)"],
  );
  const navHeight = useTransform(smoothProgress, [0, 1], [72, 56]);
  const paddingX = useTransform(smoothProgress, [0, 1], [28, 18]);
  const paddingY = useTransform(smoothProgress, [0, 1], [14, 10]);
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
      layout
      initial={false}
      style={{
        width: navWidth,
        height: navHeight,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        top: topOffset,
      }}
      className={`fixed left-1/2 z-50 -translate-x-1/2 rounded-full border backdrop-blur-2xl transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)] ${
        isSticky
          ? "border-white/10 bg-white/20 dark:border-white/10 dark:bg-black/60"
          : "border-white/20 bg-white/30 dark:border-white/10 dark:bg-white/10"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-primary/20 via-transparent to-primary/20 opacity-60 blur-2xl" />

      <nav className="relative flex w-full items-center justify-between gap-4 text-sm font-medium text-gray-800 dark:text-gray-100">
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
          className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-white/5 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden items-center gap-5 lg:gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.path;

            return (
              <li key={link.path}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.path)}
                  className={`group relative whitespace-nowrap rounded-full px-3 py-2 transition-all duration-300 ease-out ${
                    isActive
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary dark:text-gray-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-full bg-white/50 blur-[1px] transition-opacity duration-300 dark:bg-white/10 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    }`}
                  />
                  <span className="relative z-10">{link.name}</span>
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
            className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg dark:border-white/10 dark:bg-[#141414] md:hidden"
          >
            <ul className="flex flex-col space-y-3 text-center">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.path)}
                    className={`block w-full py-2 font-medium transition-colors hover:text-primary ${
                      activeSection === link.path ? "text-primary" : ""
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