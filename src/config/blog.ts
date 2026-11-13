/**
 * Blog: the single source of truth for /blog and every /blog/<slug> page.
 *
 * ── Adding a post ──────────────────────────────────────────────────────────
 * Append one object to `POSTS`. The slug becomes the URL. `body` is a list of
 * simple blocks: a paragraph ("p"), a heading ("h2") or a bullet list ("ul").
 * Newest first is how the index sorts, so order here doesn't matter.
 *
 * `topic` ties a post to a "Who we help" page: it drives the filter and the
 * closing call to action. Use "general" for posts that fit everyone.
 */

import type { AudienceId } from "@/config/audiences";

export type PostTopic = AudienceId | "general";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  topic: PostTopic;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  body: PostBlock[];
}

export const BLOG_PATH = "/blog";

export const POST_TOPICS: { id: PostTopic; label: string }[] = [
  { id: "hospitality", label: "Hospitality & travel" },
  { id: "product-sellers", label: "Product sellers" },
  { id: "service-businesses", label: "Service businesses" },
  { id: "general", label: "Strategy" },
];

export function topicLabel(topic: PostTopic) {
  return POST_TOPICS.find((t) => t.id === topic)?.label ?? "Strategy";
}

export function postHref(slug: string) {
  return `${BLOG_PATH}/${slug}`;
}

export const POSTS: Post[] = [
  {
    slug: "more-direct-bookings-without-leaving-ota",
    title: "How to get more direct bookings without leaving Booking.com",
    excerpt:
      "Booking sites bring guests, but every booking costs commission. Here is a practical way to grow your direct share one step at a time.",
    topic: "hospitality",
    publishedAt: "2026-11-12",
    body: [
      {
        type: "p",
        text: "Most hotels, villas and guest houses don't want to leave Booking.com. It brings guests you wouldn't otherwise reach. The problem is when it becomes the only way guests find you, because then you pay commission on every single booking, including guests who would have booked direct if they had known how.",
      },
      {
        type: "p",
        text: "The aim isn't to replace booking sites. It is to grow your direct share steadily, so each month a little more of your income stays with you.",
      },
      { type: "h2", text: "1. Own your Google presence" },
      {
        type: "p",
        text: "Many guests check Google Maps before they book anywhere. A complete Google Business Profile, with current photos, correct rates or a price range, opening details and a working link to book or enquire, is the cheapest way to appear when someone searches for your place by name.",
      },
      { type: "h2", text: "2. Give direct booking a reason" },
      {
        type: "p",
        text: "A guest will only leave the booking site if booking direct is easy and offers something extra. Make the benefit visible on your website:",
      },
      {
        type: "ul",
        items: [
          "A small perk for booking direct, such as a late checkout, breakfast or a welcome drink.",
          "Clear rooms, rates and real photos on the page, so guests don't need to go elsewhere to compare.",
          "A booking or enquiry button on every page, including WhatsApp for guests who prefer to ask first.",
        ],
      },
      { type: "h2", text: "3. Make the website fast on a phone" },
      {
        type: "p",
        text: "Most guests look at you on a phone, often on mobile data. If the site is slow or the booking form is hard to use, they go back to the booking site and you pay commission anyway. Test your own site on your phone, on mobile data, and fix whatever annoys you first.",
      },
      { type: "h2", text: "4. Bring past guests back" },
      {
        type: "p",
        text: "A past guest is your cheapest booking. Collect an email address or WhatsApp number at check-in, and send a short, friendly message before the next holiday season with a direct-booking offer. This one habit often beats paid advertising.",
      },
      { type: "h2", text: "5. Measure your direct share" },
      {
        type: "p",
        text: "Each month, note how many bookings came direct and how many came from booking sites. You can't improve a number you don't track. When the direct share goes up, you will see it in the commission you no longer pay.",
      },
    ],
  },
  {
    slug: "boosted-posts-vs-real-ads",
    title: "Boosted posts vs real ads: why likes don't pay the bills",
    excerpt:
      "If you boost posts but sales don't follow, the post isn't always the problem. Here's what separates reach from orders.",
    topic: "product-sellers",
    publishedAt: "2026-11-05",
    body: [
      {
        type: "p",
        text: "Boosting a post is easy: one button, a small budget, and your product is in front of more people. The trouble is that a boost is built to get attention, not orders. Plenty of sellers watch likes and comments climb while their order count stays flat.",
      },
      { type: "h2", text: "Reach is not the same as intent" },
      {
        type: "p",
        text: "A boosted post shows your product to people who tend to react to posts. A proper ad campaign lets you aim at people who are likely to buy, send them to a page built to take the order, and learn from what happens next. The difference is the goal you tell the platform to chase.",
      },
      { type: "h2", text: "Make the offer clear before you spend" },
      {
        type: "p",
        text: "If people comment \"price?\" and disappear, the post is missing something. Put the price, what's included and how to order right in the post or on the page it links to. Money spent on a confusing offer is simply spent.",
      },
      { type: "h2", text: "Track which ad actually sells" },
      {
        type: "ul",
        items: [
          "Set up tracking so you can see orders, not only clicks.",
          "Compare cost per order between products, not just total spend.",
          "Switch off what doesn't sell and put its budget behind what does.",
        ],
      },
      { type: "h2", text: "Tackle cash-on-delivery returns" },
      {
        type: "p",
        text: "Returns and cancellations quietly eat profit. A short confirmation step after the order, by message or call, filters out accidental and unserious orders before they ship. Report your return rate next to your sales, because an order that comes back isn't a sale.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Pick your best-selling product, write one clear offer, send it to one simple order page and track the result for two weeks. You will learn more from that than from boosting ten posts.",
      },
    ],
  },
  {
    slug: "five-follow-up-habits-for-service-businesses",
    title: "Five follow-up habits that stop enquiries going cold",
    excerpt:
      "Most lost customers weren't lost to a competitor. They were lost to a slow reply. These five habits fix that.",
    topic: "service-businesses",
    publishedAt: "2026-10-29",
    body: [
      {
        type: "p",
        text: "A customer who sends an enquiry is usually sending the same message to two or three businesses. The one that replies first, clearly and helpfully, often wins. For clinics, salons, real estate agents, educators and consultants, follow-up is where most revenue quietly leaks.",
      },
      { type: "h2", text: "1. Reply fast, even if it's short" },
      {
        type: "p",
        text: "A quick \"Thanks, we'll come back to you by 3 pm with details\" keeps a customer warm while you prepare a full answer. Decide on a target reply time and stick to it.",
      },
      { type: "h2", text: "2. Keep every enquiry in one place" },
      {
        type: "p",
        text: "Enquiries arriving through WhatsApp, email, Instagram and calls get lost when each channel is checked separately. One inbox or a simple list, where every enquiry gets logged with a name and date, means nothing slips through.",
      },
      { type: "h2", text: "3. Save the answers you repeat" },
      {
        type: "p",
        text: "If you answer the same questions all day, write the best answer once and reuse it: prices, opening hours, what to bring, how booking works. You save time and every customer gets a clear, consistent reply.",
      },
      { type: "h2", text: "4. Remind people before appointments" },
      {
        type: "p",
        text: "No-shows are expensive. A reminder message a day before, with an easy way to confirm or reschedule, noticeably reduces empty slots. It's one of the simplest automations to set up.",
      },
      { type: "h2", text: "5. Follow up once more" },
      {
        type: "p",
        text: "If someone went quiet after the price, a polite check-in a few days later is welcome more often than not. Track where each lead stands, so you know who needs a nudge.",
      },
      {
        type: "p",
        text: "Habits like these are what a simple CRM and a bit of automation do for you, so follow-up doesn't depend on anyone remembering.",
      },
    ],
  },
  {
    slug: "website-ads-or-seo-what-first",
    title: "Website, ads or SEO: what should come first?",
    excerpt:
      "Spending on the wrong thing first is the most common and most expensive mistake. Here's a simple order based on where you are.",
    topic: "general",
    publishedAt: "2026-10-22",
    body: [
      {
        type: "p",
        text: "Almost every business we talk to asks the same question: should we build a website, run ads or work on SEO? The honest answer is that it depends on where you are, and that the order matters more than the budget.",
      },
      { type: "h2", text: "If you're starting out" },
      {
        type: "p",
        text: "Begin with a clear offer and a credible home: a simple brand and a website that says what you do, who it's for and how to get in touch. Ads sent to a weak page waste money, and SEO takes time to compound, so the foundation comes first.",
      },
      { type: "h2", text: "If you're online but stuck" },
      {
        type: "p",
        text: "You already have a site, so look at what happens to the visitors you get. If people visit and don't enquire, fix the page and the offer before buying more traffic. Once the page converts, ads bring leads quickly, and SEO builds the steady flow behind them.",
      },
      { type: "h2", text: "If you're busy and growing" },
      {
        type: "p",
        text: "Here the bottleneck is usually follow-up. More traffic into a leaky process just creates more missed enquiries. Put an enquiry inbox, templates, reminders and tracking in place first, then scale what's working.",
      },
      { type: "h2", text: "Why we think in connected steps" },
      {
        type: "p",
        text: "Each service feeds the next: strategy shapes the brand, the brand shapes the site, the site makes ads and search work harder, and follow-up turns the enquiries into customers. You can start with one, and add the rest as you're ready. If you're not sure which one is yours, plan your growth path or book a short call and we'll tell you honestly.",
      },
    ],
  },
];

/** Posts, newest first. */
export function getPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

/** Up to `count` other posts, same topic first. */
export function getRelatedPosts(post: Post, count = 2): Post[] {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  return [
    ...others.filter((p) => p.topic === post.topic),
    ...others.filter((p) => p.topic !== post.topic),
  ].slice(0, count);
}

const WORDS_PER_MINUTE = 200;

export function readingMinutes(post: Post): number {
  const words = post.body
    .map((block) =>
      block.type === "ul" ? block.items.join(" ") : block.text,
    )
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "12 Nov 2026" — fixed locale and zone so server and client agree. */
export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
