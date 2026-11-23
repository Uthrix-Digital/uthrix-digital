import type { Metadata } from "next";
import { Hero } from "@/components/shared/(HeroSection)/Hero";
import { ConnectsDots } from "@/components/shared/(ConnetsDots)/ConnectsDots";
import { FeaturedCaseStudies } from "@/components/shared/(CaseStudies)/FeaturedCaseStudies";
import { HowCanWeHelp } from "@/components/shared/(HowCanWeHelp)/HowCanWeHelp";
import { siteConfig } from "@/config/siteConfig";

const title = `${siteConfig.companyName} | Web Development & Digital Marketing`;

export const metadata: Metadata = {
  title,
  description: siteConfig.description,
  // No openGraph here on purpose: a page-level openGraph object replaces the
  // layout's (site name, type, share image). og:title/description fall back
  // to the title and description above.
  alternates: { canonical: "/" },
};

export default function Home() {
  // The root layout already wraps every page in <main>; a second one here
  // would give the page two main landmarks.
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Hero />
      <HowCanWeHelp />
      <FeaturedCaseStudies />
      <ConnectsDots />
    </div>
  );
}
