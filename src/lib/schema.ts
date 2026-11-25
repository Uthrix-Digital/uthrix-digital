/**
 * schema.org builders for JSON-LD. Render the result with
 * `<JsonLd data={...} />` from `@/components/shared/JsonLd`.
 *
 * Everything reads from the same config the pages render, so the structured
 * data can never say something the page doesn't.
 */

import { siteConfig, socialProfiles } from "@/config/siteConfig";

const CONTEXT = "https://schema.org";

/** Absolute URL on the production origin. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

/** Stable ids so page-level schema can point at these entities. */
export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

const organizationRef = { "@id": ORGANIZATION_ID };

/** Who we are: rendered once, site-wide, from the root layout. */
export function organizationSchema() {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.companyName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logoPath),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      url: absoluteUrl("/contact"),
      availableLanguage: ["English"],
    },
    sameAs: socialProfiles,
  };
}

/** The site itself, published by the organization. */
export function websiteSchema() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.companyName,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en",
    publisher: organizationRef,
  };
}

export interface Crumb {
  name: string;
  /** Site path, e.g. "/services/seo". */
  path: string;
}

/** Breadcrumb trail. "Home" is added first automatically. */
export function breadcrumbSchema(crumbs: Crumb[]) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Question-and-answer pairs that are visible on the page. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** One of our services, offered by the organization. */
export function serviceSchema(service: {
  name: string;
  description: string;
  path: string;
  /** What's included, one short item each. */
  deliverables?: string[];
}) {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    "@id": absoluteUrl(`${service.path}#service`),
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: organizationRef,
    ...(service.deliverables?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${service.name}: what's included`,
            itemListElement: service.deliverables.map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name },
            })),
          },
        }
      : {}),
  };
}

export interface SchemaAuthor {
  name: string;
  /** Job title, e.g. "Founder". */
  role?: string;
  /** Profile URL, e.g. LinkedIn. */
  url?: string;
}

/** A blog post. Without a named author, the organization is the author. */
export function blogPostingSchema(post: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  author?: SchemaAuthor;
  section?: string;
  wordCount?: number;
  /** Full URL of the cover image. Falls back to the site's share image. */
  image?: string;
}) {
  const url = absoluteUrl(post.path);
  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "en",
    image: post.image ?? absoluteUrl("/opengraph-image"),
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.role ? { jobTitle: post.author.role } : {}),
          ...(post.author.url ? { url: post.author.url } : {}),
          worksFor: organizationRef,
        }
      : organizationRef,
    publisher: organizationRef,
    isPartOf: { "@id": WEBSITE_ID },
    ...(post.section ? { articleSection: post.section } : {}),
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
  };
}

/** A case study: the problem, what we did and the measured results. */
export function caseStudySchema(study: {
  title: string;
  description: string;
  path: string;
  image: string;
  client: string;
  industry: string;
  results: { value: string; metric: string }[];
  technologies: string[];
}) {
  const url = absoluteUrl(study.path);
  return {
    "@context": CONTEXT,
    "@type": "Article",
    "@id": `${url}#article`,
    headline: study.title,
    description: study.description,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(study.image),
    inLanguage: "en",
    articleSection: "Case study",
    author: organizationRef,
    publisher: organizationRef,
    about: { "@type": "Organization", name: study.client },
    keywords: [study.industry, ...study.technologies].join(", "),
    // Results as plain sentences: easy for answer engines to quote.
    abstract: study.results.map((r) => `${r.metric}: ${r.value}`).join(". "),
  };
}
