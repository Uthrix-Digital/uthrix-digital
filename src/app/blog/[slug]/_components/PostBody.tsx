import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";

/**
 * A post body from Sanity, styled as the blog has always looked. Covers
 * what the post schema allows: paragraphs, H2, bullet lists, bold, italic
 * and links (see src/sanity/schemaTypes/blockContentType.ts).
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 text-lg leading-relaxed text-foreground/85 first:mt-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 text-2xl font-semibold leading-tight tracking-[-0.03em] first:mt-0 sm:text-3xl">
        {children}
      </h2>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 grid gap-3">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-lg leading-relaxed text-foreground/85">
        <span
          aria-hidden="true"
          className="mt-3 size-2 shrink-0 rounded-full bg-brand-bright"
        />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const className =
        "font-medium text-brand-text underline underline-offset-4 hover:text-foreground";
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
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
