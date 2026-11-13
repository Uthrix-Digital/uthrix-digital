import type { MetadataRoute } from "next";
import { AUDIENCE_ORDER, STAGE_ORDER, audienceHref, stageHref } from "@/config/audiences";
import { BLOG_PATH, POSTS, postHref } from "@/config/blog";
import { CASE_STUDIES,CASE_STUDIES_PATH, caseStudyHref } from "@/config/caseStudies";
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
 *  - /GrowthPath/[slug]: built from the visitor's own selection, not a
 *    fixed set of pages.
 *  - /api/*: not pages.
 */
const STATIC_ROUTES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/Company", changeFrequency: "monthly", priority: 0.8 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.6 },
  { path: BLOG_PATH, changeFrequency: "weekly", priority: 0.7 },
  { path: "/ContactUs", changeFrequency: "monthly", priority: 0.8 },
  { path: "/BookACall", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ConnetMainDots", changeFrequency: "monthly", priority: 0.7 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
  { path: CASE_STUDIES_PATH, changeFrequency: "weekly", priority: 0.8 },

  // Services
  { path: "/BusinessStrategy", changeFrequency: "monthly", priority: 0.9 },
  { path: "/BrandIdentity", changeFrequency: "monthly", priority: 0.9 },
  { path: "/Website", changeFrequency: "monthly", priority: 0.9 },
  { path: "/MetaGoogleAds", changeFrequency: "monthly", priority: 0.9 },
  { path: "/Seo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/SocialContent", changeFrequency: "monthly", priority: 0.9 },
  { path: "/FollowUp", changeFrequency: "monthly", priority: 0.9 },

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
