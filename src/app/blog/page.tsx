import type { Metadata } from "next";
import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import {
  BLOG_PATH,
  POST_TOPICS,
  formatPostDate,
  getPosts,
  postHref,
  readingMinutes,
  topicLabel,
} from "@/config/blog";
import { PostList, type PostCardData } from "./_components/PostList";

export const metadata: Metadata = {
  title: "Blog | UthriX Digital",
  description:
    "Practical notes on marketing, websites and software for hotels, online sellers and service businesses, from the UthriX Digital team.",
  alternates: { canonical: BLOG_PATH },
};

export default function BlogPage() {
  const posts: PostCardData[] = getPosts().map((post) => ({
    slug: post.slug,
    href: postHref(post.slug),
    title: post.title,
    excerpt: post.excerpt,
    topic: post.topic,
    topicLabel: topicLabel(post.topic),
    date: { iso: post.publishedAt, label: formatPostDate(post.publishedAt) },
    minutes: readingMinutes(post),
  }));

  return (
    <div className="bg-background text-foreground">
      <section aria-labelledby="blog-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3.5rem,8vw,8rem)] pt-32 lg:pt-40">
          <Reveal immediate>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>About</span>
              <span aria-hidden="true">·</span>
              <span className="text-brand-text">Blog</span>
            </p>
            <h1
              id="blog-title"
              className="font-archivo-black mt-6 max-w-[12ch] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.86] tracking-[-0.075em]"
            >
              Notes on growth<span className="text-brand">.</span>
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mt-8 max-w-2xl text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.45] tracking-tight text-foreground/80">
              Practical advice on marketing, websites and software, written for
              the people running the business.
            </p>
          </Reveal>

          <div className="mt-[clamp(2.5rem,6vw,4rem)]">
            <PostList posts={posts} topics={POST_TOPICS} />
          </div>
        </div>
      </section>
    </div>
  );
}
