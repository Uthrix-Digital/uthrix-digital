"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { navCta } from "./NavConfig";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileMenuButton, MobileNavigation } from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close every menu when the route changes (render-phase reset, no effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setIsMobileOpen(false);
  }

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => {
    setIsScrolled(value > 12);
  });

  const isAnyOpen = openMenu !== null || isMobileOpen;

  // Escape and outside-click close the open menu.
  useEffect(() => {
    if (!isAnyOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const trigger = openMenu
        ? document.getElementById(`nav-trigger-${openMenu}`)
        : document.getElementById("mobile-menu-button");
      setOpenMenu(null);
      setIsMobileOpen(false);
      trigger?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isAnyOpen, openMenu]);

  // Hover intent (mouse only): a short delay before opening from rest, instant
  // switching once a menu is open, and a grace period before closing so a
  // slightly wandering cursor doesn't collapse the panel.
  const hoverTimer = useRef<number | undefined>(undefined);

  const clearHoverTimer = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = undefined;
  };

  useEffect(() => clearHoverTimer, []);

  const openOnHover = (id: string) => {
    clearHoverTimer();
    if (openMenu !== null) {
      setOpenMenu(id);
      return;
    }
    hoverTimer.current = window.setTimeout(() => setOpenMenu(id), 90);
  };

  const closeOnLeave = () => {
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => setOpenMenu(null), 200);
  };

  const isMouse = (event: React.PointerEvent) => event.pointerType === "mouse";

  const closeAll = () => {
    clearHoverTimer();
    setOpenMenu(null);
    setIsMobileOpen(false);
  };

  if (pathname === "/careers") {
    return null;
  }

  const headerSurface = isAnyOpen
    ? "border-border bg-surface-overlay duration-200"
    : isScrolled
      ? "border-border bg-surface-overlay/75 shadow-header backdrop-blur-xl duration-500"
      : "border-transparent bg-transparent duration-500";

  return (
    <>
      {/* Dim the page behind an open menu. */}
      <div
        aria-hidden="true"
        onClick={closeAll}
        className={`fixed inset-0 z-40 bg-scrim backdrop-blur-[2px] transition-opacity duration-300 ${
          isAnyOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <header
        ref={headerRef}
        onPointerEnter={(event) => {
          if (isMouse(event)) clearHoverTimer();
        }}
        onPointerLeave={(event) => {
          if (isMouse(event)) closeOnLeave();
        }}
        className={`fixed inset-x-0 top-0 z-50 border-b text-foreground transition-[background-color,border-color,box-shadow] ${headerSurface}`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex w-full max-w-[100rem] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-[clamp(1.5rem,4vw,4rem)]"
        >
          <Link
            href="/"
            aria-label="UthriX Digital home"
            onClick={closeAll}
            className="relative block h-9 w-24 shrink-0 transition-opacity hover:opacity-80 sm:h-10 sm:w-28"
          >
            {/* Both logos are rendered; CSS picks one so it's right on first paint. */}
            <Image
              src="/assets/Images/logoBlack.svg"
              alt="UthriX Digital"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="112px"
              className="object-contain object-left dark:hidden"
            />
            <Image
              src="/assets/Images/logoWhite.svg"
              alt="UthriX Digital"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="112px"
              className="hidden object-contain object-left dark:block"
            />
          </Link>

          <DesktopNavigation
            openMenu={openMenu}
            onToggle={(id) => setOpenMenu((current) => (current === id ? null : id))}
            onOpen={(id) => {
              clearHoverTimer();
              setOpenMenu(id);
            }}
            onHover={openOnHover}
            onClose={closeAll}
          />

          <div
            className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-0"
            onPointerEnter={(event) => {
              // Moving onto the CTA while a panel is open dismisses it.
              if (isMouse(event) && openMenu !== null) closeOnLeave();
            }}
          >
            <Link
              href={navCta.href}
              onClick={closeAll}
              className="group inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent-foreground px-4 font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-background transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:px-5"
            >
              <span className="sm:hidden">{navCta.shortLabel}</span>
              <span className="hidden sm:inline">{navCta.label}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <ThemeToggle />

            <MobileMenuButton
              isOpen={isMobileOpen}
              onToggle={() => {
                setOpenMenu(null);
                setIsMobileOpen((open) => !open);
              }}
            />
          </div>
        </nav>

        <MobileNavigation isOpen={isMobileOpen} onNavigate={closeAll} />
      </header>
    </>
  );
}
