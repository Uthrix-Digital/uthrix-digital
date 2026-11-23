import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Open Graph for a page that needs its own og fields.
 *
 * A page-level `openGraph` object replaces the root layout's entirely (site
 * name, locale, type and the default share image from app/opengraph-image).
 * Build page values through this so those defaults survive.
 *
 * Pages that only set title and description don't need it: og:title and
 * og:description already fall back to those.
 */
export function pageOpenGraph(og: OpenGraph): OpenGraph {
  return {
    siteName: siteConfig.companyName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.companyName}: ${siteConfig.tagline}`,
      },
    ],
    ...og,
  } as OpenGraph;
}
