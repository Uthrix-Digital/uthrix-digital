import type { PortableTextBlock } from "next-sanity";

import type { PostBodyItem } from "@/sanity/lib/posts";

interface Span {
  _type: string;
  text?: string;
  marks?: string[];
}

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

const CALLOUT_LABELS = { tip: "Tip", note: "Note", warning: "Warning" } as const;

const isListItem = (item: PostBodyItem | undefined) =>
  item?._type === "block" && "listItem" in item && Boolean(item.listItem);

/**
 * A post body from Sanity as Markdown lines, for the llms-full.txt file.
 * Covers what the post schema allows: paragraphs, H2 (written as ### under
 * the post's ## title), bullet lists, bold, italic, links, images (as their
 * description and caption) and callouts (as quotes).
 * `resolveHref` turns "/contact" into a full URL.
 */
export function portableTextToMarkdown(
  items: PostBodyItem[],
  resolveHref: (href: string) => string = (href) => href,
): string[] {
  const lines: string[] = [];

  items.forEach((item, i) => {
    if (item._type === "callout" && "tone" in item) {
      lines.push(`> **${CALLOUT_LABELS[item.tone]}:** ${item.text}`, "");
      return;
    }
    if (item._type === "image" && "src" in item) {
      const description = [item.alt, item.caption].filter(Boolean).join(". ");
      if (description) lines.push(`*Image: ${description}*`, "");
      return;
    }
    if (item._type !== "block") return;
    const block = item as PortableTextBlock;

    const markDefs = (block.markDefs ?? []) as MarkDef[];
    const text = (block.children as Span[])
      .map((span) => {
        const text = span.text ?? "";
        if (!text.trim()) return text;
        // Keep surrounding spaces outside the markers: "**Book** ", not "**Book **".
        const [, before, core, after] = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
        let out = core;
        for (const mark of span.marks ?? []) {
          if (mark === "strong") out = `**${out}**`;
          else if (mark === "em") out = `*${out}*`;
          else {
            const href = markDefs.find((def) => def._key === mark)?.href;
            if (href) out = `[${out}](${resolveHref(href)})`;
          }
        }
        return `${before}${out}${after}`;
      })
      .join("");

    if (block.listItem) {
      lines.push(`- ${text}`);
      if (!isListItem(items[i + 1])) lines.push("");
    } else if (block.style === "h2") {
      lines.push(`### ${text}`, "");
    } else {
      lines.push(text, "");
    }
  });

  return lines;
}
