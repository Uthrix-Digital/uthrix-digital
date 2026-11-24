import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { z } from "zod";

import { POSTS_CACHE_TAG } from "@/sanity/lib/posts";

/**
 * POST /api/revalidate
 *
 * Called by a Sanity webhook when a post or author is published, changed
 * or deleted. Clears the cached posts so the blog, the sitemap and the
 * llms.txt files show the change on the next visit.
 *
 * Set up in sanity.io/manage → API → Webhooks:
 *   URL:        https://<site>/api/revalidate
 *   Dataset:    production
 *   Trigger on: Create, Update, Delete
 *   Filter:     _type in ["post", "author"]
 *   Projection: { _type, "slug": slug.current }
 *   Secret:     the same value as SANITY_REVALIDATE_SECRET
 */

const payloadSchema = z.object({
  _type: z.enum(["post", "author"]),
  slug: z.string().nullish(),
});

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "SANITY_REVALIDATE_SECRET is not set." },
      { status: 500 },
    );
  }

  try {
    // `true` waits a moment so the Sanity CDN has the new content first.
    const { isValidSignature, body } = await parseBody(request, secret, true);
    if (!isValidSignature) {
      return NextResponse.json(
        { ok: false, error: "Invalid signature." },
        { status: 401 },
      );
    }

    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Unexpected payload." },
        { status: 400 },
      );
    }

    revalidateTag(POSTS_CACHE_TAG, { expire: 0 });
    return NextResponse.json({
      ok: true,
      revalidated: POSTS_CACHE_TAG,
      type: parsed.data._type,
      slug: parsed.data.slug ?? null,
    });
  } catch (error) {
    console.error("Sanity revalidate webhook failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not process the webhook." },
      { status: 500 },
    );
  }
}
