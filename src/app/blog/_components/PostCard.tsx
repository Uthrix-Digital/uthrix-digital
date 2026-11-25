import Link from "next/link";

import type { PostCover as PostCoverData, PostTopic } from "@/config/blog";
import { PostCover } from "./PostCover";

/** Everything a post card needs, as plain data (safe for Client Components). */
export interface PostCardData {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  topic: PostTopic;
  topicLabel: string;
  date: { iso: string; label: string };
  minutes: number;
  cover?: PostCoverData;
  featured: boolean;
  author?: { name: string; role?: string; photo?: string };
}

interface PostCardProps {
  post: PostCardData;
  /** Hide the excerpt, e.g. in "Keep reading". */
  compact?: boolean;
  /** Heading level for the title, so the page outline stays correct. */
  headingLevel?: "h2" | "h3";
}

/** A post in a grid: cover with topic tag, title, excerpt, date and reading time. */
export function PostCard({ post, compact = false, headingLevel = "h3" }: PostCardProps) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-card-lg border border-border bg-background p-3 transition-colors hover:border-foreground has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand">
      <div className="relative">
        <PostCover
          cover={post.cover}
          variant="card"
          topicLabel={post.topicLabel}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          hideLabel
          className="rounded-[1.1rem]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-brand-text">
          {post.topicLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-2 pb-2 pt-5">
        <Heading className="text-xl font-semibold leading-tight tracking-[-0.03em] sm:text-2xl">
          {/* The link covers the whole card; the title is its accessible name. */}
          <Link
            href={post.href}
            className="after:absolute after:inset-0 after:rounded-card-lg focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </Heading>
        {!compact && (
          <p className="line-clamp-2 leading-relaxed text-foreground/75">{post.excerpt}</p>
        )}
        <p className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm text-muted-foreground">
          <time dateTime={post.date.iso}>{post.date.label}</time>
          <span>{post.minutes} min read</span>
        </p>
      </div>
    </article>
  );
}
