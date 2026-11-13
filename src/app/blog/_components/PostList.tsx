"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import type { PostTopic } from "@/config/blog";

export interface PostCardData {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  topic: PostTopic;
  topicLabel: string;
  date: { iso: string; label: string };
  minutes: number;
}

interface PostListProps {
  posts: PostCardData[];
  topics: { id: PostTopic; label: string }[];
}

/** Topic filter chips plus the post grid. */
export function PostList({ posts, topics }: PostListProps) {
  const [topic, setTopic] = useState<PostTopic | "all">("all");

  // Only offer topics that have at least one post.
  const available = topics.filter((t) => posts.some((p) => p.topic === t.id));
  const visible = topic === "all" ? posts : posts.filter((p) => p.topic === topic);

  const chip = (active: boolean) =>
    `inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-foreground/25 hover:border-foreground"
    }`;

  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label="Filter posts by topic">
        <li>
          <button
            type="button"
            onClick={() => setTopic("all")}
            aria-pressed={topic === "all"}
            className={chip(topic === "all")}
          >
            All posts
          </button>
        </li>
        {available.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => setTopic(t.id)}
              aria-pressed={topic === t.id}
              className={chip(topic === t.id)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? "post" : "posts"}
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {visible.map((post, i) => (
          <li key={post.slug}>
            <Reveal delay={Math.min(i, 3) * 0.05} className="h-full">
              <Link
                href={post.href}
                className="group flex h-full flex-col gap-4 rounded-card-lg border border-border bg-background p-6 transition-colors hover:border-foreground sm:p-8"
              >
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="text-brand-text">{post.topicLabel}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date.iso}>{post.date.label}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.minutes} min read</span>
                </span>
                <span className="text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                  {post.title}
                </span>
                <span className="leading-relaxed text-foreground/75">
                  {post.excerpt}
                </span>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-text">
                  Read the post
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
