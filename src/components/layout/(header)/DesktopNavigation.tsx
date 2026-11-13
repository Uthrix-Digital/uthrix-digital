"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { navMenus, type NavMenu } from "./NavConfig";
import { NavFeatureCards } from "./NavFeatureCards";
import { SocialLinks } from "./SocialLinks";

type DesktopNavigationProps = {
  openMenu: string | null;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  onHover: (id: string) => void;
  onClose: () => void;
};

export function DesktopNavigation({
  openMenu,
  onToggle,
  onOpen,
  onHover,
  onClose,
}: DesktopNavigationProps) {
  // Mouse clicks keep the hovered menu open; keyboard/touch still toggle.
  const pointerTypeRef = useRef("");
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Animate the panel to the height of the active menu's content.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const content = openMenu ? contentRefs.current[openMenu] : null;
    if (!content) {
      panel.style.height = "0px";
      return;
    }

    const sync = () => {
      panel.style.height = `${content.offsetHeight}px`;
    };
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(content);
    return () => observer.disconnect();
  }, [openMenu]);

  return (
    <>
      <ul
        data-has-open={openMenu !== null}
        className="group/triggers hidden min-w-0 items-center gap-1 lg:flex xl:gap-3"
      >
        {navMenus.map((menu) => {
          const isOpen = openMenu === menu.id;

          return (
            <li key={menu.id}>
              <button
                id={`nav-trigger-${menu.id}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mega-menu-${menu.id}`}
                onPointerEnter={(event) => {
                  pointerTypeRef.current = event.pointerType;
                  if (event.pointerType === "mouse") onHover(menu.id);
                }}
                onPointerDown={(event) => {
                  pointerTypeRef.current = event.pointerType;
                }}
                onClick={(event) => {
                  if (pointerTypeRef.current === "mouse" && event.detail > 0) {
                    onOpen(menu.id);
                  } else {
                    onToggle(menu.id);
                  }
                  pointerTypeRef.current = "";
                }}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 py-2 font-sans text-[0.72rem] font-extrabold uppercase tracking-[0.14em] transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isOpen
                    ? "text-foreground"
                    : "text-foreground/70 group-data-[has-open=true]/triggers:text-foreground/50"
                }`}
              >
                {menu.label}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div
        ref={panelRef}
        data-open={openMenu !== null}
        className="nav-panel absolute inset-x-0 top-full hidden overflow-hidden border-b border-transparent bg-surface-overlay data-[open=true]:border-border lg:block"
        style={{ height: 0 }}
      >
        {navMenus.map((menu) => (
          <MegaMenuContent
            key={menu.id}
            menu={menu}
            isActive={openMenu === menu.id}
            onNavigate={onClose}
            contentRef={(node) => {
              contentRefs.current[menu.id] = node;
            }}
          />
        ))}
      </div>
    </>
  );
}

type MegaMenuContentProps = {
  menu: NavMenu;
  isActive: boolean;
  onNavigate: () => void;
  contentRef: (node: HTMLDivElement | null) => void;
};

function MegaMenuContent({
  menu,
  isActive,
  onNavigate,
  contentRef,
}: MegaMenuContentProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const detail =
    hovered === null ? menu.description : menu.items[hovered].description;

  return (
    <div
      ref={contentRef}
      id={`mega-menu-${menu.id}`}
      role="region"
      aria-label={`${menu.label} navigation`}
      aria-hidden={!isActive}
      inert={!isActive}
      data-active={isActive}
      className="nav-panel-content absolute inset-x-0 top-0"
    >
      <div className="mx-auto grid max-w-[100rem] grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-12 px-[clamp(1.5rem,4vw,4rem)] pb-12 pt-8">
        <div>
          <p className="nav-panel-label">Explore {menu.label}</p>
          <ul
            className="group/links mt-5 grid justify-items-start gap-1"
            onMouseLeave={() => setHovered(null)}
          >
            {menu.items.map((item, index) => (
              <li
                key={item.href}
                className="nav-panel-item"
                style={{ "--i": index } as CSSProperties}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  onMouseEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  className="group/link flex flex-col py-[0.2rem] text-foreground transition-colors duration-200 group-hover/links:text-foreground/30 hover:text-brand! focus-visible:text-brand! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <span className="inline-flex items-center gap-[0.6rem] font-archivo-black text-[clamp(1.6rem,2.4vw,2.4rem)] uppercase leading-[1.05] tracking-[-0.04em]">
                    {item.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-[0.7em] -translate-x-[0.4em] opacity-0 transition-[opacity,transform] duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100"
                    />
                  </span>
                  {item.sub && (
                    <span className="mt-1 font-sans text-xs font-medium normal-case tracking-normal opacity-70">
                      {item.sub}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l border-border pl-10">
          <p className="nav-panel-label">{menu.eyebrow}</p>
          <p className="mt-5 max-w-sm font-archivo-black text-xl uppercase leading-[1.05] tracking-[-0.03em] text-foreground">
            {menu.title}
          </p>
          <p
            key={detail}
            className="nav-panel-detail mt-4 max-w-sm font-sans text-sm leading-6 text-muted-foreground"
          >
            {detail}
          </p>

          {menu.secondary && (
            <div className="mt-8 border-t border-border pt-8">
              <p className="nav-panel-label">{menu.secondary.label}</p>
              <ul className="mt-4 grid gap-1">
                {menu.secondary.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="group/stage flex items-baseline justify-between gap-4 rounded-md py-2 transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <span className="inline-flex items-center gap-2 font-sans text-sm font-extrabold uppercase tracking-[0.08em]">
                        {item.label}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover/stage:translate-x-0 group-hover/stage:opacity-100 group-focus-visible/stage:translate-x-0 group-focus-visible/stage:opacity-100"
                        />
                      </span>
                      <span className="hidden max-w-[16rem] text-right font-sans text-xs text-muted-foreground xl:block">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {menu.featured && menu.featured.cards.length > 0 && (
            <NavFeatureCards feature={menu.featured} onNavigate={onNavigate} />
          )}

          {menu.showSocials && (
            <div className="mt-8 border-t border-border pt-8">
              <p className="nav-panel-label">Follow UthriX</p>
              <SocialLinks className="mt-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
