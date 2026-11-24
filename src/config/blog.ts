/**
 * Blog: addresses, labels and text helpers shared by /blog, every
 * /blog/<slug> page, the sitemap, the llms.txt files and the navigation.
 *
 * Safe to import anywhere, including Client Components (the header imports
 * BLOG_PATH). Reading posts from Sanity is server-only and lives in
 * src/sanity/lib/posts.ts: getPosts(), getPost(), getRelatedPosts().
 *
 * ── Adding a post ──────────────────────────────────────────────────────────
 * Posts are written and published in Sanity Studio (`npm run studio`), not
 * here. The slug becomes the URL. A post with a future publish date goes
 * live on that date. See src/sanity/ for the schema and the query.
 *
 * `topic` ties a post to a "Who we help" page: it drives the filter and the
 * closing call to action. Use "general" for posts that fit everyone.
 */

import type { Post, PostAuthor } from "@/sanity/lib/posts";
import { POST_TOPICS, type PostTopic } from "./postTopics";

export { POST_TOPICS, type Post, type PostAuthor, type PostTopic };

export const BLOG_PATH = "/blog";

export function topicLabel(topic: PostTopic) {
  return POST_TOPICS.find((t) => t.id === topic)?.label ?? "Strategy";
}

export function postHref(slug: string) {
  return `${BLOG_PATH}/${slug}`;
}

const WORDS_PER_MINUTE = 200;

/** Words in the post body: the text of every block, links and lists included. */
export function wordCount(post: Post): number {
  const text = post.body
    .map((block) =>
      Array.isArray(block.children)
        ? block.children
            .map((child) => (typeof child.text === "string" ? child.text : ""))
            .join("")
        : "",
    )
    .join(" ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

export function readingMinutes(post: Post): number {
  return Math.max(1, Math.round(wordCount(post) / WORDS_PER_MINUTE));
}

/** "12 Nov 2026" — fixed locale and zone so server and client agree. */
export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
