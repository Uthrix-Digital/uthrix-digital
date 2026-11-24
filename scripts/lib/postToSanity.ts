/**
 * Converts a post from scripts/data/postsBeforeSanity.ts into the shape
 * of the Sanity `post` document (see src/sanity/schemaTypes/postType.ts).
 *
 * Pure functions with no Sanity client, so they can be tested on their own.
 */

import type { Post, PostBlock } from "../data/postsBeforeSanity";

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h2";
  markDefs: never[];
  children: Span[];
  listItem?: "bullet";
  level?: number;
}

/** Fields of a `post` document, apart from `_id` and `author`. */
export interface PostFields {
  _type: "post";
  title: string;
  slug: { _type: "slug"; current: string };
  excerpt: string;
  topic: string;
  publishedAt: string;
  updatedAt?: string;
  body: PortableTextBlock[];
}

function textBlock(
  key: string,
  text: string,
  extra: Pick<PortableTextBlock, "style"> &
    Partial<Pick<PortableTextBlock, "listItem" | "level">>,
): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
    ...extra,
  };
}

/**
 * "p" → normal block, "h2" → h2 block, "ul" → one bullet block per item.
 * Keys come from the position in the body, so a re-run produces the same
 * keys and the import doesn't show every block as changed.
 */
export function toPortableText(body: PostBlock[]): PortableTextBlock[] {
  return body.flatMap((block, i): PortableTextBlock[] => {
    const key = `b${i}`;
    switch (block.type) {
      case "p":
        return [textBlock(key, block.text, { style: "normal" })];
      case "h2":
        return [textBlock(key, block.text, { style: "h2" })];
      case "ul":
        return block.items.map((item, j) =>
          textBlock(`${key}i${j}`, item, {
            style: "normal",
            listItem: "bullet",
            level: 1,
          }),
        );
    }
  });
}

export function toPostFields(post: Post): PostFields {
  return {
    _type: "post",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    excerpt: post.excerpt,
    topic: post.topic,
    publishedAt: post.publishedAt,
    ...(post.updatedAt ? { updatedAt: post.updatedAt } : {}),
    body: toPortableText(post.body),
  };
}
