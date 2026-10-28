import { Navigation } from "@/components/layout/(header)/Navigation2";
import { Footer } from "@/components/layout/(Footer)/Footer";
import { Hero2 } from "@/components/shared/(HeroSection)/Hero2";
import { ConnectsDots } from "@/components/shared/(ConnetsDots)/ConnectsDots";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0b0b0b] text-white transition-colors duration-300">
      <div className="relative z-10">
        <Navigation />
      </div>
      <main>
        <Hero2 />
        <ConnectsDots />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
