import type { PortableTextBlock } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { POST_TOPICS, type PostTopic } from "@/config/postTopics";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";

/*
 * Server-only: reads blog posts from Sanity. Import it from Server
 * Components, route handlers, the sitemap and llms.ts, never from a
 * Client Component. Shared, client-safe helpers live in src/config/blog.ts.
 *
 * Image URLs are built here, on the server, so pages and Client Components
 * receive plain strings and never need the Sanity project settings.
 */

/** Cache tag for every blog post read. The Sanity webhook clears it. */
export const POSTS_CACHE_TAG = "posts";

/** GROQ returns null for empty fields; the site expects them left out. */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  schema.nullish().transform((value) => value ?? undefined);

const topicSchema = z.custom<PostTopic>(
  (value) => POST_TOPICS.some((topic) => topic.id === value),
  { message: "Unknown topic" },
);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

// ── Images ──────────────────────────────────────────────────────────────

const rawImageSchema = z.object({
  alt: optional(z.string()),
  caption: optional(z.string()),
  crop: z.unknown().optional(),
  hotspot: z.unknown().optional(),
  asset: optional(
    z.object({
      _id: z.string(),
      lqip: optional(z.string()),
      width: optional(z.number()),
      height: optional(z.number()),
    }),
  ),
});
type RawImage = z.infer<typeof rawImageSchema>;

/** Builds a Sanity CDN URL, cropped around the editor's hotspot. */
function imageUrl(image: RawImage, width: number, height?: number) {
  const source = {
    asset: { _ref: image.asset!._id },
    crop: image.crop,
    hotspot: image.hotspot,
  } as Parameters<typeof urlFor>[0];
  let builder = urlFor(source).width(width).auto("format").quality(80);
  if (height) builder = builder.height(height).fit("crop");
  return builder.url();
}

export interface PostCover {
  alt: string;
  caption?: string;
  /** Tiny blurred preview, shown while the image loads. */
  lqip?: string;
  /** 16:9, for cards. */
  card: string;
  /** 21:9, for the top of the post page. */
  wide: string;
  /** 1200×630, for link previews (Open Graph) and structured data. */
  social: string;
}

function toCover(image: RawImage | undefined, fallbackAlt: string): PostCover | undefined {
  if (!image?.asset) return undefined;
  return {
    alt: image.alt ?? fallbackAlt,
    caption: image.caption,
    lqip: image.asset.lqip,
    card: imageUrl(image, 1200, 675),
    wide: imageUrl(image, 2400, 1029),
    social: imageUrl(image, 1200, 630),
  };
}

/** An image inside the post body, ready for next/image. */
export interface PostBodyImage {
  _type: "image";
  _key: string;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  lqip?: string;
}

/** A tip, note or warning box inside the post body. */
export interface PostCallout {
  _type: "callout";
  _key: string;
  tone: "tip" | "note" | "warning";
  text: string;
}

export type PostBodyItem = PortableTextBlock | PostBodyImage | PostCallout;

const BODY_IMAGE_WIDTH = 1600;

const bodyItemSchema = z
  .object({ _type: z.string(), _key: z.string() })
  .passthrough()
  .transform((item): PostBodyItem | null => {
    if (item._type === "image") {
      const image = rawImageSchema.safeParse(item);
      if (!image.success || !image.data.asset) return null;
      const { asset } = image.data;
      const width = Math.min(asset.width ?? BODY_IMAGE_WIDTH, BODY_IMAGE_WIDTH);
      const ratio = asset.width && asset.height ? asset.height / asset.width : 9 / 16;
      return {
        _type: "image",
        _key: item._key,
        src: imageUrl(image.data, width),
        alt: image.data.alt ?? "",
        caption: image.data.caption,
        width,
        height: Math.round(width * ratio),
        lqip: asset.lqip,
      };
    }
    if (item._type === "callout") {
      const callout = z
        .object({ tone: z.enum(["tip", "note", "warning"]).catch("note"), text: z.string() })
        .safeParse(item);
      if (!callout.success) return null;
      return { _type: "callout", _key: item._key, ...callout.data };
    }
    if (item._type === "block") return item as unknown as PortableTextBlock;
    // A body type the site doesn't render yet: skip it, keep the post.
    return null;
  });

// ── Post ────────────────────────────────────────────────────────────────

export const postSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    topic: topicSchema,
    publishedAt: isoDate,
    updatedAt: optional(isoDate),
    featured: z.boolean().catch(false),
    coverImage: optional(rawImageSchema),
    keyTakeaways: optional(z.array(z.string().min(1))),
    author: optional(
      z.object({
        name: z.string().min(1),
        role: optional(z.string()),
        url: optional(z.string().url()),
        bio: optional(z.string()),
        image: optional(rawImageSchema),
      }),
    ),
    body: z.array(bodyItemSchema).min(1),
    faq: optional(
      z.array(z.object({ _key: z.string(), question: z.string().min(1), answer: z.string().min(1) })),
    ),
  })
  .transform(({ coverImage, author, body, keyTakeaways, faq, ...post }) => ({
    ...post,
    cover: toCover(coverImage, post.title),
    keyTakeaways: keyTakeaways?.length ? keyTakeaways : undefined,
    author: author
      ? {
          name: author.name,
          role: author.role,
          url: author.url,
          bio: author.bio,
          photo: author.image?.asset ? imageUrl(author.image, 160, 160) : undefined,
        }
      : undefined,
    body: body.filter((item): item is PostBodyItem => item !== null),
    faq: faq?.length ? faq : undefined,
  }));

export type Post = z.infer<typeof postSchema>;
export type PostAuthor = NonNullable<Post["author"]>;

/**
 * Every published post whose publish date has arrived, newest first.
 *
 * Cached until the Sanity webhook clears the "posts" tag (see
 * src/app/api/revalidate/route.ts), and at most for an hour, so a post
 * scheduled for a future date appears on its day without a publish event.
 *
 * A post that doesn't match the schema is skipped and logged instead of
 * breaking the whole blog.
 */
export async function fetchPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(POSTS_CACHE_TAG);
  cacheLife("hours");

  const raw = await client.fetch(POSTS_QUERY, {}, { perspective: "published" });

  return z
    .array(z.unknown())
    .parse(raw)
    .flatMap((item) => {
      const parsed = postSchema.safeParse(item);
      if (parsed.success) return [parsed.data];
      const slug = (item as { slug?: unknown } | null)?.slug;
      console.error(
        `Skipping Sanity post "${String(slug)}": ${parsed.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ")}`,
      );
      return [];
    });
}

/** Posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  return fetchPosts();
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

/** Up to `count` other posts, same topic first. */
export async function getRelatedPosts(post: Post, count = 3): Promise<Post[]> {
  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  return [
    ...others.filter((p) => p.topic === post.topic),
    ...others.filter((p) => p.topic !== post.topic),
  ].slice(0, count);
}
