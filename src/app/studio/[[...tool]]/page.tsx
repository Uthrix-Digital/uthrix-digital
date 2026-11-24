/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

// No `export const dynamic = 'force-static'` here: route segment configs
// are not allowed with `cacheComponents: true` (see next.config.ts).
//
// The catch-all segment means the URL isn't known at build time, and the
// root layout reads it (usePathname in MetaPixel, Navigation, PageTransition).
// Like the other dynamic routes on this site, opt into a blocking render.
export const instant = false

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
