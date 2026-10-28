import { Navigation } from "@/components/layout/(header)/Navigation2";
import { Footer } from "@/components/layout/(Footer)/Footer";
import { Hero2 } from "@/components/shared/(HeroSection)/Hero2";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0b0b0b] text-white transition-colors duration-300">
      <div className="relative z-10">
        <Navigation />
      </div>
      <main className="py-0">
        <Hero2 />
      </main>
      <section className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24"></section>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
