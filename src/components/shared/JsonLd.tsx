import { siteConfig, socialProfiles } from "@/config/siteConfig";

/**
 * Structured data (schema.org JSON-LD). Search engines and AI answer engines
 * read it to understand what a page is about and who is behind it.
 *
 * Server Component: the script is in the HTML on first load, so crawlers that
 * don't run JavaScript still see it.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so text inside the data can never close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Absolute URL on the production origin. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

/** Stable ids so other pages' schema can point at these entities. */
export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

/** Who we are: rendered once, site-wide, from the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
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
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.companyName,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}
