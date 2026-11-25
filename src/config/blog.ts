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

import type {
  Post,
  PostAuthor,
  PostBodyItem,
  PostCover,
} from "@/sanity/lib/posts";
import { POST_TOPICS, type PostTopic } from "./postTopics";

export { POST_TOPICS, type Post, type PostAuthor, type PostCover, type PostTopic };

export const BLOG_PATH = "/blog";

export function topicLabel(topic: PostTopic) {
  return POST_TOPICS.find((t) => t.id === topic)?.label ?? "Strategy";
}

export function postHref(slug: string) {
  return `${BLOG_PATH}/${slug}`;
}

const WORDS_PER_MINUTE = 200;

/** The plain text of one body item: a text block, or a callout's text. */
export function bodyItemText(item: PostBodyItem): string {
  if (item._type === "callout" && "text" in item) return item.text;
  if (item._type === "block" && "children" in item && Array.isArray(item.children)) {
    return item.children
      .map((child) =>
        "text" in child && typeof child.text === "string" ? child.text : "",
      )
      .join("");
  }
  return "";
}

/** Words in the post body: every block, list item and callout. */
export function wordCount(post: Post): number {
  const text = post.body.map(bodyItemText).join(" ").trim();
  return text ? text.split(/\s+/).length : 0;
}

export interface PostHeading {
  /** The block's _key, to match the heading while rendering. */
  key: string;
  /** The anchor: /blog/<slug>#<id>. */
  id: string;
  text: string;
}

/**
 * Every H2 in the body, with a unique anchor id made from its text.
 * Used for the table of contents and for the ids on the headings
 * themselves, so both always agree.
 */
export function postHeadings(post: Post): PostHeading[] {
  const seen = new Map<string, number>();
  return post.body.flatMap((item) => {
    if (item._type !== "block" || !("style" in item) || item.style !== "h2") return [];
    const text = bodyItemText(item).trim();
    if (!text) return [];
    const base =
      text
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return [{ key: item._key ?? base, id: count ? `${base}-${count + 1}` : base, text }];
  });
}

export function readingMinutes(post: Post): number {
  return Math.max(1, Math.round(wordCount(post) / WORDS_PER_MINUTE));
}

/** The plain data a post card needs (see src/app/blog/_components/PostCard.tsx). */
export function toPostCard(post: Post) {
  return {
    slug: post.slug,
    href: postHref(post.slug),
    title: post.title,
    excerpt: post.excerpt,
    topic: post.topic,
    topicLabel: topicLabel(post.topic),
    date: { iso: post.publishedAt, label: formatPostDate(post.publishedAt) },
    minutes: readingMinutes(post),
    cover: post.cover,
    featured: post.featured,
    author: post.author
      ? { name: post.author.name, role: post.author.role, photo: post.author.photo }
      : undefined,
  };
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
