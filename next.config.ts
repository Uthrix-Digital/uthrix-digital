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
    return [
      {
        source: "/BusinessIdea",
        destination: "/BusinessStrategy",
        permanent: true,
      },
      // Old "Who we help" pages, now split by business type and stage.
      {
        source: "/for/startups",
        destination: "/for/stage/starting",
        permanent: true,
      },
      {
        source: "/for/business-owners",
        destination: "/for/stage/stuck",
        permanent: true,
      },
      {
        source: "/for/fix-my-system",
        destination: "/for/stage/growing",
        permanent: true,
      },
      {
        source: "/for/partners",
        destination: "/partners",
        permanent: true,
      },
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
