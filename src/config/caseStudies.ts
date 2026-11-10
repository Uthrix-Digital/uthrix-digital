/**
 * Case studies: the single source of truth for the listing page, each detail
 * page, the home teaser and the "Case studies" mega menu.
 *
 * ── Adding a case study ────────────────────────────────────────────────────
 * 1. Append one object to `CASE_STUDIES` below. Only the fields marked
 *    optional in `CaseStudy` can be left out; the page hides those sections.
 * 2. Pick a unique `slug`: it becomes the URL (`/case-studies/<slug>`).
 * 3. Set `featured: true` to show it in the navbar and on the home page.
 * 4. Images hosted on a new domain must be allowed in `next.config.ts`
 *    (`images.remotePatterns`). Local files go in `public/assets/Images/`.
 *
 * Nothing else needs touching: routes, filters, counts, metadata and
 * "next case study" links are all derived from this list. The order here is
 * the order on the site.
 *
 * ── Adding a category ──────────────────────────────────────────────────────
 * Add the id to `CaseStudyCategoryId`, describe it in `CASE_STUDY_CATEGORIES`
 * and place it in `CASE_STUDY_CATEGORY_ORDER`.
 */

export type CaseStudyCategoryId = "marketing" | "software" | "web" | "mobile";

export interface CaseStudyCategory {
  id: CaseStudyCategoryId;
  label: string;
  /** One line for menus and the filter. */
  summary: string;
}

export interface CaseStudyImage {
  src: string;
  alt: string;
}

export interface CaseStudyResult {
  /** The number itself, e.g. "+385%" or "Top 3". Keep it short. */
  value: string;
  /** What the number measures, e.g. "Qualified leads". */
  metric: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface CaseStudy {
  /** URL segment. Lowercase, hyphenated, unique. */
  slug: string;
  title: string;
  client: string;
  category: CaseStudyCategoryId;
  industry: string;
  /** One or two sentences for cards, menus and search engines. */
  summary: string;
  cover: CaseStudyImage;
  challenge: string;
  solution: string;
  /** What we actually built or ran, one short item each. */
  deliverables: string[];
  technologies: string[];
  /** Two to four headline numbers. The first one leads on cards. */
  results: CaseStudyResult[];
  /** Show in the navbar and on the home page. */
  featured?: boolean;
  /** Extra screenshots shown under the story. */
  gallery?: CaseStudyImage[];
  testimonial?: CaseStudyTestimonial;
  /** Public link to the finished work. */
  liveUrl?: string;
}

export const CASE_STUDY_CATEGORIES: Record<CaseStudyCategoryId, CaseStudyCategory> = {
  marketing: {
    id: "marketing",
    label: "Marketing",
    summary: "Campaigns, SEO and launches measured in leads and revenue.",
  },
  software: {
    id: "software",
    label: "Software",
    summary: "Custom platforms that replace disconnected tools and paperwork.",
  },
  web: {
    id: "web",
    label: "Web",
    summary: "Websites and portals rebuilt to load fast and convert.",
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    summary: "iOS and Android apps people open every day.",
  },
};

export const CASE_STUDY_CATEGORY_ORDER: CaseStudyCategoryId[] = [
  "marketing",
  "software",
  "web",
  "mobile",
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1600`;

export const CASE_STUDIES: CaseStudy[] = [
  // ── Marketing ────────────────────────────────────────────────────────────
  {
    slug: "b2b-saas-lead-generation",
    title: "B2B SaaS Lead Generation Campaign",
    client: "CloudTech Solutions",
    category: "marketing",
    industry: "B2B SaaS",
    summary:
      "A multi-channel campaign that turned a small budget into a steady flow of qualified leads.",
    cover: {
      src: unsplash("photo-1460925895917-afdab827c52f"),
      alt: "Marketing analytics dashboard on a laptop",
    },
    challenge:
      "SaaS startup struggled to generate qualified leads with limited budget and brand awareness in competitive market.",
    solution:
      "Implemented multi-channel strategy combining SEO, LinkedIn ads, content marketing, and marketing automation with lead scoring.",
    deliverables: [
      "SEO and content marketing plan",
      "LinkedIn and Google ad campaigns",
      "Marketing automation flows",
      "Lead scoring model",
    ],
    technologies: ["Google Ads", "LinkedIn Ads", "HubSpot", "SEMrush", "Google Analytics"],
    results: [
      { metric: "Qualified leads", value: "+385%" },
      { metric: "Cost per lead", value: "-62%" },
      { metric: "Conversion rate", value: "+147%" },
    ],
    featured: true,
  },
  {
    slug: "ecommerce-brand-awareness",
    title: "E-Commerce Brand Awareness Campaign",
    client: "EcoHome Products",
    category: "marketing",
    industry: "Sustainable retail",
    summary:
      "An integrated social, influencer and email campaign that put a new eco brand in front of its market.",
    cover: {
      src: unsplash("photo-1556742049-0cfed4f6a45d"),
      alt: "Customer paying at a shop counter",
    },
    challenge:
      "New sustainable products brand needed to build awareness and drive sales in crowded eco-friendly market.",
    solution:
      "Created integrated campaign with influencer partnerships, Instagram/Facebook ads, email marketing, and content strategy.",
    deliverables: [
      "Influencer partnership programme",
      "Instagram and Facebook ad campaigns",
      "Email marketing sequences",
      "Content strategy",
    ],
    technologies: ["Meta Ads", "Instagram", "Mailchimp", "Shopify", "Canva"],
    results: [
      { metric: "Brand awareness", value: "+520%" },
      { metric: "Social followers", value: "75K+" },
      { metric: "Revenue growth", value: "+290%" },
    ],
  },
  {
    slug: "local-dental-seo",
    title: "Local Service Business SEO",
    client: "Premier Dental Group",
    category: "marketing",
    industry: "Healthcare",
    summary:
      "Local SEO that took a dental practice from invisible to the top three results in its area.",
    cover: {
      src: unsplash("photo-1588776814546-1ffcf47267a5"),
      alt: "Dentist treating a patient",
    },
    challenge:
      "Dental practice invisible in local search results, losing patients to competitors despite excellent service quality.",
    solution:
      "Comprehensive local SEO strategy with Google Business optimization, review management, local citations, and content marketing.",
    deliverables: [
      "Google Business profile optimisation",
      "Review management process",
      "Local citation building",
      "Content marketing",
    ],
    technologies: ["Google Ads", "Google My Business", "WordPress", "Yoast SEO", "BrightLocal"],
    results: [
      { metric: "Local rankings", value: "Top 3" },
      { metric: "New patients", value: "+215%" },
      { metric: "Phone calls", value: "+340%" },
    ],
  },
  {
    slug: "product-launch-campaign",
    title: "Product Launch Campaign",
    client: "TechGear Innovations",
    category: "marketing",
    industry: "Consumer electronics",
    summary:
      "A multi-phase launch that built buzz and pre-orders before the product reached the shelf.",
    cover: {
      src: unsplash("photo-1519389950473-47ba0277781c"),
      alt: "Team working on laptops around a table",
    },
    challenge:
      "Electronics company launching flagship product needed buzz and pre-orders before launch date.",
    solution:
      "Multi-phase campaign with teaser content, influencer unboxing, paid social ads, email sequences, and launch event.",
    deliverables: [
      "Teaser content",
      "Influencer unboxing series",
      "Paid social campaigns",
      "Email sequences",
      "Launch event",
    ],
    technologies: ["Meta Ads", "Google Ads", "YouTube", "Mailchimp", "Analytics"],
    results: [
      { metric: "Pre-orders", value: "12,500" },
      { metric: "Social reach", value: "2.5M" },
      { metric: "Launch day sales", value: "$1.8M" },
    ],
  },

  // ── Software ─────────────────────────────────────────────────────────────
  {
    slug: "enterprise-resource-planning-system",
    title: "Enterprise Resource Planning System",
    client: "Global Manufacturing Corp",
    category: "software",
    industry: "Manufacturing",
    summary:
      "One ERP connecting inventory, HR, finance and operations across 15 departments.",
    cover: {
      src: unsplash("photo-1460925895917-afdab827c52f"),
      alt: "Operations dashboard with charts on a laptop",
    },
    challenge:
      "Client struggled with disconnected systems across 15 departments, leading to data silos, inefficient workflows, and delayed decision-making.",
    solution:
      "Developed a comprehensive ERP system integrating inventory, HR, finance, and operations with real-time analytics dashboard and automated workflows.",
    deliverables: [
      "Inventory, HR, finance and operations modules",
      "Real-time analytics dashboard",
      "Automated workflows",
    ],
    technologies: [".NET Core", "Angular", "SQL Server", "Azure", "Power BI"],
    results: [
      { metric: "Efficiency increase", value: "45%" },
      { metric: "Cost reduction", value: "$2.3M/year" },
      { metric: "Processing time", value: "-60%" },
    ],
  },
  {
    slug: "healthcare-management-platform",
    title: "Healthcare Management Platform",
    client: "MediCare Solutions",
    category: "software",
    industry: "Healthcare",
    summary:
      "A secure, HIPAA-compliant platform that replaced paper-based patient management for a hospital network.",
    cover: {
      src: unsplash("photo-1576091160399-112ba8d25d1d"),
      alt: "Doctor using a tablet",
    },
    challenge:
      "Hospital network needed HIPAA-compliant patient management system to replace outdated paper-based processes and improve patient care coordination.",
    solution:
      "Built secure cloud-based platform with patient records, appointment scheduling, telemedicine integration, and automated billing system.",
    deliverables: [
      "Patient records",
      "Appointment scheduling",
      "Telemedicine integration",
      "Automated billing",
    ],
    technologies: ["React", "Node.js", "MongoDB", "AWS", "HIPAA Compliance"],
    results: [
      { metric: "Patient satisfaction", value: "+38%" },
      { metric: "Admin time saved", value: "25 hrs/week" },
      { metric: "Appointment no-shows", value: "-42%" },
    ],
    featured: true,
  },

  // ── Web ──────────────────────────────────────────────────────────────────
  {
    slug: "ecommerce-platform-redesign",
    title: "E-Commerce Platform Redesign",
    client: "FashionHub Retail",
    category: "web",
    industry: "Fashion retail",
    summary:
      "A full redesign and faster checkout that reversed a 68% cart abandonment rate.",
    cover: {
      src: unsplash("photo-1460925895917-afdab827c52f"),
      alt: "Online store analytics on a laptop",
    },
    challenge:
      "Outdated website with poor mobile experience resulted in 68% cart abandonment rate and declining sales.",
    solution:
      "Complete redesign with modern UI/UX, optimized checkout flow, personalized recommendations, and progressive web app capabilities.",
    deliverables: [
      "New UI/UX design",
      "Optimised checkout flow",
      "Personalised recommendations",
      "Progressive web app",
    ],
    technologies: ["Next.js", "Shopify", "TailwindCSS", "Stripe", "Google Analytics"],
    results: [
      { metric: "Conversion rate", value: "+127%" },
      { metric: "Mobile sales", value: "+215%" },
      { metric: "Page load time", value: "-73%" },
    ],
  },
  {
    slug: "real-estate-listing-portal",
    title: "Real Estate Listing Portal",
    client: "PropertyPro Network",
    category: "web",
    industry: "Real estate",
    summary:
      "A listing portal with 3D tours, smarter search and built-in lead management for agents.",
    cover: {
      src: unsplash("photo-1560518883-ce09059eeffa"),
      alt: "Agent handing over house keys",
    },
    challenge:
      "Agents needed modern platform to showcase properties with virtual tours, advanced search, and lead management.",
    solution:
      "Developed feature-rich portal with 3D virtual tours, AI-powered search, CRM integration, and automated lead nurturing.",
    deliverables: [
      "3D virtual tours",
      "AI-powered search",
      "CRM integration",
      "Automated lead nurturing",
    ],
    technologies: ["React", "WordPress", "AWS", "Matterport API", "HubSpot"],
    results: [
      { metric: "Property views", value: "+340%" },
      { metric: "Lead quality", value: "+85%" },
      { metric: "Time on site", value: "+156%" },
    ],
  },

  // ── Mobile ───────────────────────────────────────────────────────────────
  {
    slug: "fitness-tracking-app",
    title: "Fitness Tracking App",
    client: "FitLife Technologies",
    category: "mobile",
    industry: "Health & fitness",
    summary:
      "A cross-platform fitness app with AI workout recommendations and wearable integration.",
    cover: {
      src: unsplash("photo-1461896836934-ffe607ba8211"),
      alt: "Runner on an athletics track",
    },
    challenge:
      "Client wanted to enter competitive fitness app market with unique AI-powered personal training features.",
    solution:
      "Created cross-platform mobile app with AI workout recommendations, nutrition tracking, social features, and wearable device integration.",
    deliverables: [
      "AI workout recommendations",
      "Nutrition tracking",
      "Social features",
      "Wearable device integration",
    ],
    technologies: ["Flutter", "Firebase", "TensorFlow", "HealthKit", "Google Fit"],
    results: [
      { metric: "Downloads (6 months)", value: "250K+" },
      { metric: "Daily active users", value: "45K" },
      { metric: "App Store rating", value: "4.8/5" },
    ],
    featured: true,
  },
  {
    slug: "food-delivery-platform",
    title: "Food Delivery Platform",
    client: "QuickBite Services",
    category: "mobile",
    industry: "Food & hospitality",
    summary:
      "Native delivery apps that let a local restaurant group compete with the big platforms.",
    cover: {
      src: unsplash("photo-1526367790999-0150786686a2"),
      alt: "Courier delivering a food order",
    },
    challenge:
      "Local restaurant consortium needed unified delivery platform to compete with major food delivery services.",
    solution:
      "Built native iOS/Android apps with real-time tracking, smart routing, in-app payments, and restaurant management dashboard.",
    deliverables: [
      "Native iOS and Android apps",
      "Real-time order tracking",
      "Smart routing",
      "In-app payments",
      "Restaurant management dashboard",
    ],
    technologies: ["Swift", "Kotlin", "Node.js", "MongoDB", "Google Maps API"],
    results: [
      { metric: "Partner restaurants", value: "500+" },
      { metric: "Monthly orders", value: "125K" },
      { metric: "Delivery time", value: "-28%" },
    ],
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

export const CASE_STUDIES_PATH = "/case-studies";

export const caseStudyHref = (slug: string) => `${CASE_STUDIES_PATH}/${slug}`;

export const caseStudyCategoryHref = (id: CaseStudyCategoryId) =>
  `${CASE_STUDIES_PATH}?category=${id}`;

export const isCaseStudyCategoryId = (
  value: string | null | undefined,
): value is CaseStudyCategoryId =>
  !!value && Object.hasOwn(CASE_STUDY_CATEGORIES, value);

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((study) => study.slug === slug);

/** Featured studies first-come; topped up with the rest if there are too few. */
export function getFeaturedCaseStudies(limit = 3): CaseStudy[] {
  const featured = CASE_STUDIES.filter((study) => study.featured);
  const rest = CASE_STUDIES.filter((study) => !study.featured);
  return [...featured, ...rest].slice(0, limit);
}

/** The study after this one in list order, wrapping at the end. */
export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = CASE_STUDIES.findIndex((study) => study.slug === slug);
  if (index === -1 || CASE_STUDIES.length < 2) return undefined;
  return CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
}
