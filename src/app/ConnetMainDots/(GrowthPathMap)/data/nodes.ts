import type { NodeDef } from "../types";

/**
 * Ring radii in SVG units (centre = 248,248).
 * Derived from uthrix-growth-nodes.json phase rings, scaled to fit a 496×496 viewBox.
 * JSON values: foundation=115, build=190, grow=265, retain=335 → scale ≈ 0.62
 */
export const RING_RADII = {
  foundation:  72,
  build:      118,
  grow:       164,
  retain:     208,
} as const;

/**
 * Seven service nodes.
 *
 * Angles (clockwise from north) are adapted from the JSON angle values.
 * JSON uses a −125 → +195 range (anti-clockwise from east); converted:
 *   svgAngle = 90 − jsonAngle   (maps east=0° → north=0°, flips direction)
 *
 * svgLabel splits are chosen so each line ≤ 12 chars for easy reading in the SVG.
 */
export const NODES: readonly NodeDef[] = [
  {
    bit: 1,
    id: "idea",
    label: "Business Idea",
    svgLabel: ["Business Idea"],
    angle: 215,          // JSON −125 → 90−(−125) = 215°  (lower-left)
    ringR: RING_RADII.foundation,
    phase: "foundation",
    why: "A registered name is something you can brand.",
    summary:
      "Generating a business idea is a simple process of finding a real problem that people face and figuring out an easy way to solve it.",
  },
  {
    bit: 2,
    id: "brand",
    label: "Brand Identity",
    svgLabel: ["Brand", "Identity"],
    angle: 160,          // JSON −70 → 90−(−70) = 160°  (lower-right area)
    ringR: RING_RADII.foundation,
    phase: "foundation",
    why: "The brand sets the look every page uses.",
    summary:
      "Logo, colours, typography and voice guidelines every other service inherits.",
  },
  {
    bit: 4,
    id: "website",
    label: "Website",
    svgLabel: ["Website"],
    angle: 105,          // JSON −15 → 90−(−15) = 105°  (right side)
    ringR: RING_RADII.build,
    phase: "build",
    why: "The site gives every post and ad somewhere to send people.",
    summary:
      "A fast, mobile-first site that turns visits into enquiries; the home base all traffic lands on.",
  },
  {
    bit: 8,
    id: "social",
    label: "Social & Content",
    svgLabel: ["Social &", "Content"],
    angle: 50,           // JSON 40 → 90−40 = 50°  (upper-right)
    ringR: RING_RADII.build,
    phase: "build",
    why: "Organic posts show which messages win before ad money is spent.",
    summary:
      "Profiles, content system and branded creatives, published consistently on the platforms your customers use.",
  },
  {
    bit: 16,
    id: "ads",
    label: "Meta + Google Ads",
    svgLabel: ["Meta +", "Google Ads"],
    angle: 340,          // JSON 95 → 90−95 = −5 → 355°  (near top)
    ringR: RING_RADII.grow,
    phase: "grow",
    why: "Ad data shows what people actually search for.",
    summary:
      "Paid campaigns that reach the right people now; ad budgets are paid separately to the platforms.",
  },
  {
    bit: 32,
    id: "seo",
    label: "SEO",
    svgLabel: ["SEO, AEO, GEO"],
    angle: 305,          // JSON 145 → 90−145 = −55 → 305°  (upper-left)
    ringR: RING_RADII.grow,
    phase: "grow",
    why: "Search visitors expect fast replies.",
    summary:
      "Local and on-page SEO that brings free, compounding traffic over time.",
  },
  {
    bit: 64,
    id: "followup",
    label: "Follow-up",
    svgLabel: ["Follow-up"],
    angle: 190,          // JSON 195 → 90−195 = −105 → 255°  (left)
    ringR: RING_RADII.retain,
    phase: "retain",
    why: "Repeat customers and referrals restart the cycle.",
    summary:
      "WhatsApp replies, reminders and reporting that turn enquiries into customers and customers into repeat business.",
  },
] as const;
