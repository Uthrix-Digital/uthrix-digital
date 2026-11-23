/**
 * Builds /llms.txt and /llms-full.txt (https://llmstxt.org): plain Markdown
 * summaries of the site for AI assistants and answer engines.
 *
 *  - llms.txt: who we are plus a short, linked index of the pages that matter.
 *  - llms-full.txt: the full text of those pages in one file, so an AI tool
 *    can read everything without rendering the site.
 *
 * Everything is read from the same config the pages render (like the sitemap),
 * so publishing a post, case study or service updates both files.
 */

import { NODES } from "@/app/growth-map/(GrowthPathMap)/data/nodes";
import { CURATED_BUNDLES } from "@/app/growth-map/(GrowthPathMap)/data/resolver";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  STAGES,
  STAGE_ORDER,
  audienceHref,
  stageHref,
} from "@/config/audiences";
import { BLOG_PATH, getPosts, postHref, topicLabel } from "@/config/blog";
import {
  CASE_STUDIES,
  CASE_STUDIES_PATH,
  caseStudyHref,
} from "@/config/caseStudies";
import {
  COMPANY_FACTS,
  COMPANY_PATH,
  MISSION,
  VALUES,
  VISION,
  WHY_POINTS,
} from "@/config/company";
import { SERVICE_PAGES, type ServiceId } from "@/config/servicePages";
import { siteConfig } from "@/config/siteConfig";
import { absoluteUrl } from "@/lib/schema";

const link = (title: string, path: string, note?: string) =>
  `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`);

/** Sections joined with blank lines; empty sections are dropped. */
const doc = (...sections: (string | string[] | false | undefined)[]) =>
  `${sections
    .filter(Boolean)
    .map((s) => (Array.isArray(s) ? s.join("\n") : s))
    .join("\n\n")}\n`;

function header() {
  return [
    `# ${siteConfig.companyName}`,
    `> ${siteConfig.description}`,
    [
      `${siteConfig.companyName} is a small digital team based in Sri Lanka that combines websites and software with digital marketing and automation, for clients in Sri Lanka and abroad. We specialise in three kinds of business: hospitality and travel, product sellers, and service businesses. Every engagement starts with a free 20-minute strategy call.`,
      "",
      `Mission: ${MISSION}`,
    ].join("\n"),
    ["## Key facts", "", ...COMPANY_FACTS.map((f) => `- ${f.label}: ${f.value}`)],
    ["## How we work", "", ...bullets(WHY_POINTS)],
  ];
}

/** /llms.txt */
export function buildLlmsTxt() {
  const posts = getPosts();

  return doc(
    ...header(),
    [
      "## Services",
      "",
      ...NODES.map((n) =>
        link(SERVICE_PAGES[n.id as ServiceId].metaTitle, n.route, n.summary),
      ),
    ],
    [
      "## Who we help",
      "",
      ...AUDIENCE_ORDER.map((id) =>
        link(AUDIENCES[id].label, audienceHref(id), AUDIENCES[id].summary),
      ),
      ...STAGE_ORDER.map((id) =>
        link(`${STAGES[id].label} (any business type)`, stageHref(id), STAGES[id].summary),
      ),
    ],
    [
      "## Growth paths (services that work well together)",
      "",
      link("Growth map", "/growth-map", "Pick services and see how they connect into one plan"),
      ...CURATED_BUNDLES.map((b) =>
        link(b.title, b.href, b.nodes.map((n) => n.label).join(" + ")),
      ),
    ],
    CASE_STUDIES.length > 0 && [
      "## Case studies",
      "",
      ...CASE_STUDIES.map((s) =>
        link(
          s.title,
          caseStudyHref(s.slug),
          `${s.summary} Results: ${s.results.map((r) => `${r.metric} ${r.value}`).join("; ")}`,
        ),
      ),
    ],
    posts.length > 0 && [
      "## Blog",
      "",
      ...posts.map((p) => link(p.title, postHref(p.slug), p.excerpt)),
    ],
    [
      "## Company and contact",
      "",
      link("Company", COMPANY_PATH, "Who we are, mission and values, why clients choose us"),
      link("Contact", "/contact", `Send an enquiry or email ${siteConfig.email}`),
      link("Book a call", "/book-a-call", "Free 20-minute strategy call"),
      link("Partners", "/partners", "Websites, software and marketing systems built for agencies and IT firms with more client work than developers"),
      link("Careers", "/careers"),
    ],
    [
      "## Optional",
      "",
      link("Full text of this site", "/llms-full.txt", "Every service, audience page and blog post in one Markdown file"),
      ...(CASE_STUDIES.length > 0 ? [link("All case studies", CASE_STUDIES_PATH)] : []),
      link("All blog posts", BLOG_PATH),
      link("Privacy policy", "/privacy"),
      link("Terms of use", "/terms"),
    ],
  );
}

/** /llms-full.txt */
export function buildLlmsFullTxt() {
  const posts = getPosts();
  const qa = (faqs: { question: string; answer: string }[]) =>
    faqs.flatMap((f) => [`**${f.question}**`, "", f.answer, ""]);

  const services = NODES.map((n) => {
    const s = SERVICE_PAGES[n.id as ServiceId];
    return [
      `## ${s.metaTitle}`,
      "",
      `URL: ${absoluteUrl(n.route)}`,
      "",
      n.summary,
      "",
      s.intro,
      "",
      "### Signs you need this",
      "",
      ...bullets(s.problems),
      "",
      "### What's included",
      "",
      ...s.deliverables.map((d) => `- **${d.title}**: ${d.description}`),
      "",
      "### How it works",
      "",
      ...s.process.map((p, i) => `${i + 1}. **${p.title}**: ${p.description}`),
      "",
      "### What changes",
      "",
      ...bullets(s.outcomes),
      "",
      "### FAQ",
      "",
      ...qa(s.faqs),
    ];
  });

  const audiences = AUDIENCE_ORDER.map((id) => {
    const a = AUDIENCES[id];
    return [
      `## ${a.label}`,
      "",
      `URL: ${absoluteUrl(audienceHref(id))}`,
      "",
      `Includes: ${a.subTypes.join(", ")}.`,
      "",
      a.intro,
      "",
      ...STAGE_ORDER.flatMap((stage) => {
        const plan = a.stages[stage];
        return [
          `### ${STAGES[stage].label}`,
          "",
          "What owners say:",
          ...bullets(plan.pains),
          "",
          "What we do:",
          ...bullets(plan.whatWeDo),
          "",
          "What we measure:",
          ...bullets(plan.measure),
          "",
        ];
      }),
      "### FAQ",
      "",
      ...qa(a.faqs),
    ];
  });

  const caseStudies = CASE_STUDIES.map((s) => [
    `## ${s.title}`,
    "",
    `URL: ${absoluteUrl(caseStudyHref(s.slug))}`,
    `Client: ${s.client} (${s.industry})`,
    "",
    s.summary,
    "",
    `Challenge: ${s.challenge}`,
    "",
    `Solution: ${s.solution}`,
    "",
    "Results:",
    ...s.results.map((r) => `- ${r.metric}: ${r.value}`),
    "",
  ]);

  const blog = posts.map((p) => [
    `## ${p.title}`,
    "",
    `URL: ${absoluteUrl(postHref(p.slug))}`,
    `Published: ${p.publishedAt}${p.updatedAt ? ` (updated ${p.updatedAt})` : ""} · Topic: ${topicLabel(p.topic)}`,
    "",
    ...p.body.flatMap((block) =>
      block.type === "h2"
        ? [`### ${block.text}`, ""]
        : block.type === "ul"
          ? [...bullets(block.items), ""]
          : [block.text, ""],
    ),
  ]);

  return doc(
    ...header(),
    [
      "## Company",
      "",
      `Vision: ${VISION}`,
      "",
      "Values:",
      ...VALUES.map((v) => `- **${v.title}**: ${v.description}`),
    ],
    ["# Services", "", ...services.flat()],
    ["# Who we help", "", ...audiences.flat()],
    caseStudies.length > 0 && ["# Case studies", "", ...caseStudies.flat()],
    blog.length > 0 && ["# Blog", "", ...blog.flat()],
    [
      "# Contact",
      "",
      `- Email: ${siteConfig.email}`,
      `- Enquiry form: ${absoluteUrl("/contact")}`,
      `- Free 20-minute call: ${absoluteUrl("/book-a-call")}`,
    ],
  );
}
