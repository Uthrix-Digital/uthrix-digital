import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { BLOG_PATH, POST_TOPICS, toPostCard } from "@/config/blog";
import { pageOpenGraph } from "@/lib/metadata";
import { getPosts } from "@/sanity/lib/posts";
import { PostList } from "./_components/PostList";

const DESCRIPTION =
  "Practical notes on marketing, websites and software for hotels, online sellers and service businesses, from the Uthrix Digital team.";

export const metadata: Metadata = {
  title: "Blog | Uthrix Digital",
  description: DESCRIPTION,
  alternates: { canonical: BLOG_PATH },
  openGraph: pageOpenGraph({ title: "Blog | Uthrix Digital", description: DESCRIPTION, url: BLOG_PATH }),
};

export default async function BlogPage() {
  const posts = (await getPosts()).map(toPostCard);

  return (
    <div className="bg-background text-foreground">
      <section aria-labelledby="blog-title">
        <div className="mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,5vw,5rem)] pb-[clamp(3.5rem,7vw,6rem)] pt-32 lg:pt-40">
          <div className="grid gap-8 pb-[clamp(2rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
            <Reveal immediate>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <span>About</span>
                <span aria-hidden="true">·</span>
                <span className="text-brand-text">Blog</span>
              </p>
              <h1
                id="blog-title"
                className="font-archivo-black mt-6 max-w-[12ch] text-[clamp(3rem,8vw,7.5rem)] uppercase leading-[0.86] tracking-[-0.075em]"
              >
                Notes on growth<span className="text-brand">.</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.1}>
              <p className="max-w-xl text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.45] tracking-tight text-foreground/80">
                Practical advice on marketing, websites and software, written
                for the people running the business. A new note every week.
              </p>
            </Reveal>
          </div>

          <PostList posts={posts} topics={POST_TOPICS} />
        </div>
      </section>

      <section
        aria-labelledby="blog-cta-title"
        className="bg-brand-surface text-brand-surface-foreground"
      >
        <div className="mx-auto grid w-full max-w-[100rem] gap-8 px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,7vw,5.5rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <h2
            id="blog-cta-title"
            className="font-archivo-black text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.88] tracking-[-0.07em]"
          >
            Want help putting this into practice?
          </h2>
          <div>
            <p className="text-lg leading-snug tracking-tight">
              Tell us where your business is today and we&apos;ll suggest an
              honest first step. The call is free and takes 20 minutes.
            </p>
            <Link
              href="/book-a-call"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-surface-foreground px-6 py-3 text-base font-semibold text-brand-surface transition-colors hover:bg-background hover:text-foreground"
            >
              Book a free 20-min call
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
