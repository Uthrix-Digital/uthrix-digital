import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Info, Lightbulb, Link2 } from "lucide-react";
import { PortableText, type PortableTextComponents } from "next-sanity";

import type { PostHeading } from "@/config/blog";
import type { PostBodyImage, PostBodyItem, PostCallout } from "@/sanity/lib/posts";

const CALLOUTS = {
  tip: { label: "Tip", Icon: Lightbulb },
  note: { label: "Note", Icon: Info },
  warning: { label: "Warning", Icon: AlertTriangle },
} as const;

/**
 * A post body from Sanity, in the blog's style. Covers what the post schema
 * allows: paragraphs, numbered H2s with anchor links, bullet lists, bold,
 * italic, links, images with captions and callouts
 * (see src/sanity/schemaTypes/blockContentType.ts).
 *
 * `headings` comes from postHeadings(), the same list the table of
 * contents uses, so heading ids and contents links always match.
 */
function buildComponents(headings: PostHeading[]): PortableTextComponents {
  const byKey = new Map(headings.map((h, i) => [h.key, { ...h, number: i + 1 }]));

  return {
    block: {
      normal: ({ children }) => (
        <p className="mt-6 text-[1.125rem] leading-[1.8] text-foreground/85 first:mt-0">
          {children}
        </p>
      ),
      h2: ({ children, value }) => {
        const heading = value._key ? byKey.get(value._key) : undefined;
        return (
          <h2
            id={heading?.id}
            className="group mt-14 flex scroll-mt-28 items-baseline gap-3 text-[clamp(1.6rem,2.6vw,2rem)] font-semibold leading-[1.15] tracking-[-0.03em] first:mt-0"
          >
            {heading && (
              <span aria-hidden="true" className="font-mono text-base font-medium text-foreground/30">
                {String(heading.number).padStart(2, "0")}
              </span>
            )}
            <span>
              {children}
              {heading && (
                <a
                  href={`#${heading.id}`}
                  aria-label={`Link to section: ${heading.text}`}
                  className="ml-2 inline-flex align-middle text-muted-foreground opacity-0 transition-opacity hover:text-brand-text focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Link2 aria-hidden="true" className="size-5" />
                </a>
              )}
            </span>
          </h2>
        );
      },
    },
    list: {
      bullet: ({ children }) => <ul className="mt-6 grid gap-3">{children}</ul>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex gap-3 text-[1.125rem] leading-[1.7] text-foreground/85">
          <span aria-hidden="true" className="mt-[0.7rem] size-2 shrink-0 rounded-full bg-brand-bright" />
          <span>{children}</span>
        </li>
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const href = typeof value?.href === "string" ? value.href : "";
        const className =
          "font-medium text-brand-text underline decoration-brand-text/40 underline-offset-4 transition-colors hover:decoration-brand-text";
        if (href.startsWith("/")) {
          return (
            <Link href={href} className={className}>
              {children}
            </Link>
          );
        }
        return (
          <a
            href={href}
            className={className}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: { value: PostBodyImage }) => (
        <figure className="my-10">
          <Image
            src={value.src}
            alt={value.alt}
            width={value.width}
            height={value.height}
            sizes="(min-width: 768px) 42rem, 100vw"
            placeholder={value.lqip ? "blur" : "empty"}
            blurDataURL={value.lqip}
            className="h-auto w-full rounded-card-lg bg-muted"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
      callout: ({ value }: { value: PostCallout }) => {
        const { label, Icon } = CALLOUTS[value.tone];
        const tone =
          value.tone === "warning"
            ? "border-amber-500/30 bg-amber-500/10"
            : value.tone === "tip"
              ? "border-brand/20 bg-brand/5"
              : "border-border bg-muted/60";
        return (
          <aside aria-label={label} className={`my-8 rounded-card border p-5 sm:p-6 ${tone}`}>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-brand-text">
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </p>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-foreground/90">{value.text}</p>
          </aside>
        );
      },
    },
  };
}

export function PostBody({
  value,
  headings,
}: {
  value: PostBodyItem[];
  headings: PostHeading[];
}) {
  return <PortableText value={value} components={buildComponents(headings)} />;
}
