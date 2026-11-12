import { NODES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/nodes";
import { CURATED_BUNDLES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/resolver";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  STAGES,
  STAGE_ORDER,
  audienceHref,
  stageHref,
} from "@/config/audiences";
import {
  CASE_STUDIES_PATH,
  CASE_STUDY_CATEGORIES,
  CASE_STUDY_CATEGORY_ORDER,
  CASE_STUDY_GROUPS,
  caseStudyCategoryHref,
  caseStudyHref,
  getFeaturedCaseStudies,
} from "@/config/caseStudies";

/** Curated combinations promoted in the "How we grow you" menu. */
const FEATURED_BUNDLES = [
  "Look pro online",
  "Fast leads",
  "Found everywhere",
  "Zero to growing",
];

export type NavItem = {
  label: string;
  href: string;
  /** Shown in the mega-menu detail column while this link is hovered. */
  description: string;
  /** Small line under the link, e.g. the sub-types it covers. */
  sub?: string;
};

export type NavSecondary = {
  /** Small mono label above the list. */
  label: string;
  items: NavItem[];
};

export type NavFeatureCard = {
  title: string;
  /** Small line under the title, e.g. the client. */
  caption: string;
  href: string;
  image: { src: string; alt: string };
};

export type NavFeature = {
  /** Small mono label above the cards. */
  label: string;
  viewAll: { label: string; href: string };
  cards: NavFeatureCard[];
};

export type NavMenu = {
  id: string;
  label: string;
  /** Small mono label above the detail column. */
  eyebrow: string;
  title: string;
  description: string;
  items: NavItem[];
  /** A second, smaller list in the detail column (e.g. the stage selector). */
  secondary?: NavSecondary;
  /** Thumbnail cards in the detail column (e.g. featured case studies). */
  featured?: NavFeature;
  /** Render the social links under the detail column. */
  showSocials?: boolean;
};

export const navMenus: NavMenu[] = [
  {
    id: "forwhoom",
    label: "Who we help",
    eyebrow: "Who we help",
    title: "Start from where you are.",
    description:
      "Pick your kind of business to see the plan built for it, or start from where you are today and we'll ask about your business next.",
    items: AUDIENCE_ORDER.map((id) => ({
      label: AUDIENCES[id].label,
      href: audienceHref(id),
      description: AUDIENCES[id].summary,
      sub: AUDIENCES[id].subTypes.join(" · "),
    })),
    secondary: {
      label: "Where are you today?",
      items: STAGE_ORDER.map((id) => ({
        label: STAGES[id].label,
        href: stageHref(id),
        description: STAGES[id].summary,
      })),
    },
  },
  {
    id: "services",
    label: "What we do",
    eyebrow: "What we do",
    title: "Seven dots. One growth path.",
    description:
      "From a clear strategy to repeat customers. Pick one area or combine several; each service feeds the next.",
    items: NODES.map((node) => ({
      label: node.label,
      href: node.route,
      description: node.summary,
    })),
  },
  {
    id: "growth",
    label: "How we grow you",
    eyebrow: "Growth paths",
    title: "Connect the dots that fit your goal.",
    description:
      "Start with a ready-made combination or plan your own path around a single business goal.",
    items: [
      {
        label: "Plan your growth path",
        href: "/ConnetMainDots",
        description:
          "Connect the services you need into one growth path built around a single business goal.",
      },
      ...FEATURED_BUNDLES.flatMap((title) => {
        const bundle = CURATED_BUNDLES.find((b) => b.title === title);
        return bundle
          ? [
              {
                label: bundle.title,
                href: bundle.href,
                description: bundle.nodes.map((n) => n.label).join(" + "),
              },
            ]
          : [];
      }),
    ],
  },
  {
    id: "work",
    label: "Case studies",
    eyebrow: "Our work",
    title: "Real work. Measured results.",
    description:
      "See the problem, what we built and the numbers that changed. Browse everything or jump to marketing or development.",
    items: [
      {
        label: "All case studies",
        href: CASE_STUDIES_PATH,
        description:
          "Every project in one place, across marketing and development.",
      },
      ...CASE_STUDY_CATEGORY_ORDER.map((id) => ({
        label: CASE_STUDY_CATEGORIES[id].label,
        href: caseStudyCategoryHref(id),
        description: CASE_STUDY_CATEGORIES[id].summary,
        sub: CASE_STUDY_CATEGORIES[id].groups
          .map((group) => CASE_STUDY_GROUPS[group].label)
          .join(" · "),
      })),
    ],
    featured: {
      label: "Featured case studies",
      viewAll: { label: "View all case studies", href: CASE_STUDIES_PATH },
      cards: getFeaturedCaseStudies(3).map((study) => ({
        title: study.title,
        caption: study.client,
        href: caseStudyHref(study.slug),
        image: study.cover,
      })),
    },
  },
  {
    id: "company",
    label: "About",
    eyebrow: "About UthriX",
    title: "The people behind the growth.",
    description:
      "Meet the team, see how we work and find out why businesses choose UthriX Digital.",
    showSocials: true,
    items: [
      {
        label: "About us",
        href: "/AboutUs",
        description:
          "Who we are, what guides our work and the team that will build with you.",
      },
      {
        label: "Partners",
        href: "/partners",
        description:
          "For agencies and IT firms with more client work than developers.",
      },
      {
        label: "Contact",
        href: "/ContactUs",
        description:
          "Tell us about your project and we'll get back to you with next steps.",
      },
    ],
  },
];

export const navCta = {
  label: "Book a free 20-min call",
  shortLabel: "Book a call",
  href: "/BookACall",
};
