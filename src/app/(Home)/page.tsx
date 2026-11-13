import { Hero } from "@/components/shared/(HeroSection)/Hero";
import { ConnectsDots } from "@/components/shared/(ConnetsDots)/ConnectsDots";
import { FeaturedCaseStudies } from "@/components/shared/(CaseStudies)/FeaturedCaseStudies";
import { HowCanWeHelp } from "@/components/shared/(HowCanWeHelp)/HowCanWeHelp";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="relative z-10">
      </div>
      <main>
        <Hero />
        <HowCanWeHelp />
        <FeaturedCaseStudies />
        <ConnectsDots />
      </main>
      
    </div>
  );
}
