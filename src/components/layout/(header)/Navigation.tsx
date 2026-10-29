"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { navLinks } from "./NavConfig";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

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

  const navigateTo = (path: string) => {
    if (path.startsWith("/")) {
      setIsMenuOpen(false);
      router.push(path);
      return;
    }

    scrollToSection(path);
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

        <MobileNavigation
          isOpen={isMenuOpen}
          activeSection={activeSection}
          onToggle={() => setIsMenuOpen((open) => !open)}
          onNavigate={navigateTo}
          onContact={() => scrollToSection("contact")}
        />
        <DesktopNavigation
          activeSection={activeSection}
          onNavigate={navigateTo}
          onContact={() => scrollToSection("contact")}
        />
      </nav>
    </motion.header>
  );
}
