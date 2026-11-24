import { buildLlmsTxt } from "@/lib/llms";

/**
 * Served at /llms.txt: a short Markdown guide to the site for AI assistants
 * and answer engines (https://llmstxt.org). Built from config at build time;
 * see src/lib/llms.ts.
 */
export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
