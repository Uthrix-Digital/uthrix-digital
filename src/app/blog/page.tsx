import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Blog | UthriX Digital",
  description:
    "The UthriX Digital blog. Practical notes on marketing, websites and software for growing businesses.",
  alternates: { canonical: "/blog" },
  // Placeholder page: keep it out of search results until real content ships.
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return (
    <ComingSoon
      eyebrow="Blog"
      title="Notes on growth"
      description="Our blog is on its way. We'll share practical notes on marketing, websites and software here. Until then, our case studies show what we've been building."
      action={{ label: "See case studies", href: "/case-studies" }}
    />
  );
}
