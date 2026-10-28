import { Hero2 } from "@/components/shared/(HeroSection)/Hero2";
import { ConnectsDots } from "@/components/shared/(ConnetsDots)/ConnectsDots";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-foreground text-white transition-colors duration-300">
      <div className="relative z-10">
      </div>
      <main className="py-0">
        <Hero2 />
        <ConnectsDots />
      </main>
      
    </div>
  );
}
