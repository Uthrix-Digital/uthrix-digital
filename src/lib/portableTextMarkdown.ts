import type { PortableTextBlock } from "next-sanity";

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

/**
 * Portable Text (a post body from Sanity) as Markdown lines, for the
 * llms-full.txt file. Covers what the post schema allows: paragraphs, H2
 * (written as ### under the post's ## title), bullet lists, bold, italic
 * and links. `resolveHref` turns "/contact" into a full URL.
 */
export function portableTextToMarkdown(
  blocks: PortableTextBlock[],
  resolveHref: (href: string) => string = (href) => href,
): string[] {
  const lines: string[] = [];

  blocks.forEach((block, i) => {
    if (block._type !== "block") return;

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
      const next = blocks[i + 1];
      if (!next || !next.listItem) lines.push("");
    } else if (block.style === "h2") {
      lines.push(`### ${text}`, "");
    } else {
      lines.push(text, "");
    }
  });

  return lines;
}
