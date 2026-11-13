import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

/** Served at /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Form endpoints, not pages.
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
