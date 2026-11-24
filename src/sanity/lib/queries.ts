import { defineQuery } from "next-sanity";

/**
 * Published posts whose publish date has arrived, newest first.
 * `publishedAt` is a date ("2026-11-24"), and it sorts before any time on
 * the same day from now(), so a post goes live at 00:00 UTC on its date.
 */
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) {
      "slug": slug.current,
      title,
      excerpt,
      topic,
      publishedAt,
      updatedAt,
      author->{ name, role, url },
      body
    }
`);
