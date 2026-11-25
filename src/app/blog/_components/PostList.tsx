"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from "lucide-react";

import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import type { PostTopic } from "@/config/blog";
import { PostCard, type PostCardData } from "./PostCard";
import { PostCover } from "./PostCover";

export type { PostCardData };

interface PostListProps {
  posts: PostCardData[];
  topics: { id: PostTopic; label: string }[];
}

const PAGE_SIZE = 9;

/** Reads ?topic=, ?q= and ?page= so a filtered view can be shared. */
function readUrlState(topics: PostListProps["topics"]) {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  return {
    topic: (topics.some((t) => t.id === topic) ? topic : "all") as PostTopic | "all",
    query: params.get("q") ?? "",
    page: Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1),
  };
}

/**
 * The blog index below the heading: the featured post, topic filters,
 * search, the post grid and paging. Filtering happens in the browser (the
 * blog is small), and the state is mirrored in the URL.
 */
export function PostList({ posts, topics }: PostListProps) {
  const [topic, setTopic] = useState<PostTopic | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  // False until the shared view has been read from the URL. The URL is
  // only written after that, so a shared link is never wiped on load.
  const [restored, setRestored] = useState(false);

  // Restore a shared view (?topic=…&q=…&page=…) once, after hydration.
  useEffect(() => {
    const state = readUrlState(topics);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
    setTopic(state.topic);
    setQuery(state.query);
    setPage(state.page);
    setRestored(true);
  }, [topics]);

  // Keep the URL in step, without adding history entries.
  useEffect(() => {
    if (!restored) return;
    const params = new URLSearchParams();
    if (topic !== "all") params.set("topic", topic);
    if (query.trim()) params.set("q", query.trim());
    if (page > 1) params.set("page", String(page));
    const search = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  }, [restored, topic, query, page]);

  const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0], [posts]);
  const available = topics.filter((t) => posts.some((p) => p.topic === t.id));
  const normalized = query.trim().toLowerCase();
  const isDefaultView = topic === "all" && !normalized;

  const matches = useMemo(
    () =>
      posts.filter((p) => {
        if (topic !== "all" && p.topic !== topic) return false;
        if (!normalized) return true;
        return `${p.title} ${p.excerpt} ${p.topicLabel}`.toLowerCase().includes(normalized);
      }),
    [posts, topic, normalized],
  );

  // In the default view the featured post sits in its own card above the grid.
  const gridPosts = isDefaultView && featured ? matches.filter((p) => p !== featured) : matches;
  const pageCount = Math.max(1, Math.ceil(gridPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = gridPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const chooseTopic = (next: PostTopic | "all") => {
    setTopic(next);
    setPage(1);
  };
  const goToPage = (next: number) => {
    setPage(next);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chip = (active: boolean) =>
    `inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-foreground/25 hover:border-foreground"
    }`;

  return (
    <div>
      {isDefaultView && featured && currentPage === 1 && <FeaturedPost post={featured} />}

      <div
        ref={gridRef}
        className="flex scroll-mt-28 flex-col gap-4 pt-[clamp(2.5rem,5vw,3.5rem)] lg:flex-row lg:items-center lg:justify-between"
      >
        <ul className="flex flex-wrap gap-2" aria-label="Filter posts by topic">
          <li>
            <button
              type="button"
              onClick={() => chooseTopic("all")}
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
                onClick={() => chooseTopic(t.id)}
                aria-pressed={topic === t.id}
                className={chip(topic === t.id)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        <div role="search" className="relative w-full lg:w-72">
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts"
            className="h-11 w-full rounded-full border border-foreground/25 bg-background pl-11 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-brand/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {matches.length} {matches.length === 1 ? "post" : "posts"}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((post, i) => (
            <li key={post.slug}>
              <Reveal delay={Math.min(i, 3) * 0.05} className="h-full">
                <PostCard post={post} headingLevel="h2" />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-card-lg border border-dashed border-foreground/25 px-6 py-14 text-center">
          <p className="text-xl font-semibold tracking-[-0.02em]">
            {normalized ? `No posts match "${query.trim()}"` : "No posts in this topic yet"}
          </p>
          <p className="mt-2 text-muted-foreground">
            Try another topic, or browse every post.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              chooseTopic("all");
            }}
            className="mt-6 inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
          >
            Show all posts
          </button>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="Blog pages" className="mt-12 flex items-center justify-center gap-2">
          <PagerButton
            label="Previous page"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </PagerButton>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <PagerButton
              key={n}
              label={`Page ${n}`}
              current={n === currentPage}
              onClick={() => goToPage(n)}
            >
              {n}
            </PagerButton>
          ))}
          <PagerButton
            label="Next page"
            disabled={currentPage === pageCount}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </PagerButton>
        </nav>
      )}
    </div>
  );
}

function PagerButton({
  label,
  current = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  current?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      className={`inline-flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-35 ${
        current
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/** The large card at the top of the blog: the newest featured post. */
function FeaturedPost({ post }: { post: PostCardData }) {
  return (
    <Reveal immediate delay={0.15}>
      <article className="group relative grid gap-6 rounded-card-lg border border-border p-3 transition-colors hover:border-foreground has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand sm:p-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
        <div className="relative">
          <PostCover
            cover={post.cover}
            variant="card"
            topicLabel={post.topicLabel}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="rounded-[1.1rem]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-brand-text">
            Featured
          </span>
        </div>
        <div className="flex flex-col gap-4 px-2 pb-3 lg:px-0 lg:pb-0 lg:pr-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-brand-text">{post.topicLabel}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date.iso}>{post.date.label}</time>
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min read</span>
          </p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            <Link
              href={post.href}
              className="after:absolute after:inset-0 after:rounded-card-lg focus-visible:outline-none"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-lg leading-relaxed text-foreground/75">{post.excerpt}</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <Byline author={post.author} />
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-text">
              Read the post
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Byline({ author }: { author: PostCardData["author"] }) {
  const name = author?.name ?? "Uthrix Digital team";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex items-center gap-3 text-sm">
      {author?.photo ? (
        <Image
          src={author.photo}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-semibold"
        >
          {initials}
        </span>
      )}
      <span className="leading-tight">
        <span className="block font-semibold">{name}</span>
        {author?.role && <span className="text-muted-foreground">{author.role}</span>}
      </span>
    </span>
  );
}
