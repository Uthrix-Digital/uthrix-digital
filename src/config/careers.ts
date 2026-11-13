/**
 * Careers page content (/careers) and the options of its application form.
 *
 * ── Posting a role ─────────────────────────────────────────────────────────
 * Add one object to `ROLES`. It appears under "Open roles" with an Apply
 * button that pre-selects it in the form, and in the form's role list. While
 * `ROLES` is empty, the page shows "no open roles" and the open application.
 */

export type CareerAreaId = "marketing" | "design" | "development" | "other";

export const CAREER_AREAS: { value: CareerAreaId; label: string }[] = [
  { value: "marketing", label: "Marketing (ads, SEO, content)" },
  { value: "design", label: "Design and brand" },
  { value: "development", label: "Development (web and software)" },
  { value: "other", label: "Something else" },
];

export interface Role {
  /** Unique, used as the form value. */
  id: string;
  title: string;
  area: CareerAreaId;
  /** e.g. "Full-time", "Part-time", "Internship". */
  type: string;
  /** e.g. "Colombo", "Remote (Sri Lanka)". */
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export const ROLES: Role[] = [];

/** Value used when someone applies without a specific role. */
export const GENERAL_APPLICATION = "general";

export const REASONS = [
  {
    title: "Small team, real ownership",
    description:
      "You work on whole projects with the people who plan, design and build them, not on a slice of someone else's.",
  },
  {
    title: "Marketing and software under one roof",
    description:
      "Strategy, design, ads and development sit in one team, so you learn how the pieces fit together.",
  },
  {
    title: "Work that's measured",
    description:
      "We report enquiries, bookings and orders, so you see what your work actually changed.",
  },
  {
    title: "Honest feedback",
    description:
      "Clear expectations, plain talk and room to say when something isn't working.",
  },
] as const;

export const LOOKING_FOR = [
  "You explain things plainly and like to leave a client better informed.",
  "You care how the work performs, not only how it looks.",
  "You are curious and keep learning new tools and methods.",
  "You take ownership, and say so early when something is going off track.",
] as const;

export const HIRING_STEPS = [
  {
    title: "Apply",
    description:
      "Send the short form below with a link to your work, a profile or a CV.",
  },
  {
    title: "Intro call",
    description: "A relaxed 20-minute chat about you, the role and how we work.",
  },
  {
    title: "Practical task",
    description:
      "A small task related to the role, so you can show how you think.",
  },
  {
    title: "Meet the team",
    description: "A final conversation, then a clear answer from us either way.",
  },
] as const;
