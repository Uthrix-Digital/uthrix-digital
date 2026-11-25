import type { MetadataRoute } from "next";
import { NODES } from "@/app/growth-map/(GrowthPathMap)/data/nodes";
import { CURATED_BUNDLES } from "@/app/growth-map/(GrowthPathMap)/data/resolver";
import { AUDIENCE_ORDER, STAGE_ORDER, audienceHref, stageHref } from "@/config/audiences";
import { BLOG_PATH, postHref } from "@/config/blog";
import { CASE_STUDIES, CASE_STUDIES_PATH, caseStudyHref } from "@/config/caseStudies";
import { COMPANY_PATH } from "@/config/company";
import { siteConfig } from "@/config/siteConfig";
import { getPosts } from "@/sanity/lib/posts";

type SitemapEntry = MetadataRoute.Sitemap[number];
type Entry = Pick<SitemapEntry, "changeFrequency" | "priority" | "lastModified" | "images"> & {
  path: string;
};

/**
 * Served at /sitemap.xml: every page we want in search results.
 *
 * Wherever a page's address lives in config (services, audiences, posts,
 * bundles, case studies), it's read from there, the same source the page uses
 * for its canonical URL. Renaming a route in config updates the sitemap too.
 *
 * Left out on purpose:
 *  - /growth-path/<hub>?selection=<mask>: one-off mixes from the visitor's own
 *    selection. They're noindex; the curated bundles are listed instead.
 *  - Old addresses (/AboutUs, /Website, ...): they 301 to the pages below.
 *  - /services: a temporary redirect to /growth-map, not a page.
 *  - /api/*: form endpoints, not pages.
 *
 * `lastModified` is only set where we know a real date. A made-up "now" on
 * every build tells search engines everything changed, so they learn to
 * ignore the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(); // newest first
  const latestPost = posts[0] ? new Date(posts[0].publishedAt) : undefined;

  const entries: Entry[] = [
    // Core
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: COMPANY_PATH, changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/book-a-call", changeFrequency: "monthly", priority: 0.8 },
    { path: "/growth-map", changeFrequency: "monthly", priority: 0.7 },
    { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
    { path: "/careers", changeFrequency: "monthly", priority: 0.6 },

    // Services
    ...NODES.map(({ route }) => ({
      path: route,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),

    // Who we help: by business type, then by stage
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

    // Curated growth paths (slug-only, indexable)
    ...CURATED_BUNDLES.map(({ href }) => ({
      path: href,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    // Case studies
    { path: CASE_STUDIES_PATH, changeFrequency: "weekly", priority: 0.8 },
    ...CASE_STUDIES.map(({ slug }) => ({
      path: caseStudyHref(slug),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Blog: the index changes whenever a post is published
    { path: BLOG_PATH, changeFrequency: "weekly", priority: 0.7, lastModified: latestPost },
    ...posts.map(({ slug, publishedAt, updatedAt, cover }) => ({
      path: postHref(slug),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      lastModified: new Date(updatedAt ?? publishedAt),
      // The cover image, so it can show up in image search.
      ...(cover ? { images: [cover.card] } : {}),
    })),

    // Legal
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  return entries.map(({ path, lastModified, ...rest }) => ({
    url: new URL(path, siteConfig.url).toString(),
    ...(lastModified ? { lastModified } : {}),
    ...rest,
  }));
}
