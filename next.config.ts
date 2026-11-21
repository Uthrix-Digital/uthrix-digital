import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Case study covers (see src/config/caseStudies.ts).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async redirects() {
    // Redirect sources match case-insensitively (Next's default), so each
    // rule also catches /website, /WEBSITE, etc. Destinations point straight
    // at the final address so every old URL is a single 301 hop.
    // /Company -> /company (case only) is handled in src/proxy.ts, since a
    // case-insensitive rule here would redirect /company to itself.
    return [
      // Services now live under /services/<descriptive-name>.
      { source: "/BusinessStrategy", destination: "/services/business-strategy", statusCode: 301 },
      { source: "/BusinessIdea", destination: "/services/business-strategy", statusCode: 301 },
      { source: "/BrandIdentity", destination: "/services/brand-identity", statusCode: 301 },
      { source: "/Website", destination: "/services/web-development", statusCode: 301 },
      { source: "/SocialContent", destination: "/services/social-content", statusCode: 301 },
      { source: "/MetaGoogleAds", destination: "/services/meta-google-ads", statusCode: 301 },
      { source: "/Seo", destination: "/services/seo", statusCode: 301 },
      { source: "/FollowUp", destination: "/services/follow-up", statusCode: 301 },
      // No services index page yet: send it to the map that lists them.
      { source: "/services", destination: "/growth-map", permanent: false },

      // Growth map and growth paths. The query (?selection=) is passed
      // through; curated bundles then 301 to their clean slug-only address.
      { source: "/ConnetMainDots", destination: "/growth-map", statusCode: 301 },
      { source: "/GrowthPath/:slug", destination: "/growth-path/:slug", statusCode: 301 },

      // Company, contact and booking.
      { source: "/AboutUs", destination: "/company", statusCode: 301 },
      { source: "/ContactUs", destination: "/contact", statusCode: 301 },
      { source: "/BookACall", destination: "/book-a-call", statusCode: 301 },

      // Old "Who we help" pages, now split by business type and stage.
      { source: "/for/startups", destination: "/for/stage/starting", statusCode: 301 },
      { source: "/for/business-owners", destination: "/for/stage/stuck", statusCode: 301 },
      { source: "/for/fix-my-system", destination: "/for/stage/growing", statusCode: 301 },
      { source: "/for/partners", destination: "/partners", statusCode: 301 },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
