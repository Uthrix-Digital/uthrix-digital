/**
 * "Who we help" content: three business types × three stages.
 *
 * Business type sets the vocabulary (bookings, orders or enquiries).
 * Stage sets the offer (set up, fix, or scale). Every page, menu, form option
 * and WhatsApp message on the site reads from here, so the structure lives in
 * one place.
 */

export type StageId = "starting" | "stuck" | "growing";
export type AudienceId = "hospitality" | "product-sellers" | "service-businesses";

export interface StageDef {
  id: StageId;
  label: string;
  /** One line for menus and selectors. */
  summary: string;
  /** What the stage looks like, across business types. */
  description: string;
  /** The offer in one line. */
  offer: string;
  /** Pain points that apply to every business type at this stage. */
  commonPains: string[];
}

export const STAGES: Record<StageId, StageDef> = {
  starting: {
    id: "starting",
    label: "Starting out",
    summary: "No website, or a presence you're embarrassed by.",
    description:
      "You have a business (or are about to), but customers can't find you or can't tell if you're credible. The job here is to set up a proper foundation.",
    offer: "Set up",
    commonPains: [
      "\"I don't have a website yet.\"",
      "\"What we have online looks old or unfinished.\"",
      "\"New customers can't tell if we're legitimate.\"",
    ],
  },
  stuck: {
    id: "stuck",
    label: "Running but stuck",
    summary: "You're online, but enquiries or sales aren't coming.",
    description:
      "You have a site and a social page, and maybe you've tried ads. Money goes out, but not enough comes back, and it's unclear what is working. The job here is to fix the leaks and find what sells.",
    offer: "Fix",
    commonPains: [
      "\"We spend on ads and posts, but results are thin.\"",
      "\"People visit, but don't enquire or buy.\"",
      "\"I can't tell which part of our marketing works.\"",
    ],
  },
  growing: {
    id: "growing",
    label: "Growing, needs systems",
    summary: "Busy, but leads get lost and the work is manual.",
    description:
      "Demand is there, but enquiries slip through, follow-up is manual and the team spends its days on repetitive work. The job here is to build the systems that let you scale without hiring for every task. This is where our software skills give an edge most agencies don't have.",
    offer: "Scale",
    commonPains: [
      "\"Enquiries come from everywhere and some get missed.\"",
      "\"We do the same manual tasks every day.\"",
      "\"Past customers never come back.\"",
    ],
  },
};

export const STAGE_ORDER: StageId[] = ["starting", "stuck", "growing"];

export interface StagePlan {
  /** What the owner is thinking, in their words. */
  pains: string[];
  /** What UthriX does about it. */
  whatWeDo: string[];
  /** The numbers they will see improve. */
  measure: string[];
  /** Growth-path selection (bitmask from the growth-path map): 1 strategy,
   *  2 brand, 4 website, 8 social, 16 ads, 32 SEO, 64 follow-up. */
  pathMask: number;
  /** Starting-point package; adjust per client. */
  pack: "Website + Starter Boost" | "Growth Accelerator" | "Performance Pro + automation";
}

export interface AudienceDef {
  id: AudienceId;
  /** Full label for headings. */
  label: string;
  /** Short label for pills and breadcrumbs. */
  shortLabel: string;
  /** "Who this is" sub-types, listed small in menus and as chips on the page. */
  subTypes: string[];
  /** Menu description. */
  summary: string;
  /** The result this audience cares about, used in headings ("direct bookings"). */
  goal: string;
  metaDescription: string;
  headline: string;
  intro: string;
  stages: Record<StageId, StagePlan>;
  /** Extra pains for a sub-group that has its own concerns. */
  extra?: { title: string; body: string; points: string[] };
  /** What we show as proof for this type. Real case studies go here as they are won. */
  proof: { title: string; points: string[] };
  faqs: { question: string; answer: string }[];
}

export const AUDIENCES: Record<AudienceId, AudienceDef> = {
  hospitality: {
    id: "hospitality",
    label: "Hospitality & travel",
    shortLabel: "Hospitality",
    subTypes: ["Hotels", "Villas", "Guest houses", "Tour operators"],
    summary:
      "More direct bookings and enquiries, and less commission paid to booking sites.",
    goal: "direct bookings",
    metaDescription:
      "Websites, ads, SEO and automation for hotels, villas, guest houses and tour operators in Sri Lanka who want more direct bookings.",
    headline: "More direct bookings. Less commission.",
    intro:
      "Guests find you on Booking.com, and you pay for every one of them. We help hotels, villas, guest houses and tour operators get found directly, turn visits into enquiries, and keep guests coming back without paying the middleman each time.",
    stages: {
      starting: {
        pains: [
          "\"Guests only find us on Booking.com.\"",
          "\"Our photos and site look old.\"",
          "\"We don't show up on Google Maps.\"",
        ],
        whatWeDo: [
          "Brand identity that matches the stay you offer",
          "A website with direct booking or enquiry, built for phones",
          "Google Business Profile set up so you appear on Maps and in search",
        ],
        measure: ["Direct enquiries", "Google profile views"],
        pathMask: 2 | 4 | 32,
        pack: "Website + Starter Boost",
      },
      stuck: {
        pains: [
          "\"We pay heavy commission to OTAs on every booking.\"",
          "\"Off-season is empty.\"",
          "\"People visit the site but don't book.\"",
        ],
        whatWeDo: [
          "Meta and Google Ads aimed at guests who are ready to book",
          "SEO so you rank for the stays and trips you sell",
          "A faster site and a clearer booking flow, so visits turn into bookings",
        ],
        measure: [
          "Direct bookings",
          "Cost per booking",
          "Share of OTA vs direct",
        ],
        pathMask: 4 | 16 | 32,
        pack: "Growth Accelerator",
      },
      growing: {
        pains: [
          "\"Enquiries come from WhatsApp, email and Instagram, and some get missed.\"",
          "\"Quoting itineraries takes hours.\"",
          "\"Past guests never come back.\"",
        ],
        whatWeDo: [
          "One enquiry inbox that collects every channel",
          "Quote and itinerary templates that cut hours to minutes",
          "Re-booking messages to past guests at the right time",
        ],
        measure: ["Reply time", "Enquiry-to-booking rate", "Repeat guests"],
        pathMask: 4 | 64,
        pack: "Performance Pro + automation",
      },
    },
    extra: {
      title: "For tour operators",
      body: "Tour operators have a few extra pains. Foreign travellers plan months ahead and need reasons to trust a company they've never met. Many operators also depend on foreign agents and want more direct clients.",
      points: [
        "Trust signals up front: reviews, SLTDA registration, real photos of your guides and vehicles",
        "Itinerary pages that rank for what travellers search before they book",
        "A direct enquiry path that reduces dependence on foreign agents",
      ],
    },
    proof: {
      title: "What you'll see from us",
      points: [
        "A monthly report that shows direct bookings, cost per booking and your OTA vs direct share in plain numbers",
        "Before-and-after pages of your booking flow, so you can see what changed and why",
        "Honest advice on what to fix first, even when that isn't the biggest project",
      ],
    },
    faqs: [
      {
        question: "Will this replace Booking.com or other OTAs?",
        answer:
          "No, and we wouldn't advise it. OTAs bring guests you wouldn't otherwise reach. The goal is to grow your direct share so each month you pay less commission, while keeping OTAs as one channel among several.",
      },
      {
        question: "Can you work with the booking system we already use?",
        answer:
          "Usually, yes. We look at what you have first. If it works, we build around it. If it's the thing holding you back, we'll say so and suggest an alternative.",
      },
      {
        question: "We're a small guest house. Is this too big for us?",
        answer:
          "Not at all. Small places often see the quickest gains, because a proper Google profile, a clean site and one enquiry path can change a lot. We scale the work to your size.",
      },
    ],
  },

  "product-sellers": {
    id: "product-sellers",
    label: "Product sellers",
    shortLabel: "Product sellers",
    subTypes: [
      "Online stores",
      "Facebook & Instagram sellers",
      "Shops & showrooms",
      "Furniture",
    ],
    summary:
      "More orders from the people you already reach, and fewer lost in the chat.",
    goal: "orders",
    metaDescription:
      "Brand, content, Meta Ads and order systems for online stores, Facebook and Instagram sellers, shops and showrooms in Sri Lanka.",
    headline: "More orders. Fewer \"price?\" comments.",
    intro:
      "You sell something people want, but orders get lost between comments, inboxes and spreadsheets. We help online stores, social sellers, shops and showrooms turn attention into orders, and orders into customers who come back.",
    stages: {
      starting: {
        pains: [
          "\"I only sell through my Facebook page.\"",
          "\"People comment 'price?' and disappear.\"",
          "\"My page looks like everyone else's.\"",
        ],
        whatWeDo: [
          "Brand identity that makes your products look worth the price",
          "Content that shows the product, the price and how to order",
          "A simple catalogue or store, so people can buy without asking",
        ],
        measure: ["Messages and orders per week"],
        pathMask: 2 | 4 | 8,
        pack: "Website + Starter Boost",
      },
      stuck: {
        pains: [
          "\"I boost posts but sales don't follow.\"",
          "\"Cash-on-delivery orders get returned or cancelled.\"",
          "\"I don't know which ads actually sell.\"",
        ],
        whatWeDo: [
          "Meta Ads with proper tracking, so you see which ads produce orders",
          "Product content built to sell, not just to look nice",
          "Landing pages that confirm the order and cut returns",
        ],
        measure: ["Orders", "Cost per order", "Return rate"],
        pathMask: 4 | 8 | 16,
        pack: "Growth Accelerator",
      },
      growing: {
        pains: [
          "\"Orders are spread across Messenger, WhatsApp and Instagram.\"",
          "\"I track everything in Excel.\"",
          "\"Customers buy once and never return.\"",
        ],
        whatWeDo: [
          "Order capture and a tracking dashboard, replacing the spreadsheet",
          "Automated follow-up, from order confirmation to delivery updates",
          "Repeat-buyer offers sent to the people most likely to reorder",
        ],
        measure: ["Orders handled per day", "Repeat purchase rate"],
        pathMask: 16 | 64,
        pack: "Performance Pro + automation",
      },
    },
    extra: {
      title: "For shops and showrooms",
      body: "If you have a physical showroom, the goal is not just online orders. It's people walking through the door and picking up the phone.",
      points: [
        "Google Maps and local search so people nearby find you first",
        "Showroom visit and call tracking, so you know what brings people in",
        "Product pages and photos that make people want to see the piece in person (especially for furniture)",
      ],
    },
    proof: {
      title: "What you'll see from us",
      points: [
        "Orders and cost per order tracked ad by ad, so you stop guessing which post sold",
        "Return and cancellation rates reported next to sales, because an order that comes back isn't a sale",
        "A plain monthly summary of what to keep doing, what to stop and what to try next",
      ],
    },
    faqs: [
      {
        question: "I only sell on Facebook. Do I really need a website?",
        answer:
          "Not necessarily on day one. A simple catalogue that shows products, prices and how to order often does more than a full store, and it's yours, not Facebook's. We start with what fits your stage.",
      },
      {
        question: "Can you help with cash-on-delivery returns?",
        answer:
          "Yes. Most returns trace back to unclear offers, missing confirmation and weak follow-up. We tighten the offer page and add an order confirmation step, which usually brings returns down.",
      },
      {
        question: "Will I need to change how I take orders?",
        answer:
          "Only if it helps. We connect the channels you already use first, so customers can keep messaging you while the order lands in one place.",
      },
    ],
  },

  "service-businesses": {
    id: "service-businesses",
    label: "Service businesses",
    shortLabel: "Service businesses",
    subTypes: [
      "Real estate",
      "Clinics",
      "Salons",
      "Education",
      "Consultants",
    ],
    summary:
      "More qualified enquiries, and a system that follows up on every one.",
    goal: "qualified enquiries",
    metaDescription:
      "Strategy, Google Ads, local SEO and booking systems for real estate, clinics, salons, education providers and consultants in Sri Lanka.",
    headline: "More qualified enquiries. Fewer no-shows.",
    intro:
      "Your work speaks for itself, but customers can't see it before they call. We help real estate agents, clinics, salons, education providers and consultants look credible, attract the right enquiries, and follow up before they go cold.",
    stages: {
      starting: {
        pains: [
          "\"Customers can't check if we're legit.\"",
          "\"I can't show my work properly.\"",
          "\"We get business only by word of mouth.\"",
        ],
        whatWeDo: [
          "Business strategy so you know who you're talking to and what you offer",
          "Brand identity that looks as professional as your work",
          "A website with work samples, reviews and a clear way to get in touch",
        ],
        measure: ["Enquiries", "Google profile calls"],
        pathMask: 1 | 2 | 4,
        pack: "Website + Starter Boost",
      },
      stuck: {
        pains: [
          "\"Facebook leads are low quality.\"",
          "\"People ask the price and vanish.\"",
          "\"Competitors rank above us on Google.\"",
        ],
        whatWeDo: [
          "Google Ads and local SEO, so people searching for you find you first",
          "A clearer offer and pricing page that filters out the wrong enquiries",
          "A lead qualification form, so you spend time on the right people",
        ],
        measure: ["Qualified leads", "Cost per lead"],
        pathMask: 4 | 16 | 32,
        pack: "Growth Accelerator",
      },
      growing: {
        pains: [
          "\"We forget to follow up.\"",
          "\"We answer the same questions all day.\"",
          "\"Appointment no-shows hurt.\"",
        ],
        whatWeDo: [
          "Follow-up and automation, so every enquiry gets a reply",
          "A booking and reminder system that cuts no-shows",
          "A simple CRM that shows where every lead stands",
        ],
        measure: ["Lead-to-client rate", "No-show rate", "Time saved"],
        pathMask: 4 | 64,
        pack: "Performance Pro + automation",
      },
    },
    proof: {
      title: "What you'll see from us",
      points: [
        "Lead quality reported with lead volume, so a cheap lead that never converts isn't counted as a win",
        "No-show and follow-up rates before and after the booking and reminder system",
        "A short monthly note on what's working and what we'd change next",
      ],
    },
    faqs: [
      {
        question: "I'm a one-person consultant. Is this for me?",
        answer:
          "Yes. A solo professional benefits a lot from credibility online and a system that follows up when you're busy with clients. We keep it light and proportionate.",
      },
      {
        question: "Can you handle sensitive client details, like in a clinic?",
        answer:
          "We design systems to collect only what you need and keep it in tools you control. We'll talk through what's appropriate for your field before we build anything.",
      },
      {
        question: "How is this different from just boosting posts?",
        answer:
          "Boosting buys reach. Service businesses need the right person to find you, trust you and get a reply quickly. We build that whole path, and we report on enquiries that turn into clients, not likes.",
      },
    ],
  },
};

export const AUDIENCE_ORDER: AudienceId[] = [
  "hospitality",
  "product-sellers",
  "service-businesses",
];

/** Select options shared by the enquiry form and the booking form. */
export const BUSINESS_TYPE_OPTIONS = [
  ...AUDIENCE_ORDER.map((id) => ({ value: id, label: AUDIENCES[id].label })),
  { value: "other", label: "Something else" },
];

export const STAGE_OPTIONS = STAGE_ORDER.map((id) => ({
  value: id,
  label: STAGES[id].label,
}));

export function isAudienceId(value: string): value is AudienceId {
  return value in AUDIENCES;
}

export function isStageId(value: string | null | undefined): value is StageId {
  return !!value && value in STAGES;
}

export function audienceHref(id: AudienceId, stage?: StageId): string {
  return stage ? `/for/${id}?stage=${stage}#stage` : `/for/${id}`;
}

export function stageHref(id: StageId): string {
  return `/for/stage/${id}`;
}
