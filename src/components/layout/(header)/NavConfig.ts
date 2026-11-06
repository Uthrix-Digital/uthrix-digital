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
    title: "Everything your brand needs to grow.",
    description:
      "Pick one area or combine several. We tailor the scope to your goals and build it around measurable results.",
    items: [
      {
        label: "Brand identity",
        href: "/BrandIdentity",
        description:
          "A distinctive visual identity that reflects your values and connects with the right audience.",
      },
      {
        label: "Social & content",
        href: "/SocialContent",
        description:
          "A clear content direction, from planning and production to publishing and ongoing improvement.",
      },
      {
        label: "Websites",
        href: "/Website",
        description:
          "Websites and landing pages that are responsive, accessible and built to perform.",
      },
      {
        label: "Meta + Google Ads",
        href: "/MetaGoogleAds",
        description:
          "Campaigns, messaging, testing and optimization that keep improving over time.",
      },
      {
        label: "SEO",
        href: "/Seo",
        description:
          "Content and optimization that help your offer get found by the people searching for it.",
      },
    ],
  },
  {
    id: "growth",
    label: "How we grow you",
    eyebrow: "Growth",
    title: "Start from where you are.",
    description:
      "An idea, a business that has stalled, or a team buried in manual work. Each starting point has its own path.",
    items: [
      {
        label: "Business idea",
        href: "/BusinessIdea",
        description:
          "Clarify the offer, the priorities and the action plan before you spend on anything else.",
      },
      {
        label: "Follow-up & automation",
        href: "/FollowUp",
        description:
          "Structured follow-up, reminders and automations that keep leads and your team moving.",
      },
      {
        label: "Plan your growth path",
        href: "/ConnetMainDots",
        description:
          "Connect the services you need into one growth path built around a single business goal.",
      },
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
