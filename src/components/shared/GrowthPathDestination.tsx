import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NODES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/nodes";
import type { NodeDef } from "@/app/ConnetMainDots/(GrowthPathMap)/types";
import { PhaseTrack, PHASE_INFO } from "@/components/shared/(ServicePage)/PhaseTrack";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";

interface GrowthPathDestinationProps {
  title: string;
  hubTitle: string;
  mask: number;
  nodes: NodeDef[];
}

/**
 * Destination for a combined growth path: shows where the selected services
 * sit across the phases and how each one feeds the next.
 */
export function GrowthPathDestination({
  title,
  hubTitle,
  mask,
  nodes,
}: GrowthPathDestinationProps) {
  return (
    <main className="bg-background text-foreground">
      <section aria-labelledby="path-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3rem,7vw,6rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <Link
              href="/ConnetMainDots"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to growth paths
            </Link>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.16em] text-brand-text">
              Your growth path · {nodes.length} connected services
            </p>
            <h1
              id="path-title"
              className="font-archivo-black mt-6 text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.84] tracking-[-0.075em]"
            >
              {hubTitle}
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mt-8 max-w-3xl text-[clamp(1.25rem,2.4vw,2rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
              {title}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              A connected path that brings the selected services together
              around one clear business goal. Each step sets up the next.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="path-phases" className="border-t border-border">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,7vw,6rem)]">
          <Reveal>
            <p className="nav-panel-label">Where it sits</p>
            <h2
              id="path-phases"
              className="font-archivo-black mt-4 mb-10 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.9] tracking-[-0.07em]"
            >
              Across your growth phases
            </h2>
            <PhaseTrack mask={mask} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="path-story" className="bg-surface-raised">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,7vw,6rem)]">
          <Reveal>
            <p className="nav-panel-label">How it connects</p>
            <h2
              id="path-story"
              className="font-archivo-black mt-4 mb-12 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.9] tracking-[-0.07em]"
            >
              Step by step
            </h2>
          </Reveal>

          <ol className="relative grid gap-4">
            {nodes.map((node, i) => {
              // A node's `why` explains how it feeds the next node on the full map.
              const canonicalNext = NODES[NODES.findIndex((n) => n.id === node.id) + 1];
              const phase = PHASE_INFO.find((p) => p.id === node.phase);
              return (
                <li key={node.id}>
                  <Reveal delay={i * 0.05}>
                    <Link
                      href={node.route}
                      className="group grid gap-4 rounded-card-lg border border-border bg-background p-6 transition-colors hover:border-foreground sm:p-8 lg:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.1fr)_auto] lg:items-center lg:gap-8"
                    >
                      <span className="font-mono text-sm text-brand-text">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {phase?.label}
                        </span>
                        <span className="mt-1 block text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                          {node.label}
                        </span>
                      </span>
                      <span className="leading-relaxed text-foreground/75">
                        {node.summary}
                        <span className="mt-2 block text-sm font-semibold text-foreground">
                          {canonicalNext && nodes.includes(canonicalNext)
                            ? `→ ${canonicalNext.label}: `
                            : "Why it matters: "}
                          <span className="font-normal text-foreground/75">{node.why}</span>
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-5 text-brand-text transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

    </main>
  );
}
