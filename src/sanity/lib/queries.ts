import { defineQuery } from "next-sanity";

/**
 * Published posts whose publish date has arrived, newest first.
 * `publishedAt` is a date ("2026-11-24"), and it sorts before any time on
 * the same day from now(), so a post goes live at 00:00 UTC on its date.
 *
 * Images come with their asset id, crop and hotspot (to build sized URLs)
 * plus the size and a tiny blurred preview (LQIP) from the asset metadata.
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
      "featured": coalesce(featured, false),
      coverImage {
        alt,
        caption,
        crop,
        hotspot,
        "asset": asset->{
          _id,
          "lqip": metadata.lqip,
          "width": metadata.dimensions.width,
          "height": metadata.dimensions.height
        }
      },
      keyTakeaways,
      author->{
        name,
        role,
        url,
        bio,
        image {
          crop,
          hotspot,
          "asset": asset->{ _id }
        }
      },
      body[] {
        ...,
        _type == "image" => {
          alt,
          caption,
          crop,
          hotspot,
          "asset": asset->{
            _id,
            "lqip": metadata.lqip,
            "width": metadata.dimensions.width,
            "height": metadata.dimensions.height
          }
        }
      },
      faq[] { _key, question, answer }
    }
`);
