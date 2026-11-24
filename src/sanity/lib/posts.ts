import type { PortableTextBlock } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { POST_TOPICS, type PostTopic } from "@/config/postTopics";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

/*
 * Server-only: reads blog posts from Sanity. Import it from Server
 * Components, route handlers, the sitemap and llms.ts, never from a
 * Client Component. Shared, client-safe helpers live in src/config/blog.ts.
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

const blockSchema = z.custom<PortableTextBlock>(
  (value) =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as { _key?: unknown })._key === "string" &&
    typeof (value as { _type?: unknown })._type === "string",
  { message: "Not a Portable Text block" },
);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const postSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  topic: topicSchema,
  publishedAt: isoDate,
  updatedAt: optional(isoDate),
  author: optional(
    z.object({
      name: z.string().min(1),
      role: optional(z.string()),
      url: optional(z.string().url()),
    }),
  ),
  body: z.array(blockSchema).min(1),
});

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
export async function getRelatedPosts(post: Post, count = 2): Promise<Post[]> {
  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  return [
    ...others.filter((p) => p.topic === post.topic),
    ...others.filter((p) => p.topic !== post.topic),
  ].slice(0, count);
}
