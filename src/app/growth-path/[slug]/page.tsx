import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { GrowthPathDestination } from "@/components/shared/GrowthPathDestination";
import {
  curatedBundleHref,
  getCuratedBundleBySlug,
  resolveGoal,
  slugifyPath,
} from "@/app/growth-map/(GrowthPathMap)/data/resolver";

export const instant = false;

interface GrowthPathPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ selection?: string }>;
}

/**
 * Two kinds of address land here:
 *  - Curated bundles: /growth-path/trusted-presence (slug only, indexable).
 *  - Any other mix from the map: /growth-path/<hub>?selection=<mask>
 *    (rendered for the visitor, kept out of the index).
 */
async function resolvePage({ params, searchParams }: GrowthPathPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const bundle = getCuratedBundleBySlug(slug);

  if (query.selection === undefined) {
    if (!bundle) return null;
    const resolved = resolveGoal(bundle.mask);
    return resolved ? { mask: bundle.mask, resolved, curated: true } : null;
  }

  const mask = Number(query.selection);
  const resolved = Number.isInteger(mask) ? resolveGoal(mask) : null;
  if (!resolved || resolved.selectedNodes.length < 2) return null;
  if (slug !== slugifyPath(resolved.hubTitle)) return null;

  // Old ?selection= link to a curated bundle: send it to the clean address.
  if (bundle && bundle.mask === mask) {
    return { mask, resolved, curated: true, redirectTo: curatedBundleHref(bundle.title) };
  }

  return { mask, resolved, curated: false };
}

export async function generateMetadata(
  props: GrowthPathPageProps,
): Promise<Metadata> {
  const page = await resolvePage(props);
  if (!page) return {};

  const { resolved, curated } = page;
  const title = `${resolved.hubTitle} growth path | Uthrix Digital`;
  const description = `${resolved.panelHeadline}. See how these services connect into one plan.`;

  if (!curated) {
    return { title, description, robots: { index: false, follow: true } };
  }

  return {
    title,
    description,
    alternates: { canonical: curatedBundleHref(resolved.hubTitle) },
  };
}

export default async function GrowthPathPage(props: GrowthPathPageProps) {
  const page = await resolvePage(props);
  if (!page) notFound();
  if (page.redirectTo) permanentRedirect(page.redirectTo);

  const { mask, resolved } = page;
  return (
    <GrowthPathDestination
      title={resolved.panelHeadline}
      hubTitle={resolved.hubTitle}
      mask={mask}
      nodes={resolved.selectedNodes}
    />
  );
}
