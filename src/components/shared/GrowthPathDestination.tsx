import Link from "next/link";

interface GrowthPathDestinationProps {
  title: string;
  description: string;
  services: string[];
}

export function GrowthPathDestination({
  title,
  description,
  services,
}: GrowthPathDestinationProps) {
  return (
    <main className="min-h-screen bg-foreground px-6 py-32 text-white lg:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link
          href="/ConnetMainDots"
          className="w-fit text-sm text-white/60 transition-colors hover:text-white"
        >
          ← Back to growth paths
        </Link>
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-brand">
            Your selected path
          </p>
          <h1 className="font-archivo-black text-5xl leading-[0.95] tracking-tighter sm:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
