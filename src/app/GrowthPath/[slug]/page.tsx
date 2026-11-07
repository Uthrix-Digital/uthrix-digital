import { notFound } from "next/navigation";
import { GrowthPathDestination } from "@/components/shared/GrowthPathDestination";
import {
  resolveGoal,
  slugifyPath,
} from "@/app/ConnetMainDots/(GrowthPathMap)/data/resolver";

export const instant = false;

interface GrowthPathPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ selection?: string }>;
}

export default async function GrowthPathPage({
  params,
  searchParams,
}: GrowthPathPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const selection = Number(query.selection);
  const resolved = Number.isInteger(selection) ? resolveGoal(selection) : null;

  if (!resolved || resolved.selectedNodes.length < 2) {
    notFound();
  }

  if (slug !== slugifyPath(resolved.hubTitle)) {
    notFound();
  }

  return (
    <GrowthPathDestination
      title={resolved.panelHeadline}
      hubTitle={resolved.hubTitle}
      mask={selection}
      nodes={resolved.selectedNodes}
    />
  );
}
