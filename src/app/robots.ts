import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

/**
 * Served at /robots.txt. It controls what crawlers may *fetch*, not what gets
 * indexed. To keep a page out of search results, mark it noindex in its
 * metadata and leave it crawlable here, or Google never sees the noindex.
 *
 * Kept crawlable on purpose:
 *  - /_next/*: the CSS and JS Google needs to render pages properly.
 *  - /growth-path/...?selection=: noindex pages; blocking them here would
 *    hide that tag and could get them indexed without a description.
 */
export default function robots(): MetadataRoute.Robots {
  // Vercel preview deployments: keep the whole copy out of search results.
  // Only an explicit "preview" blocks, so a missing variable can never
  // block the live site.
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      // Named AI crawlers get the same access as everyone else. "*" already
      // covers them; listing them makes the policy explicit, so a future
      // change to "*" can't shut them out by accident. A bot that matches a
      // named group ignores "*", so each group repeats the /api/ rule.
      { userAgent: [...AI_CRAWLERS], allow: "/", disallow: "/api/" },
      {
        userAgent: "*",
        allow: "/",
        // Form endpoints (inquiry, booking, applications), not pages.
        disallow: "/api/",
      },
    ],
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}

/**
 * AI crawlers and AI-use tokens we allow, both for live answers/search and for
 * model training: being in the models' knowledge helps an agency get named.
 * To opt out of training only, move GPTBot, ClaudeBot, Google-Extended,
 * Applebot-Extended, CCBot and Meta-ExternalAgent to a `disallow: "/"` group.
 */
const AI_CRAWLERS = [
  // OpenAI: ChatGPT search, user-triggered fetches, training
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic: Claude search, user-triggered fetches, training
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / AI training (token, not a separate crawler)
  "Google-Extended",
  // Apple Intelligence (token)
  "Applebot-Extended",
  // Microsoft Copilot uses Bingbot (covered by "*"); others:
  "Amazonbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  // Common Crawl: a source for many open models
  "CCBot",
] as const;
