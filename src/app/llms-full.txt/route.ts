import { buildLlmsFullTxt } from "@/lib/llms";

/**
 * Served at /llms-full.txt: the full text of the site's main pages in one
 * Markdown file, linked from /llms.txt. Built from config at build time;
 * see src/lib/llms.ts.
 */
export async function GET() {
  return new Response(await buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
