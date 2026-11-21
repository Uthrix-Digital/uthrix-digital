import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

/**
 * Served at /robots.txt. It controls what crawlers may *fetch*, not what gets
 * indexed. To keep a page out of search results, mark it noindex in its
 * metadata and leave it crawlable here, or Google never sees the noindex.
 *
 * Kept crawlable on purpose:
 *  - /_next/*: the CSS and JS Google needs to render pages properly.
 *  - /growth-path/...?selection=: noindex pages; blocking them here would
 *    hide that tag and could get them indexed without a description.
 */
export default function robots(): MetadataRoute.Robots {
  // Vercel preview deployments: keep the whole copy out of search results.
  // Only an explicit "preview" blocks, so a missing variable can never
  // block the live site.
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Form endpoints (inquiry, booking, applications), not pages.
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
