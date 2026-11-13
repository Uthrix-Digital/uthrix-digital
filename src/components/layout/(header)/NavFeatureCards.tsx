import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NavFeature } from "./NavConfig";

type NavFeatureCardsProps = {
  feature: NavFeature;
  onNavigate: () => void;
};

/** Thumbnail cards shown in a mega menu's detail column. */
export function NavFeatureCards({ feature, onNavigate }: NavFeatureCardsProps) {
  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="nav-panel-label">{feature.label}</p>
        <Link
          href={feature.viewAll.href}
          onClick={onNavigate}
          className="group/all inline-flex shrink-0 items-center gap-1.5 rounded-sm font-sans text-xs font-extrabold uppercase tracking-[0.08em] transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {feature.viewAll.label}
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 group-hover/all:translate-x-0.5"
          />
        </Link>
      </div>

      <ul className="mt-5 grid grid-cols-3 gap-4">
        {feature.cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              onClick={onNavigate}
              className="group/card block rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <span className="relative block aspect-[16/10] overflow-hidden rounded-card border border-border bg-surface-raised">
                <Image
                  src={card.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 75rem) 14vw, 0px"
                  className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                />
              </span>
              <span className="mt-3 line-clamp-2 block font-sans text-sm font-extrabold leading-snug transition-colors group-hover/card:text-brand group-focus-visible/card:text-brand">
                {card.title}
              </span>
              <span className="mt-1 block truncate font-sans text-xs text-muted-foreground">
                {card.caption}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
