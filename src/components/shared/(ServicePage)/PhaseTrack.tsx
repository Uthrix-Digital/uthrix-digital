import Link from "next/link";
import { NODES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/nodes";
import type { Phase } from "@/app/ConnetMainDots/(GrowthPathMap)/types";

export const PHASE_INFO: readonly {
  id: Phase;
  label: string;
  description: string;
}[] = [
  {
    id: "foundation",
    label: "Foundation",
    description: "Set the strategy and the identity.",
  },
  {
    id: "build",
    label: "Build",
    description: "Create the places customers find you.",
  },
  {
    id: "grow",
    label: "Grow",
    description: "Bring the right people in.",
  },
  {
    id: "retain",
    label: "Retain",
    description: "Turn interest into loyal customers.",
  },
];

interface PhaseTrackProps {
  /** Service bits to highlight. */
  mask: number;
}

/**
 * The four growth phases with each service listed under its phase.
 * Highlighted services (in `mask`) and their phases glow in brand red.
 */
export function PhaseTrack({ mask }: PhaseTrackProps) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-card-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {PHASE_INFO.map((phase, index) => {
        const nodes = NODES.filter((n) => n.phase === phase.id);
        const active = nodes.some((n) => (mask & n.bit) !== 0);

        return (
          <li
            key={phase.id}
            className={`flex flex-col gap-4 p-6 transition-colors sm:p-7 ${
              active ? "bg-surface-raised" : "bg-background"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`size-3 rounded-full ${
                  active ? "bg-brand-bright shadow-glow-sm" : "bg-track-dot"
                }`}
              />
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-archivo-black text-xl uppercase tracking-[-0.03em]">
                {phase.label}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {phase.description}
            </p>
            <ul className="mt-auto flex flex-wrap gap-2">
              {nodes.map((node) => {
                const selected = (mask & node.bit) !== 0;
                return (
                  <li key={node.id}>
                    <Link
                      href={node.route}
                      aria-current={selected ? "true" : undefined}
                      className={`inline-flex rounded-full border px-3 py-1 text-sm transition-colors ${
                        selected
                          ? "border-brand bg-brand text-brand-foreground"
                          : "border-border-strong/40 text-foreground/80 hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {node.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
