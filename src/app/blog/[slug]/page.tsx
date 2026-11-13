import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { AUDIENCES, audienceHref } from "@/config/audiences";
import {
  BLOG_PATH,
  POSTS,
  formatPostDate,
  getPost,
  getRelatedPosts,
  postHref,
  readingMinutes,
  topicLabel,
} from "@/config/blog";

export const instant = false;

interface PostRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | UthriX Digital`,
    description: post.excerpt,
    alternates: { canonical: postHref(post.slug) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function PostRoute({ params }: PostRouteProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const audience = post.topic === "general" ? null : AUDIENCES[post.topic];

  return (
    <article className="bg-background text-foreground">
      <header>
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(2.5rem,6vw,5rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <Link
              href={BLOG_PATH}
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              All posts
            </Link>
            <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span className="text-brand-text">{topicLabel(post.topic)}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(post)} min read</span>
            </p>
            <h1 className="font-archivo-black mt-6 max-w-[20ch] text-[clamp(2.5rem,7vw,6.5rem)] uppercase leading-[0.9] tracking-[-0.07em]">
              {post.title}
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mt-8 max-w-2xl text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.45] tracking-tight text-foreground/80">
              {post.excerpt}
            </p>
          </Reveal>
        </div>
      </header>

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-3xl px-[clamp(1.25rem,5vw,2rem)] py-[clamp(3rem,7vw,6rem)]">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="mt-12 text-2xl font-semibold leading-tight tracking-[-0.03em] first:mt-0 sm:text-3xl"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="mt-5 grid gap-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-lg leading-relaxed text-foreground/85"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-3 size-2 shrink-0 rounded-full bg-brand-bright"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p
                key={i}
                className="mt-5 text-lg leading-relaxed text-foreground/85 first:mt-0"
              >
                {block.text}
              </p>
            );
          })}
        </div>
      </div>

      {/* ── Next step ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="post-cta-title"
        className="bg-brand-surface text-brand-surface-foreground"
      >
        <div className="mx-auto grid w-full max-w-[100rem] gap-8 px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <h2
            id="post-cta-title"
            className="font-archivo-black text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.88] tracking-[-0.07em]"
          >
            {audience
              ? `Running a ${audience.label.toLowerCase()} business?`
              : "Not sure where to start?"}
          </h2>
          <div>
            <p className="text-lg leading-snug tracking-tight">
              {audience
                ? "See the plan we've built for businesses like yours, from your first website to scaling with systems."
                : "Tell us where you are today and we'll suggest an honest first step."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={audience ? audienceHref(audience.id) : "/ConnetMainDots"}
                className="inline-flex items-center gap-2 rounded-full bg-brand-surface-foreground px-6 py-3 text-base font-semibold text-brand-surface transition-colors hover:bg-background hover:text-foreground"
              >
                {audience ? `See the ${audience.shortLabel} plan` : "Plan your growth path"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/BookACall"
                className="inline-flex items-center rounded-full border border-brand-surface-foreground/50 px-6 py-3 text-base font-semibold transition-colors hover:border-brand-surface-foreground"
              >
                Book a free 20-min call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title">
          <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,7vw,6rem)]">
            <Reveal className="mb-8">
              <p className="nav-panel-label">Keep reading</p>
              <h2
                id="related-title"
                className="font-archivo-black mt-4 text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[0.9] tracking-[-0.07em]"
              >
                More notes
              </h2>
            </Reveal>
            <ul className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={postHref(item.slug)}
                    className="group flex h-full flex-col gap-3 rounded-card-lg border border-border p-6 transition-colors hover:border-foreground sm:p-8"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-brand-text">
                      {topicLabel(item.topic)}
                    </span>
                    <span className="text-xl font-semibold leading-tight tracking-[-0.03em] sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-text">
                      Read the post
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
