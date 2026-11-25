/**
 * Environment for Sanity Studio (sanity.config.ts).
 *
 * The Studio is built by the Sanity CLI (`npm run studio`, `npm run
 * studio:deploy`), not by Next.js. The CLI only puts variables whose names
 * start with `SANITY_STUDIO_` into the browser bundle, so `NEXT_PUBLIC_*`
 * names are `undefined` here. Set these in `.env.local` (the CLI reads it):
 *
 *   SANITY_STUDIO_PROJECT_ID=...
 *   SANITY_STUDIO_DATASET=production
 *
 * Project ID and dataset are not secrets: they end up in the public Studio.
 */

export const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION || '2026-11-24'

export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET,
  'Missing environment variable: SANITY_STUDIO_DATASET'
)

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || v === '') {
    throw new Error(errorMessage)
  }

  return v
}
