/**
 * Blog post topics, shared by the website and Sanity Studio.
 *
 * Kept in its own small file, with relative imports only, so the Studio
 * (built by the Sanity CLI, which doesn't know the `@/` alias) can import
 * it without pulling in the rest of the site config.
 *
 * `id` ties a post to a "Who we help" page; "general" fits everyone.
 */

import type { AudienceId } from "./audiences";

export type PostTopic = AudienceId | "general";

export const POST_TOPICS: { id: PostTopic; label: string }[] = [
  { id: "hospitality", label: "Hospitality & travel" },
  { id: "product-sellers", label: "Product sellers" },
  { id: "service-businesses", label: "Service businesses" },
  { id: "general", label: "Strategy" },
];
