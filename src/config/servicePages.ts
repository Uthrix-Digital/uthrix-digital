/**
 * Long-form content for each "What we do" service page.
 *
 * Keyed by the node `id` from the growth-path map
 * (`src/app/ConnetMainDots/(GrowthPathMap)/data/nodes.ts`). The map supplies
 * the shared facts (label, phase, route, summary, "why"); this file adds the
 * page-level story for each service.
 */

export type ServiceId =
  | "strategy"
  | "brand"
  | "website"
  | "social"
  | "ads"
  | "seo"
  | "followup";

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageContent {
  /** Short browser-tab and meta title. */
  metaTitle: string;
  /** Big hero line (rendered uppercase). */
  headline: string;
  intro: string;
  /** "Sounds familiar?" — the situations that bring people to this service. */
  problems: string[];
  /** What is included in the work. */
  deliverables: ServiceStep[];
  /** How the engagement runs, in order. */
  process: ServiceStep[];
  /** What changes for the business once it is done. */
  outcomes: string[];
  faqs: ServiceFaq[];
}

export const SERVICE_PAGES: Record<ServiceId, ServicePageContent> = {
  strategy: {
    metaTitle: "Business Strategy",
    headline: "Tell us about your business. We'll map the next moves.",
    intro:
      "You don't need a polished plan or a big idea to pitch. Tell us how your business works today, what's going well and what's holding it back. We review where you stand and come back with practical suggestions and a clear order to tackle them in.",
    problems: [
      "Sales have stalled and you're not sure what to change first.",
      "You're doing a bit of everything, but nothing feels connected.",
      "You're unsure whether to spend on a website, ads or something else.",
      "You're planning to grow, launch something new or move online and want a second opinion.",
    ],
    deliverables: [
      {
        title: "Business review",
        description:
          "How you sell today, who buys from you and where customers come from and drop off.",
      },
      {
        title: "Market & competitor check",
        description:
          "How competitors present themselves, what they charge and where you can stand out.",
      },
      {
        title: "Offer & positioning suggestions",
        description:
          "Ways to sharpen what you sell, who it's for and how you explain it in one sentence.",
      },
      {
        title: "Prioritised action plan",
        description:
          "Clear recommendations in order: what to fix now, what can wait and what to measure.",
      },
    ],
    process: [
      {
        title: "Tell us about your business",
        description:
          "A relaxed conversation about what you do, your customers, your goals and your budget.",
      },
      {
        title: "We look closer",
        description:
          "We review your current presence, your market and your competitors.",
      },
      {
        title: "Our suggestions",
        description:
          "We walk you through what we found and the opportunities we'd focus on first.",
      },
      {
        title: "Agree the next step",
        description:
          "You leave with a written plan. Run it yourself, or pick the services you want help with.",
      },
    ],
    outcomes: [
      "An outside view of what is really holding growth back.",
      "A clear offer and message you can explain in one sentence.",
      "Spending focused on what will move the needle first.",
      "A step-by-step plan instead of guesswork.",
    ],
    faqs: [
      {
        question: "Do I need to share my business idea or plans in detail?",
        answer:
          "No. Just tell us about your business as it is today and where you'd like it to go. We ask the questions and you share only what you're comfortable with.",
      },
      {
        question: "Is this only for new businesses?",
        answer:
          "Not at all. Most people come to us with a running business that has stalled or is ready for the next stage. New ventures are welcome too.",
      },
      {
        question: "Will what I share stay confidential?",
        answer:
          "Yes. What you tell us is used only to prepare your suggestions and is never shared with anyone else.",
      },
      {
        question: "What happens after the plan?",
        answer:
          "You're free to take the plan and run it yourself. If you'd like help, most businesses move on to Brand Identity so every channel speaks with one clear message.",
      },
    ],
  },

  brand: {
    metaTitle: "Brand Identity",
    headline: "Look credible from day one.",
    intro:
      "Your brand is the look and voice every other piece of marketing inherits. We build a clear, memorable identity and the rules to use it consistently, so your website, posts and ads all feel like one business.",
    problems: [
      "Your logo was a quick fix and no longer fits the business.",
      "Every post, flyer and page looks slightly different.",
      "Customers confuse you with competitors.",
      "You are about to build a website and need a look to build it on.",
    ],
    deliverables: [
      {
        title: "Logo system",
        description:
          "Primary logo, simplified mark and versions for light, dark and small spaces.",
      },
      {
        title: "Colour & typography",
        description:
          "A palette and type pairing that are readable, accessible and easy to reuse.",
      },
      {
        title: "Voice & messaging",
        description:
          "How you sound, a short brand story and key phrases to keep wording consistent.",
      },
      {
        title: "Brand guidelines",
        description:
          "A practical guide plus ready-made templates for social posts and documents.",
      },
    ],
    process: [
      {
        title: "Brand workshop",
        description:
          "We cover your values, customers, competitors and the feeling you want to create.",
      },
      {
        title: "Creative directions",
        description:
          "We present two or three distinct directions, each with a clear reason behind it.",
      },
      {
        title: "Refine",
        description:
          "We develop the chosen direction with your feedback until it feels right.",
      },
      {
        title: "Handover",
        description:
          "You receive every file, the guidelines and the templates, ready to use.",
      },
    ],
    outcomes: [
      "A business that looks established and trustworthy.",
      "Consistency across every channel without extra effort.",
      "Faster, cheaper design work later, because the rules already exist.",
      "A foundation for the website, content and ads to build on.",
    ],
    faqs: [
      {
        question: "Can you refresh my existing logo instead of replacing it?",
        answer:
          "Yes. If your current logo has recognition, we can modernise it and build the rest of the system around it.",
      },
      {
        question: "Which files will I receive?",
        answer:
          "Vector and image files for print and screen (SVG, PDF, PNG), the guidelines document and editable templates.",
      },
      {
        question: "How many revisions are included?",
        answer:
          "Each stage includes rounds of feedback. We agree the exact number up front so there are no surprises.",
      },
    ],
  },

  website: {
    metaTitle: "Websites",
    headline: "A home base that turns visits into enquiries.",
    intro:
      "Every post, ad and search result needs somewhere to send people. We design and build fast, mobile-first websites and landing pages that explain your offer clearly and make it easy to get in touch.",
    problems: [
      "You have no website, or one you are embarrassed to share.",
      "The site is slow, hard to use on a phone or out of date.",
      "People visit but nobody calls, messages or books.",
      "You cannot update anything without paying a developer.",
    ],
    deliverables: [
      {
        title: "Structure & copy",
        description:
          "Page plan and clear copy built around the questions your customers ask.",
      },
      {
        title: "Design",
        description:
          "Responsive layouts built on your brand identity, tested on phones first.",
      },
      {
        title: "Development",
        description:
          "Fast, accessible and secure build with enquiry forms and WhatsApp built in.",
      },
      {
        title: "Tracking & launch",
        description:
          "Analytics, search-ready basics and a training session so you can make updates.",
      },
    ],
    process: [
      {
        title: "Plan",
        description:
          "We agree the goal of the site, the pages it needs and the action visitors should take.",
      },
      {
        title: "Design",
        description:
          "You review designs for key pages on mobile and desktop before anything is built.",
      },
      {
        title: "Build",
        description:
          "We develop, add content and test speed, forms and accessibility.",
      },
      {
        title: "Launch & support",
        description:
          "We go live, check everything works and stay available for fixes and changes.",
      },
    ],
    outcomes: [
      "A site you are proud to share.",
      "More enquiries from the same number of visitors.",
      "A landing place ready for social, ads and search traffic.",
      "Clear data on what visitors do and where they drop off.",
    ],
    faqs: [
      {
        question: "Do I need a brand identity first?",
        answer:
          "It helps, because the brand sets the look every page uses. If you do not have one yet, we can build a light version alongside the site.",
      },
      {
        question: "Will I be able to edit the site myself?",
        answer:
          "Yes. We set up simple editing for the content you change often and show you how to use it.",
      },
      {
        question: "Do you handle domain and hosting?",
        answer:
          "We can set them up for you in your name, so you always own your site and domain.",
      },
    ],
  },

  social: {
    metaTitle: "Social Media & Content",
    headline: "Stay visible and trusted where your customers scroll.",
    intro:
      "Consistent, on-brand content keeps you top of mind and builds trust before people ever contact you. We plan, create and publish content on the platforms your customers use, and learn which messages win.",
    problems: [
      "Your pages are inactive or post only now and then.",
      "You do not know what to post or who it is for.",
      "Posts get a few likes but no enquiries.",
      "Your feed looks different from your brand and website.",
    ],
    deliverables: [
      {
        title: "Profile setup & optimisation",
        description:
          "Profiles on the right platforms with clear bios, links and branded visuals.",
      },
      {
        title: "Content strategy",
        description:
          "Content themes, posting rhythm and a monthly calendar tied to your goals.",
      },
      {
        title: "Creative production",
        description:
          "Branded posts, carousels, stories and short videos designed to stop the scroll.",
      },
      {
        title: "Publishing & reporting",
        description:
          "Scheduled publishing, community replies and a monthly report on what worked.",
      },
    ],
    process: [
      {
        title: "Audit",
        description:
          "We review your current profiles, competitors and what your audience engages with.",
      },
      {
        title: "Plan",
        description:
          "We agree themes, formats and a calendar you approve before anything goes out.",
      },
      {
        title: "Create & publish",
        description:
          "We produce and schedule content each month and handle the day-to-day posting.",
      },
      {
        title: "Learn & improve",
        description:
          "We track results and double down on the posts and messages that perform.",
      },
    ],
    outcomes: [
      "An active, professional presence that builds trust.",
      "Content that looks like one brand everywhere.",
      "Proof of which messages work before you spend on ads.",
      "More people visiting your website from social.",
    ],
    faqs: [
      {
        question: "Which platforms should I be on?",
        answer:
          "The ones your customers actually use. For most local businesses that is Facebook and Instagram, sometimes TikTok or LinkedIn. We recommend after the audit.",
      },
      {
        question: "Do I need to provide photos or videos?",
        answer:
          "Real photos of your business help a lot. We guide you on what to capture and can plan shoot days when needed.",
      },
      {
        question: "Is this the same as running ads?",
        answer:
          "No. This is organic content. It shows which messages win, so ad money is spent on proven ideas when you add Meta + Google Ads.",
      },
    ],
  },

  ads: {
    metaTitle: "Meta + Google Ads",
    headline: "Reach ready-to-buy customers this month.",
    intro:
      "Paid campaigns put your offer in front of the right people now, not in six months. We plan, launch and optimise Meta and Google Ads around real enquiries and sales, not just clicks.",
    problems: [
      "You need leads now and cannot wait for organic growth.",
      "You have tried boosting posts with little to show for it.",
      "You are spending on ads but do not know what you get back.",
      "Competitors appear above you every time someone searches.",
    ],
    deliverables: [
      {
        title: "Campaign strategy",
        description:
          "Goals, audiences, budget split and the offer each campaign will lead with.",
      },
      {
        title: "Ad creative & copy",
        description:
          "On-brand images, videos and headlines, with variations to test.",
      },
      {
        title: "Tracking setup",
        description:
          "Pixel, conversion and call tracking so every enquiry is measured.",
      },
      {
        title: "Optimisation & reporting",
        description:
          "Ongoing testing, budget shifts and plain-language monthly reports.",
      },
    ],
    process: [
      {
        title: "Plan",
        description:
          "We define the goal, target cost per enquiry and where each audience should land.",
      },
      {
        title: "Set up",
        description:
          "We build campaigns, creatives and tracking, and you approve before launch.",
      },
      {
        title: "Launch & test",
        description:
          "We go live with several variations and quickly cut what does not perform.",
      },
      {
        title: "Scale",
        description:
          "We move budget to the winners and grow what brings real customers.",
      },
    ],
    outcomes: [
      "A steady flow of enquiries you can switch on when needed.",
      "Clear numbers on cost per lead and return on spend.",
      "Search data that shows what people actually look for.",
      "Ads backed by a website built to convert the traffic.",
    ],
    faqs: [
      {
        question: "Is the ad budget included in your fee?",
        answer:
          "No. Ad budgets are paid directly to Meta and Google from your own account. Our fee covers strategy, creative and management.",
      },
      {
        question: "How soon will I see results?",
        answer:
          "Ads start bringing traffic within days. The first few weeks are for testing; results usually steady up by the second month.",
      },
      {
        question: "Do I need a website to run ads?",
        answer:
          "Ads work best with a website or landing page to send traffic to. Without one, we can run lead forms or WhatsApp campaigns, but results are more limited.",
      },
    ],
  },

  seo: {
    metaTitle: "SEO, AEO & GEO",
    headline: "Show up when people search for you.",
    intro:
      "Search brings visitors who are already looking for what you sell. We optimise your site and local listings for Google, and for AI answer engines, so you earn free traffic that compounds over time.",
    problems: [
      "Customers cannot find you on Google, even by name.",
      "Competitors show up on the map and you do not.",
      "You rely completely on paid ads for traffic.",
      "AI assistants never mention your business when asked.",
    ],
    deliverables: [
      {
        title: "Technical & on-page SEO",
        description:
          "Speed, structure, titles and content fixed so search engines understand every page.",
      },
      {
        title: "Local SEO",
        description:
          "Google Business Profile, map listings, reviews and consistent business details.",
      },
      {
        title: "Content & keywords",
        description:
          "Pages and articles that answer the real questions your customers search.",
      },
      {
        title: "AEO & GEO",
        description:
          "Clear answers and structured data so AI assistants can find and cite you.",
      },
    ],
    process: [
      {
        title: "Audit",
        description:
          "We check your site, listings and rankings and find the quickest wins.",
      },
      {
        title: "Fix the foundations",
        description:
          "We solve technical issues and set up your local presence properly.",
      },
      {
        title: "Create & optimise",
        description:
          "We publish and improve content around the searches that matter most.",
      },
      {
        title: "Track & grow",
        description:
          "Monthly ranking and traffic reports, with the next priorities each month.",
      },
    ],
    outcomes: [
      "Free, compounding traffic that does not stop when ads do.",
      "A stronger position in local map results.",
      "Visibility in AI answers as well as classic search.",
      "Lower overall cost per customer over time.",
    ],
    faqs: [
      {
        question: "How long does SEO take?",
        answer:
          "Quick fixes can show in weeks, but meaningful growth usually takes three to six months. It keeps paying off long after.",
      },
      {
        question: "What are AEO and GEO?",
        answer:
          "Answer Engine and Generative Engine Optimisation: making your content easy for AI assistants and AI search to understand, trust and quote.",
      },
      {
        question: "Can you guarantee the top spot on Google?",
        answer:
          "No one honestly can. We focus on the work that reliably improves rankings and report the results openly.",
      },
    ],
  },

  followup: {
    metaTitle: "Follow-up & Automation",
    headline: "Turn enquiries into customers, and customers into regulars.",
    intro:
      "Most sales are lost after the first message, not before it. We set up fast replies, reminders and simple automations so no enquiry is forgotten and happy customers come back and refer others.",
    problems: [
      "Messages sit unanswered for hours or get lost in WhatsApp.",
      "You forget to follow up with people who said 'maybe later'.",
      "Customers buy once and never come back.",
      "Your team repeats the same manual tasks every day.",
    ],
    deliverables: [
      {
        title: "WhatsApp & enquiry replies",
        description:
          "Quick replies, greeting messages and a simple way to track every enquiry.",
      },
      {
        title: "Reminders & sequences",
        description:
          "Follow-up messages, booking reminders and check-ins that go out on time.",
      },
      {
        title: "Repeat & referral",
        description:
          "Thank-you messages, review requests and offers that bring customers back.",
      },
      {
        title: "Reporting",
        description:
          "A clear view of enquiries, response times and how many turn into sales.",
      },
    ],
    process: [
      {
        title: "Map the journey",
        description:
          "We follow how enquiries arrive today and where they slip through.",
      },
      {
        title: "Design the flow",
        description:
          "We write the messages and decide what is automated and what stays personal.",
      },
      {
        title: "Set up & connect",
        description:
          "We configure the tools, connect your channels and test every step.",
      },
      {
        title: "Train & refine",
        description:
          "We train your team, then improve the flow based on real results.",
      },
    ],
    outcomes: [
      "Faster replies and fewer lost enquiries.",
      "More bookings from the leads you already have.",
      "Repeat customers and referrals that restart the cycle.",
      "Hours saved each week on manual follow-up.",
    ],
    faqs: [
      {
        question: "Will automated messages feel robotic?",
        answer:
          "No. We write them in your voice and keep the important conversations personal. Automation handles timing; you handle the relationship.",
      },
      {
        question: "Which tools do you use?",
        answer:
          "We start with what you already have, like WhatsApp Business, and only add tools that fit your size and budget.",
      },
      {
        question: "Is this useful if I do not get many enquiries yet?",
        answer:
          "Follow-up works best when enquiries are already flowing in. If they are not, we will suggest adding a lead source first.",
      },
    ],
  },
};
