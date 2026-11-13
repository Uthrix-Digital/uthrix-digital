/**
 * Case studies: the single source of truth for the listing page, each detail
 * page, the home teaser and the "Case studies" mega menu.
 *
 * ── Adding a case study ────────────────────────────────────────────────────
 * 1. Append one object to `CASE_STUDIES` below. Only the fields marked
 *    optional in `CaseStudy` can be left out; the page hides those sections.
 * 2. Pick a unique `slug`: it becomes the URL (`/case-studies/<slug>`).
 * 3. Set `featured: true` to show it in the navbar and on the home page.
 * 4. Images hosted on a new domain must be allowed in `next.config.ts`
 *    (`images.remotePatterns`). Local files go in `public/assets/Images/`.
 *
 * Nothing else needs touching: routes, filters, counts, metadata and
 * "next case study" links are all derived from this list. The order here is
 * the order on the site.
 *
 * ── Categories and groups ──────────────────────────────────────────────────
 * Work is organised in two levels: a category (Marketing, Development) and
 * the groups inside it (e.g. "Search & Local Presence"). A case study only
 * names its `group`; the category follows from that.
 *
 * To add a group: add its id to `CaseStudyGroupId`, describe it in
 * `CASE_STUDY_GROUPS` and list it under its category in
 * `CASE_STUDY_CATEGORIES`. To add a category, do the same one level up and
 * place it in `CASE_STUDY_CATEGORY_ORDER`.
 */

export type CaseStudyCategoryId = "marketing" | "development";

export type CaseStudyGroupId =
  // Marketing
  | "brand-launch"
  | "social-paid-ads"
  | "search-local"
  // Development
  | "web"
  | "mobile"
  | "software";

export interface CaseStudyCategory {
  id: CaseStudyCategoryId;
  label: string;
  /** One line for menus and the filter. */
  summary: string;
  /** The groups inside this category, in display order. */
  groups: CaseStudyGroupId[];
}

export interface CaseStudyGroup {
  id: CaseStudyGroupId;
  category: CaseStudyCategoryId;
  label: string;
  /** One line for menus and the filter. */
  summary: string;
}

export interface CaseStudyImage {
  src: string;
  alt: string;
}

export interface CaseStudyResult {
  /** The number itself, e.g. "+385%" or "Top 3". Keep it short. */
  value: string;
  /** What the number measures, e.g. "Qualified leads". */
  metric: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface CaseStudy {
  /** URL segment. Lowercase, hyphenated, unique. */
  slug: string;
  title: string;
  client: string;
  /** Where it sits in the filter. The category is derived from the group. */
  group: CaseStudyGroupId;
  industry: string;
  /** One or two sentences for cards, menus and search engines. */
  summary: string;
  cover: CaseStudyImage;
  challenge: string;
  solution: string;
  /** What we actually built or ran, one short item each. */
  deliverables: string[];
  technologies: string[];
  /** Two to four headline numbers. The first one leads on cards. */
  results: CaseStudyResult[];
  /** Show in the navbar and on the home page. */
  featured?: boolean;
  /** Extra screenshots shown under the story. */
  gallery?: CaseStudyImage[];
  testimonial?: CaseStudyTestimonial;
  /** Public link to the finished work. */
  liveUrl?: string;
}

export const CASE_STUDY_CATEGORIES: Record<CaseStudyCategoryId, CaseStudyCategory> = {
  marketing: {
    id: "marketing",
    label: "Marketing",
    summary: "Brands, campaigns and search visibility measured in leads and revenue.",
    groups: ["brand-launch", "social-paid-ads", "search-local"],
  },
  development: {
    id: "development",
    label: "Development",
    summary: "Websites, mobile apps and custom software built around a business goal.",
    groups: ["web", "mobile", "software"],
  },
};

export const CASE_STUDY_CATEGORY_ORDER: CaseStudyCategoryId[] = [
  "marketing",
  "development",
];

export const CASE_STUDY_GROUPS: Record<CaseStudyGroupId, CaseStudyGroup> = {
  "brand-launch": {
    id: "brand-launch",
    category: "marketing",
    label: "Brand & Launch",
    summary: "New brands and products introduced to the market with a plan.",
  },
  "social-paid-ads": {
    id: "social-paid-ads",
    category: "marketing",
    label: "Social & Paid Ads",
    summary: "Social content and paid campaigns that bring in qualified leads.",
  },
  "search-local": {
    id: "search-local",
    category: "marketing",
    label: "Search & Local Presence",
    summary: "SEO and local listings that get a business found nearby.",
  },
  web: {
    id: "web",
    category: "development",
    label: "Web",
    summary: "Websites and portals rebuilt to load fast and convert.",
  },
  mobile: {
    id: "mobile",
    category: "development",
    label: "Mobile",
    summary: "iOS and Android apps people open every day.",
  },
  software: {
    id: "software",
    category: "development",
    label: "Software (Web & Desktop Apps)",
    summary: "Custom platforms that replace disconnected tools and paperwork.",
  },
};

/**
 * Published case studies, in the order they appear on the site.
 *
 * Empty for now: the pages, menu and home teaser show their "coming soon"
 * states until the first entry is added. Copy the template below, fill it in
 * and the case study is live everywhere.
 *
 *   {
 *     slug: "client-project-name",
 *     title: "Project title",
 *     client: "Client name",
 *     group: "web", // see CaseStudyGroupId
 *     industry: "Industry",
 *     summary: "One or two sentences for cards, menus and search engines.",
 *     cover: {
 *       src: "/assets/Images/case-studies/client-project-name/cover.jpg",
 *       alt: "What the image shows",
 *     },
 *     challenge: "Where the client started and what was in the way.",
 *     solution: "What we did about it.",
 *     deliverables: ["First thing we built", "Second thing we built"],
 *     technologies: ["Next.js", "Tailwind CSS"],
 *     results: [
 *       { metric: "What was measured", value: "+00%" },
 *       { metric: "What was measured", value: "00" },
 *     ],
 *     featured: true, // optional: navbar and home page
 *     // Optional: gallery, testimonial, liveUrl
 *   },
 */
export const CASE_STUDIES: CaseStudy[] = [];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

export const CASE_STUDIES_PATH = "/case-studies";

export const caseStudyHref = (slug: string) => `${CASE_STUDIES_PATH}/${slug}`;

export const caseStudyCategoryHref = (id: CaseStudyCategoryId) =>
  `${CASE_STUDIES_PATH}?category=${id}`;

export const caseStudyGroupHref = (id: CaseStudyGroupId) =>
  `${CASE_STUDIES_PATH}?group=${id}`;

export const isCaseStudyCategoryId = (
  value: string | null | undefined,
): value is CaseStudyCategoryId =>
  !!value && Object.hasOwn(CASE_STUDY_CATEGORIES, value);

export const isCaseStudyGroupId = (
  value: string | null | undefined,
): value is CaseStudyGroupId =>
  !!value && Object.hasOwn(CASE_STUDY_GROUPS, value);

/** The group a study belongs to and the category that group sits in. */
export function getCaseStudyTaxonomy(study: Pick<CaseStudy, "group">) {
  const group = CASE_STUDY_GROUPS[study.group];
  return { group, category: CASE_STUDY_CATEGORIES[group.category] };
}

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((study) => study.slug === slug);

/** Featured studies first-come; topped up with the rest if there are too few. */
export function getFeaturedCaseStudies(limit = 3): CaseStudy[] {
  const featured = CASE_STUDIES.filter((study) => study.featured);
  const rest = CASE_STUDIES.filter((study) => !study.featured);
  return [...featured, ...rest].slice(0, limit);
}

/** The study after this one in list order, wrapping at the end. */
export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = CASE_STUDIES.findIndex((study) => study.slug === slug);
  if (index === -1 || CASE_STUDIES.length < 2) return undefined;
  return CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
}
