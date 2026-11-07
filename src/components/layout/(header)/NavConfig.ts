import { NODES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/nodes";
import { CURATED_BUNDLES } from "@/app/ConnetMainDots/(GrowthPathMap)/data/resolver";

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
};

export type NavMenu = {
  id: string;
  label: string;
  /** Small mono label above the detail column. */
  eyebrow: string;
  title: string;
  description: string;
  items: NavItem[];
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
      "A business owner, a founder, a team with a system to fix, or an agency with more work than developers. Each has its own offer.",
    items: [
      {
        label: "For startups",
        href: "for/startups",
        description:
          "You have the idea and people waiting for it, but no technical team to build it.",
      },
      {
        label: "For business owners",
        href: "for/business-owners",
        description:
          "Orders, stock and bookings live in spreadsheets, notebooks and WhatsApp, and things slip through.",
      },
      {
        label: "For systems that need fixing",
        href: "for/fix-my-system",
        description: "Your developer left, the system keeps breaking, and nobody knows how it works.",
      },
      {
        label: "For agencies and IT firms",
        href: "for/partners",
        description: "You've won the client work, but your team doesn't have the time or the skills to build it.",
      },
    ],
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
        label: "Contact",
        href: "/ContactUs",
        description:
          "Tell us about your project and we'll get back to you with next steps.",
      },
    ],
  },
];

export const navCta = {
  label: "Start a project",
  shortLabel: "Let's talk",
  href: "/#contact",
};
