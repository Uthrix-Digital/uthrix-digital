import type { MetadataRoute } from "next";
import { AUDIENCE_ORDER, STAGE_ORDER, audienceHref, stageHref } from "@/config/audiences";
import { BLOG_PATH, POSTS, postHref } from "@/config/blog";
import { CASE_STUDIES,CASE_STUDIES_PATH, caseStudyHref } from "@/config/caseStudies";
import { CURATED_BUNDLES } from "@/app/growth-map/(GrowthPathMap)/data/resolver";
import { siteConfig } from "@/config/siteConfig";

type Entry = Pick<
  MetadataRoute.Sitemap[number],
  "changeFrequency" | "priority" | "lastModified"
> & {
  path: string;
};

/**
 * Static, indexable routes. Add a line here when you add a page.
 *
 * Left out on purpose:
 *  - /growth-path/[slug]?selection=...: one-off mixes built from the
 *    visitor's own selection (noindex). Curated bundles are listed below.
 *  - /api/*: not pages.
 */
const STATIC_ROUTES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/company", changeFrequency: "monthly", priority: 0.8 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
  { path: BLOG_PATH, changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/book-a-call", changeFrequency: "monthly", priority: 0.8 },
  { path: "/growth-map", changeFrequency: "monthly", priority: 0.7 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
  { path: CASE_STUDIES_PATH, changeFrequency: "weekly", priority: 0.8 },

  // Services
  { path: "/services/business-strategy", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/brand-identity", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/web-development", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/meta-google-ads", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/seo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/social-content", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/follow-up", changeFrequency: "monthly", priority: 0.9 },

  // Legal
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

/** Served at /sitemap.xml. Dynamic routes come from the same config the pages use. */
export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicRoutes: Entry[] = [
    ...AUDIENCE_ORDER.map((id) => ({
      path: audienceHref(id),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...STAGE_ORDER.map((id) => ({
      path: stageHref(id),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...POSTS.map(({ slug, publishedAt }) => ({
      path: postHref(slug),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      lastModified: new Date(publishedAt),
    })),
    ...CURATED_BUNDLES.map(({ href }) => ({
      path: href,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...CASE_STUDIES.map(({ slug }) => ({
      path: caseStudyHref(slug),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...STATIC_ROUTES, ...dynamicRoutes].map(({ path, ...rest }) => ({
    url: new URL(path, siteConfig.url).toString(),
    ...rest,
  }));
}
