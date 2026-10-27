import { Navigation } from "@/components/layout/(header)/Navigation";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Hero } from "@/components/shared/Hero";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-(--bg-primary)] text-(--text-primary)] transition-colors duration-300 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <ScrollToTopButton />
      </div>
      <main className="py-0">
        <Hero />
      </main>
      <section className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24"></section>
    </div>
  );
}
