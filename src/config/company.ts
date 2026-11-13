/**
 * Company page content (/Company). Every section of the page, and the About
 * menu entries that jump to them, read from here.
 *
 * Section ids double as URL hashes: /Company#team, /Company#mission, ...
 */

import { siteConfig } from "@/config/siteConfig";

export const COMPANY_PATH = "/Company";

export const COMPANY_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "team", label: "Team" },
  { id: "mission", label: "Mission & values" },
  { id: "why", label: "Why UthriX" },
] as const;

export type CompanySectionId = (typeof COMPANY_SECTIONS)[number]["id"];

export function companyHref(section?: CompanySectionId) {
  return section ? `${COMPANY_PATH}#${section}` : COMPANY_PATH;
}

export const PRINCIPLES = [
  {
    title: "One team, one plan",
    description:
      "Strategy, design, ads and software come from one small team, so nothing gets lost between agencies.",
  },
  {
    title: "Built around your goal",
    description:
      "Every engagement starts from what you want to change in your business, not from a template.",
  },
  {
    title: "Here after launch",
    description:
      "We report every month and keep improving the work, so it doesn't stop on handover.",
  },
] as const;

export const STATS = [
  { value: "7", label: "Services on one growth path" },
  { value: "3", label: "Business types we specialise in" },
  { value: "20 min", label: "Free strategy call to start" },
  { value: "1", label: "Plain-numbers report every month" },
] as const;

/** How the team is organised. People are listed in TEAM below. */
export const DISCIPLINES = [
  {
    title: "Strategy & growth",
    description:
      "Reviews where a business stands and decides the order of the next moves.",
  },
  {
    title: "Brand & content",
    description:
      "Brand identity, social media and the content that makes an offer easy to say yes to.",
  },
  {
    title: "Websites & software",
    description:
      "Fast, accessible sites and the business systems behind them, built to last.",
  },
  {
    title: "Ads, search & automation",
    description:
      "Meta and Google Ads, SEO and the follow-up that turns enquiries into customers.",
  },
] as const;

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Public photo path, e.g. "/assets/Images/team/name.jpg". Optional. */
  photo?: string;
  email?: string;
  links?: { label: string; href: string }[];
}

/**
 * People shown under "Leadership". Add one object per person and the card
 * appears on /Company#team. While the list is empty, the section shows the
 * disciplines above and a "talk to us" prompt instead.
 */
export const TEAM: TeamMember[] = [];

export const MISSION =
  "Help growing businesses in Sri Lanka and beyond get more customers, with marketing and software that work together and results they can measure.";

export const VISION =
  "Be the most trusted small digital team for businesses that want to grow without guesswork.";

export const VALUES = [
  {
    title: "Clarity first",
    description:
      "Scope, price and next steps are explained plainly and agreed before work starts.",
  },
  {
    title: "Honest advice",
    description:
      "We tell you what to fix first, even when it isn't our biggest project.",
  },
  {
    title: "Measured results",
    description:
      "We report enquiries, bookings and orders, not likes and impressions.",
  },
  {
    title: "Ownership",
    description:
      "We treat your business as if we have to live with the result long after launch.",
  },
] as const;

export const COMPANY_FACTS: { label: string; value: string; href?: string }[] = [
  { label: "Company", value: siteConfig.companyName },
  { label: "Based in", value: "Sri Lanka" },
  {
    label: "Works with",
    value: "Hospitality & travel, product sellers, service businesses",
  },
  {
    label: "Focus",
    value: "Websites & software, digital marketing, automation",
  },
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: "Phone", value: "+94 72 82 82 122", href: "tel:+94728282122" },
];

export const WHY_POINTS = [
  "Scope and price agreed in writing before we start",
  "You own your website, ad accounts and data",
  "Plain-language updates, never jargon",
  "A monthly report on enquiries, bookings and orders",
  "An NDA on request, before you share any details",
  "Support and improvements after launch",
] as const;
