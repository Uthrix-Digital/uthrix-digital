import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";

import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { JsonLd } from "@/components/shared/JsonLd";
import { AUDIENCES, audienceHref } from "@/config/audiences";
import {
  BLOG_PATH,
  formatPostDate,
  postHeadings,
  postHref,
  readingMinutes,
  toPostCard,
  topicLabel,
  wordCount,
  type PostAuthor,
} from "@/config/blog";
import { siteConfig } from "@/config/siteConfig";
import { pageOpenGraph } from "@/lib/metadata";
import { absoluteUrl, blogPostingSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { getPost, getPosts, getRelatedPosts } from "@/sanity/lib/posts";
import { PostCard } from "../_components/PostCard";
import { PostCover } from "../_components/PostCover";
import { PostBody } from "./_components/PostBody";
import { ReadingProgress } from "./_components/ReadingProgress";
import { ShareLinks } from "./_components/ShareLinks";
import { TableOfContents, TableOfContentsMobile } from "./_components/TableOfContents";

export const instant = false;

interface PostRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const shareImage = post.cover
    ? [{ url: post.cover.social, width: 1200, height: 630, alt: post.cover.alt }]
    : undefined;

  return {
    title: `${post.title} | Uthrix Digital`,
    description: post.excerpt,
    alternates: { canonical: postHref(post.slug) },
    ...(post.author ? { authors: [{ name: post.author.name, url: post.author.url }] } : {}),
    openGraph: pageOpenGraph({
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: postHref(post.slug),
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      section: topicLabel(post.topic),
      ...(shareImage ? { images: shareImage } : {}),
    }),
    ...(shareImage
      ? {
          twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.cover!.social],
          },
        }
      : {}),
  };
}

const container = "mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)]";

export default async function PostRoute({ params }: PostRouteProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getRelatedPosts(post)).map(toPostCard);
  const audience = post.topic === "general" ? null : AUDIENCES[post.topic];
  const headings = postHeadings(post);
  const label = topicLabel(post.topic);
  const url = absoluteUrl(postHref(post.slug));

  return (
    <>
      <ReadingProgress targetId="post-article" />
      <article className="bg-background text-foreground">
        <JsonLd
          data={blogPostingSchema({
            title: post.title,
            description: post.excerpt,
            path: postHref(post.slug),
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            author: post.author,
            section: label,
            wordCount: wordCount(post),
            image: post.cover?.social,
          })}
        />
        <JsonLd
          data={breadcrumbSchema([
            { name: "Blog", path: BLOG_PATH },
            { name: post.title, path: postHref(post.slug) },
          ])}
        />
        {post.faq && <JsonLd data={faqSchema(post.faq)} />}

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header className={`${container} pb-[clamp(2rem,4vw,3rem)] pt-32 lg:pt-40`}>
          <Reveal immediate>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <li>
                  <Link href={BLOG_PATH} className="transition-colors hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="size-3.5" />
                </li>
                <li>
                  <Link
                    href={`${BLOG_PATH}?topic=${post.topic}`}
                    className="text-brand-text transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              </ol>
            </nav>
            <h1 className="font-archivo-black mt-7 max-w-[18ch] text-[clamp(2.5rem,6.5vw,6rem)] uppercase leading-[0.9] tracking-[-0.07em]">
              {post.title}
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mt-7 max-w-[46ch] text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.45] tracking-tight text-foreground/80">
              {post.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
              <AuthorChip author={post.author} />
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              {post.updatedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(post)} min read</span>
            </div>
          </Reveal>
        </header>

        {/* ── Cover ────────────────────────────────────────────────────── */}
        <figure className={container}>
          <PostCover cover={post.cover} variant="wide" topicLabel={label} priority sizes="100vw" />
          {post.cover?.caption && (
            <figcaption className="mt-3 text-sm text-muted-foreground">{post.cover.caption}</figcaption>
          )}
        </figure>

        {/* ── Contents · article · call to action ─────────────────────── */}
        <div
          id="post-article"
          className={`${container} grid gap-x-12 py-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,42rem)_17rem] xl:justify-between xl:gap-x-16`}
        >
          <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
            <div className="flex flex-col gap-10">
              <TableOfContents headings={headings} />
              <ShareLinks url={url} title={post.title} />
            </div>
          </aside>

          <div className="min-w-0 max-w-[42rem]">
            <div className="mb-8 lg:hidden">
              <TableOfContentsMobile headings={headings} />
            </div>

            {post.keyTakeaways && (
              <section
                aria-labelledby="takeaways-title"
                className="mb-10 rounded-card-lg bg-muted/60 p-6 sm:p-7"
              >
                <h2 id="takeaways-title" className="nav-panel-label !text-brand-text">
                  Key takeaways
                </h2>
                <ul className="mt-4 grid gap-3">
                  {post.keyTakeaways.map((point) => (
                    <li key={point} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                      <span aria-hidden="true" className="mt-[0.6rem] size-2 shrink-0 rounded-full bg-brand-bright" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <PostBody value={post.body} headings={headings} />

            {post.faq && (
              <section aria-labelledby="faq-title" className="mt-16 border-t border-border pt-10">
                <h2
                  id="faq-title"
                  className="text-[clamp(1.6rem,2.6vw,2rem)] font-semibold leading-[1.15] tracking-[-0.03em]"
                >
                  Questions
                </h2>
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {post.faq.map((item, i) => (
                    <details key={item._key} open={i === 0} className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold leading-snug">
                        {item.question}
                        <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="-mt-1 pb-6 text-[1.0625rem] leading-relaxed text-foreground/80">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 lg:hidden">
              <ShareLinks url={url} title={post.title} />
            </div>

            <AuthorBox author={post.author} />
          </div>

          <aside className="hidden self-start xl:sticky xl:top-28 xl:block">
            <div className="rounded-card-lg border border-border p-6">
              <p className="nav-panel-label !text-brand-text">
                {audience ? audience.label : "Free strategy call"}
              </p>
              <p className="font-archivo-black mt-3 text-[1.75rem] uppercase leading-[0.92] tracking-[-0.06em]">
                Let&apos;s look at your business
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A free 20-minute call to find the first thing worth fixing. No pressure, no jargon.
              </p>
              <Link
                href="/book-a-call"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
              >
                Book a free call
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Next step ────────────────────────────────────────────────── */}
        <section aria-labelledby="post-cta-title" className="bg-brand-surface text-brand-surface-foreground">
          <div className={`${container} grid gap-8 py-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end`}>
            <h2
              id="post-cta-title"
              className="font-archivo-black text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.88] tracking-[-0.07em]"
            >
              {audience ? `Running a ${audience.label.toLowerCase()} business?` : "Not sure where to start?"}
            </h2>
            <div>
              <p className="text-lg leading-snug tracking-tight">
                {audience
                  ? "See the plan we've built for businesses like yours, from your first website to scaling with systems."
                  : "Tell us where you are today and we'll suggest an honest first step."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={audience ? audienceHref(audience.id) : "/growth-map"}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-surface-foreground px-6 py-3 text-base font-semibold text-brand-surface transition-colors hover:bg-background hover:text-foreground"
                >
                  {audience ? `See the ${audience.shortLabel} plan` : "Plan your growth path"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/book-a-call"
                  className="inline-flex items-center rounded-full border border-brand-surface-foreground/50 px-6 py-3 text-base font-semibold transition-colors hover:border-brand-surface-foreground"
                >
                  Book a free 20-min call
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Keep reading ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section aria-labelledby="related-title">
            <div className={`${container} py-[clamp(3rem,7vw,6rem)]`}>
              <Reveal className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <p className="nav-panel-label">Keep reading</p>
                  <h2
                    id="related-title"
                    className="font-archivo-black mt-4 text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[0.9] tracking-[-0.07em]"
                  >
                    More notes
                  </h2>
                </div>
                <Link
                  href={BLOG_PATH}
                  className="hidden items-center gap-2 text-sm font-semibold text-brand-text sm:inline-flex"
                >
                  All posts
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Reveal>
              <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <PostCard post={item} compact />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ author, size }: { author?: PostAuthor; size: "sm" | "lg" }) {
  const name = author?.name ?? siteConfig.companyName;
  const box = size === "lg" ? "size-16 text-base" : "size-9 text-xs";
  if (author?.photo) {
    return (
      <Image
        src={author.photo}
        alt=""
        width={size === "lg" ? 64 : 36}
        height={size === "lg" ? 64 : 36}
        className={`${box} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${box} flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground`}
    >
      {initials(name)}
    </span>
  );
}

/** "Gayashan Deshapriya · Founder" next to the date in the header. */
function AuthorChip({ author }: { author?: PostAuthor }) {
  return (
    <span className="flex items-center gap-3">
      <Avatar author={author} size="sm" />
      <span>
        <span className="font-semibold text-foreground">
          {author?.name ?? `The ${siteConfig.companyName} team`}
        </span>
        {author?.role && <span> · {author.role}</span>}
      </span>
    </span>
  );
}

/** Who wrote the post, after the article. Credits the company when no author is set. */
function AuthorBox({ author }: { author?: PostAuthor }) {
  return (
    <section
      aria-label="About the author"
      className="mt-12 flex flex-col gap-5 rounded-card-lg border border-border p-6 sm:flex-row sm:items-start"
    >
      <Avatar author={author} size="lg" />
      <div>
        <p className="nav-panel-label">Written by</p>
        <p className="mt-2 text-lg font-semibold leading-tight">
          {author?.name ?? `The ${siteConfig.companyName} team`}
          {author?.role && (
            <span className="font-normal text-muted-foreground"> · {author.role}</span>
          )}
        </p>
        <p className="mt-2 leading-relaxed text-foreground/75">
          {author?.bio ??
            "A small team in Sri Lanka building websites, software and marketing systems for hotels, online sellers and service businesses."}
        </p>
        {author?.url ? (
          <a
            href={author.url}
            rel="author noopener noreferrer"
            target="_blank"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text underline-offset-4 hover:underline"
          >
            View profile
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        ) : (
          !author && (
            <Link
              href="/company"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text underline-offset-4 hover:underline"
            >
              About us
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )
        )}
      </div>
    </section>
  );
}
