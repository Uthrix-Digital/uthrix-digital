/**
 * Content for the service businesses landing page (/for/service-businesses).
 *
 * Two ways in: what service you offer (the type explorer, grouped by sector)
 * and how clients come to you (the client model). The shared parts of the
 * page (stages, proof, FAQ) still come from `@/config/audiences`.
 */
import {
  Award,
  BadgeCheck,
  BarChart3,
  Baby,
  BellRing,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck,
  Camera,
  Car,
  ClipboardList,
  Cpu,
  CreditCard,
  Dumbbell,
  Eye,
  FileText,
  Flower2,
  GraduationCap,
  Hammer,
  HandHeart,
  HardHat,
  Heart,
  HeartPulse,
  Home,
  Languages,
  Laptop,
  LayoutDashboard,
  Leaf,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  Music,
  Palette,
  PartyPopper,
  PawPrint,
  PhoneCall,
  Plane,
  Repeat,
  Ruler,
  Scale,
  Scissors,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SprayCan,
  Star,
  Stethoscope,
  Sun,
  Truck,
  UserCheck,
  Users,
  UtensilsCrossed,
  WashingMachine,
  Wrench,
  Zap,
} from "lucide-react";

/* ── Hero ─────────────────────────────────────────────────────────────── */

/** Words cycled in the hero's "Built for …" line. */
export const HERO_TICKER: string[] = [
  "clinics",
  "salons",
  "tuition classes",
  "lawyers",
  "real estate agents",
  "photographers",
  "plumbers & electricians",
  "consultants",
  "gyms",
  "visa agents",
  "dental surgeries",
  "wedding planners",
];

export const HERO_HIGHLIGHTS: { icon: LucideIcon; label: string; note: string }[] = [
  { icon: Search, label: "Found on Google", note: "First for \"near me\"" },
  { icon: MessageCircle, label: "Instant replies", note: "Every enquiry, in seconds" },
  { icon: CalendarCheck, label: "Online booking", note: "Slots, deposits, calendar" },
  { icon: BellRing, label: "Reminders", note: "Far fewer no-shows" },
  { icon: Star, label: "Reviews on autopilot", note: "Happy clients, asked to share" },
];

/** What service owners hear every day. Shown as a moving wall under the hero. */
export const QUESTIONS: string[] = [
  "How much?",
  "Are you open today?",
  "Any slots after 5?",
  "Is the doctor in?",
  "Can you send your rates?",
  "Do you come home?",
  "Sorry, can't make it 😅",
  "What's the fee for a consultation?",
  "Can I see your past work?",
  "Do you do weekends?",
  "How long does it take?",
  "Is there parking?",
  "Do you have an English medium class?",
  "Can you give a quote?",
  "Still free on the 14th?",
  "Who will actually do the job?",
];

/* ── The three silent questions ───────────────────────────────────────── */

export const SILENT_QUESTIONS: {
  icon: LucideIcon;
  question: string;
  why: string;
  answers: string[];
}[] = [
  {
    icon: ShieldCheck,
    question: "Can I trust you?",
    why: "They can't test a service before buying it. So they test you: your reviews, your photos, your face, your website.",
    answers: [
      "A website that shows real work, real people and real results",
      "A Google profile full of recent, genuine reviews",
      "Credentials, before-and-afters and case stories in one place",
    ],
  },
  {
    icon: CreditCard,
    question: "Can I afford you?",
    why: "\"Price on request\" feels expensive. Silence about price is why people ask and then vanish.",
    answers: [
      "Clear packages or \"from\" prices that set expectations",
      "An instant reply with the price range and what's included",
      "Deposits, instalments or payment plans where they help",
    ],
  },
  {
    icon: CalendarCheck,
    question: "Can I get in?",
    why: "If booking means a phone call during work hours, the 10 pm enquiry books whoever answers first.",
    answers: [
      "Online booking or quote requests that work at any hour",
      "Real-time slots, so nobody waits for \"let me check\"",
      "Reminders that make sure they actually turn up",
    ],
  },
];

/* ── How clients come to you ──────────────────────────────────────────── */

export type ClientModelId =
  | "appointments"
  | "quotes"
  | "enrolments"
  | "consultations"
  | "memberships"
  | "callouts";

export interface ClientModel {
  id: ClientModelId;
  label: string;
  icon: LucideIcon;
  /** Who uses this model. */
  who: string;
  /** Where clients are lost, in the owner's words. */
  quote: string;
  /** What we set up. */
  fix: string[];
  /** The one number we move first. */
  metric: string;
}

export const CLIENT_MODELS: ClientModel[] = [
  {
    id: "appointments",
    label: "Appointments",
    icon: CalendarCheck,
    who: "Clinics, salons, therapists, trainers. Your day is a calendar of time slots.",
    quote: "\"An empty slot is money I never get back.\"",
    fix: [
      "Online booking with real-time slots and staff calendars",
      "WhatsApp and SMS reminders with one-tap confirm or reschedule",
      "Deposits for long or high-value appointments",
    ],
    metric: "No-show rate",
  },
  {
    id: "quotes",
    label: "Quotes & projects",
    icon: Ruler,
    who: "Builders, interior designers, event planners, trades. Every job is priced to order.",
    quote: "\"I spend hours on quotes for people who were only window-shopping.\"",
    fix: [
      "A quote form that asks for photos, size, budget and timeline up front",
      "Portfolio pages that pre-sell your quality before the site visit",
      "Automatic follow-ups on quotes that haven't been answered",
    ],
    metric: "Quote-to-job rate",
  },
  {
    id: "enrolments",
    label: "Enrolments & intakes",
    icon: GraduationCap,
    who: "Tuition classes, schools, institutes, course creators. You fill seats by a deadline.",
    quote: "\"Every intake, it's a last-minute scramble to fill the batch.\"",
    fix: [
      "Course pages with outcomes, schedules, fees and teacher profiles",
      "Seminar and free-class sign-ups that build a waiting list",
      "Parent and student follow-ups on WhatsApp until they register",
    ],
    metric: "Enrolments per intake",
  },
  {
    id: "consultations",
    label: "Consultations",
    icon: Briefcase,
    who: "Lawyers, accountants, consultants, visa agents. Trust is the product.",
    quote: "\"Half my free consultations are people who will never hire me.\"",
    fix: [
      "Expert content and case stories that show how you think",
      "A short qualifying form before any call gets booked",
      "A paid or pre-screened discovery call, booked online",
    ],
    metric: "Qualified consultations",
  },
  {
    id: "memberships",
    label: "Memberships & contracts",
    icon: Repeat,
    who: "Gyms, cleaning contracts, maintenance plans, daycare. You earn when they stay.",
    quote: "\"Signing people up is easy. Keeping them past month three isn't.\"",
    fix: [
      "Clear plans and online sign-up with recurring payments",
      "Check-ins and renewal reminders before they drift away",
      "Referral offers that turn members into your sales team",
    ],
    metric: "Monthly retention",
  },
  {
    id: "callouts",
    label: "Call-outs & urgent jobs",
    icon: Zap,
    who: "Plumbers, electricians, AC repair, vets, towing. When they need you, they need you now.",
    quote: "\"If I miss the call while I'm on a job, they ring the next number.\"",
    fix: [
      "Top spots in Google Maps and \"near me\" searches",
      "Click-to-call and WhatsApp buttons everywhere",
      "A missed-call auto-reply that books them in before they move on",
    ],
    metric: "Calls answered or booked",
  },
];

/* ── What service you offer ───────────────────────────────────────────── */

export type SectorId =
  | "health"
  | "beauty"
  | "professional"
  | "property"
  | "education"
  | "events"
  | "tech"
  | "travel"
  | "care";

export const SECTORS: { id: SectorId; label: string; icon: LucideIcon }[] = [
  { id: "health", label: "Health & medical", icon: Stethoscope },
  { id: "beauty", label: "Beauty, wellness & fitness", icon: Sparkles },
  { id: "professional", label: "Professional services", icon: Briefcase },
  { id: "property", label: "Property, home & trades", icon: Home },
  { id: "education", label: "Education & training", icon: GraduationCap },
  { id: "events", label: "Events & creative", icon: Camera },
  { id: "tech", label: "Auto, tech & repairs", icon: Wrench },
  { id: "travel", label: "Visa, travel & staffing", icon: Plane },
  { id: "care", label: "Care & everyday", icon: HandHeart },
];

export interface ServiceType {
  id: string;
  sector: SectorId;
  label: string;
  icon: LucideIcon;
  /** Accent colour for the card art. Used through a CSS variable. */
  tint: string;
  /** Small line under the label. */
  examples: string;
  /** How clients usually come to them. */
  model: ClientModelId;
  /** What this owner wants most, in one line. */
  goal: string;
  /** The headache, in the owner's own words. */
  headache: string;
  /** What a client checks before they book. */
  clientsCheck: string[];
  /** What we build for this type. */
  weBuild: string[];
  /** The numbers we report on. */
  measure: string[];
}

export const SERVICE_TYPES: ServiceType[] = [
  /* Health & medical */
  {
    id: "clinics",
    sector: "health",
    label: "Clinics & medical centres",
    icon: Stethoscope,
    tint: "#2f7ee8",
    examples: "GPs, channelling centres, specialists",
    model: "appointments",
    goal: "Fill every session and stop the phone ringing off the hook for \"is the doctor in?\"",
    headache: "\"Our receptionist spends the whole morning answering the same three questions.\"",
    clientsCheck: [
      "Which doctor is in, on which day, and the fee",
      "How to book without calling five times",
      "Location, parking and opening hours",
    ],
    weBuild: [
      "Doctor profiles with session times and online channelling",
      "Instant replies for availability, fees and directions",
      "Reminders before each session, with easy rescheduling",
      "Careful, compliant health content for local search",
    ],
    measure: ["Booked appointments", "Calls saved per day"],
  },
  {
    id: "dental",
    sector: "health",
    label: "Dental surgeries",
    icon: Sparkles,
    tint: "#3fb1c8",
    examples: "Family dentists, orthodontics, implants",
    model: "appointments",
    goal: "Turn \"how much for braces?\" into treatment plans, not one-off check-ups.",
    headache: "\"People ask the price of braces, hear the number and disappear.\"",
    clientsCheck: [
      "Price ranges and payment plans for bigger treatments",
      "Before-and-after results from real patients",
      "Whether it will hurt, and how long it takes",
    ],
    weBuild: [
      "Treatment pages with price ranges, steps and FAQs",
      "Before-and-after galleries with patient consent",
      "Six-month check-up reminders that refill your calendar",
      "Google Ads for high-value treatments like implants and aligners",
    ],
    measure: ["Treatment plans started", "Recall rate"],
  },
  {
    id: "physio",
    sector: "health",
    label: "Physio & therapy",
    icon: HeartPulse,
    tint: "#2e9e8f",
    examples: "Physiotherapy, speech, occupational therapy",
    model: "appointments",
    goal: "Get patients to finish the full course of sessions, not just the first two.",
    headache: "\"They feel a bit better after two sessions and never come back.\"",
    clientsCheck: [
      "That you treat their exact problem",
      "How many sessions they'll need and the cost",
      "Home visits or evening slots",
    ],
    weBuild: [
      "Condition pages: back pain, sports injuries, stroke rehab",
      "Session packages with online booking",
      "Progress check-ins and reminders between sessions",
      "Referral pages for doctors who send you patients",
    ],
    measure: ["Course completion rate", "Doctor referrals"],
  },
  {
    id: "counselling",
    sector: "health",
    label: "Counselling & mental health",
    icon: Brain,
    tint: "#8a6bd6",
    examples: "Psychologists, counsellors, life coaches",
    model: "appointments",
    goal: "Make the hardest step, reaching out, feel safe and private.",
    headache: "\"People visit the page several times before they ever message us.\"",
    clientsCheck: [
      "Who they'll talk to and how they work",
      "Privacy, and whether online sessions are possible",
      "The fee, without having to ask",
    ],
    weBuild: [
      "A warm, calm website with therapist profiles and approach",
      "Private booking for online or in-person sessions",
      "Gentle, careful content that answers questions without pressure",
      "Discreet reminders with no sensitive details in them",
    ],
    measure: ["First sessions booked", "Return sessions"],
  },
  {
    id: "eye-care",
    sector: "health",
    label: "Eye care & opticians",
    icon: Eye,
    tint: "#b08a1e",
    examples: "Optometrists, optical shops, eye clinics",
    model: "appointments",
    goal: "Bring people back for yearly eye tests, not only when their glasses break.",
    headache: "\"Customers come once, then forget us for three years.\"",
    clientsCheck: [
      "Eye test times and whether they need to book",
      "Frame styles and lens prices",
      "Kids' eye care and school vision checks",
    ],
    weBuild: [
      "Eye test booking with yearly recall reminders",
      "A frame gallery customers can browse before visiting",
      "Local search so you show up for \"eye test near me\"",
      "School and corporate eye-check campaigns",
    ],
    measure: ["Eye tests booked", "Yearly recall rate"],
  },
  {
    id: "vet",
    sector: "health",
    label: "Vets & animal hospitals",
    icon: PawPrint,
    tint: "#7a9a2e",
    examples: "Vet clinics, pet hospitals, mobile vets",
    model: "callouts",
    goal: "Be the first number pet owners find in an emergency, and the vet they trust for life.",
    headache: "\"Owners only call when it's an emergency, and then they can't find our number.\"",
    clientsCheck: [
      "Whether you're open right now, and for emergencies",
      "Which animals you treat",
      "Vaccination and check-up costs",
    ],
    weBuild: [
      "Emergency info and click-to-call at the top of every page",
      "Vaccination and deworming reminders per pet",
      "Google Maps ranking for \"vet near me\"",
      "Pet care content owners share in their groups",
    ],
    measure: ["Emergency calls", "Vaccination reminders booked"],
  },

  /* Beauty, wellness & fitness */
  {
    id: "salons",
    sector: "beauty",
    label: "Salons & barbers",
    icon: Scissors,
    tint: "#e0456b",
    examples: "Hair salons, barbershops, unisex salons",
    model: "appointments",
    goal: "A full chair every day, and clients who rebook before they leave.",
    headache: "\"Saturdays are packed, Tuesdays are empty, and walk-ins are a gamble.\"",
    clientsCheck: [
      "Your work on people like them, on Instagram",
      "Prices for each service and stylist",
      "Open slots today or this weekend",
    ],
    weBuild: [
      "Online booking by service and stylist",
      "Slow-day offers sent to past clients on WhatsApp",
      "Reels and before-after content that shows your style",
      "Rebooking reminders timed to each service",
    ],
    measure: ["Chair occupancy", "Rebooking rate"],
  },
  {
    id: "bridal",
    sector: "beauty",
    label: "Bridal & makeup artists",
    icon: Flower2,
    tint: "#c26bd6",
    examples: "Bridal dressers, makeup artists, mehendi",
    model: "quotes",
    goal: "Book the wedding season months ahead, with a deposit on every date.",
    headache: "\"Brides ask about dates, then I chase them for weeks for the advance.\"",
    clientsCheck: [
      "Your bridal looks, in photos and video",
      "Package prices and what's included",
      "Whether their date is still free",
    ],
    weBuild: [
      "A portfolio site with packages and a date checker",
      "Deposit payments that lock in the date",
      "Trial booking and a timeline to the big day",
      "Content and ads around the wedding season",
    ],
    measure: ["Dates booked with deposit", "Enquiry-to-booking rate"],
  },
  {
    id: "aesthetic",
    sector: "beauty",
    label: "Skin & aesthetic clinics",
    icon: Sparkles,
    tint: "#d1553f",
    examples: "Skin care, laser, aesthetic treatments",
    model: "consultations",
    goal: "Earn trust for treatments people research for weeks before booking.",
    headache: "\"They compare us with clinics that post fake results and lower prices.\"",
    clientsCheck: [
      "Who does the treatment and their qualifications",
      "Genuine results and realistic expectations",
      "Prices, number of sessions and aftercare",
    ],
    weBuild: [
      "Treatment pages that explain the science and the steps",
      "Consultation booking with a short skin questionnaire",
      "Session packages and maintenance reminders",
      "Honest, compliant content that builds long-term trust",
    ],
    measure: ["Consultations booked", "Package uptake"],
  },
  {
    id: "spa",
    sector: "beauty",
    label: "Spas, Ayurveda & wellness",
    icon: Leaf,
    tint: "#3a9b5c",
    examples: "Day spas, Ayurveda centres, massage",
    model: "appointments",
    goal: "Fill weekday slots and turn one visit into a monthly ritual.",
    headache: "\"We're full on public holidays and quiet the rest of the month.\"",
    clientsCheck: [
      "The treatments, the space and the feeling",
      "Prices, duration and packages for couples or groups",
      "Gift vouchers they can send to someone",
    ],
    weBuild: [
      "A calm, photo-led site with treatment menus and booking",
      "Gift vouchers that sell online all year",
      "Memberships and monthly packages",
      "Off-peak offers for regulars and corporate clients",
    ],
    measure: ["Weekday bookings", "Voucher sales"],
  },
  {
    id: "fitness",
    sector: "beauty",
    label: "Gyms, studios & trainers",
    icon: Dumbbell,
    tint: "#e8833a",
    examples: "Gyms, yoga, CrossFit, personal trainers",
    model: "memberships",
    goal: "Sign members up in January and keep them coming in July.",
    headache: "\"January is full. By March, half of them have stopped coming.\"",
    clientsCheck: [
      "The space, the equipment and the coaches",
      "Membership prices without hidden fees",
      "A free trial or a first class",
    ],
    weBuild: [
      "Trial-class booking and online membership sign-up",
      "Class timetables with booking and waitlists",
      "Check-in nudges for members who stop showing up",
      "Transformation stories and referral offers",
    ],
    measure: ["Trial-to-member rate", "Monthly retention"],
  },

  /* Professional services */
  {
    id: "legal",
    sector: "professional",
    label: "Lawyers & notaries",
    icon: Scale,
    tint: "#6b7280",
    examples: "Attorneys, law firms, notaries public",
    model: "consultations",
    goal: "Attract the cases you want, and filter out the ones you don't.",
    headache: "\"Everyone wants free legal advice on the phone, then hires someone else.\"",
    clientsCheck: [
      "That you handle their kind of case",
      "Your experience, and how you'll communicate",
      "The consultation fee and the next step",
    ],
    weBuild: [
      "Practice-area pages that answer common legal questions",
      "A confidential enquiry form that captures the case type",
      "Paid consultation booking with clear fees",
      "Respectful search visibility for your areas of law",
    ],
    measure: ["Qualified case enquiries", "Consultations booked"],
  },
  {
    id: "accounting",
    sector: "professional",
    label: "Accountants & tax advisors",
    icon: Calculator,
    tint: "#2e9e8f",
    examples: "Audit firms, bookkeeping, tax filing",
    model: "consultations",
    goal: "Win monthly retainers, not only last-minute tax season rushes.",
    headache: "\"Everyone calls in the last week before the tax deadline.\"",
    clientsCheck: [
      "Which businesses you work with and what you handle",
      "Monthly fees or package prices",
      "How you'll keep their numbers safe",
    ],
    weBuild: [
      "Service packages for startups, SMEs and individuals",
      "Deadline reminder campaigns that start early",
      "A client portal or simple document upload",
      "Guides on tax changes that bring in search traffic",
    ],
    measure: ["Retainer clients", "Leads before deadlines"],
  },
  {
    id: "consultants",
    sector: "professional",
    label: "Consultants & coaches",
    icon: Users,
    tint: "#8a6bd6",
    examples: "Business, HR, career and executive coaches",
    model: "consultations",
    goal: "Be known as the expert, so clients come to you already convinced.",
    headache: "\"I'm busy doing the work, so marketing only happens when work dries up.\"",
    clientsCheck: [
      "Your method and the results you've delivered",
      "Who you're for, and who you're not for",
      "How to start, and what it costs",
    ],
    weBuild: [
      "A personal brand and website built around your method",
      "LinkedIn and content plans you can keep up",
      "A discovery-call funnel with a qualifying form",
      "Case studies that sell while you're working",
    ],
    measure: ["Discovery calls", "Proposal win rate"],
  },
  {
    id: "finance",
    sector: "professional",
    label: "Insurance & financial advisors",
    icon: ShieldCheck,
    tint: "#2f7ee8",
    examples: "Insurance agents, leasing, investment advisors",
    model: "consultations",
    goal: "Get warm leads who want advice, not cold numbers to chase.",
    headache: "\"I'm still buying lead lists and calling strangers.\"",
    clientsCheck: [
      "That you're licensed and represent a real company",
      "Plans explained simply, without pressure",
      "Reviews from people like them",
    ],
    weBuild: [
      "A personal advisor page with your licence and reviews",
      "Simple calculators and guides that capture interest",
      "Lead forms that ask the right questions first",
      "Renewal and policy-review reminders for every client",
    ],
    measure: ["Inbound leads", "Renewal rate"],
  },
  {
    id: "architects",
    sector: "professional",
    label: "Architects & interior designers",
    icon: Palette,
    tint: "#b7793a",
    examples: "Architects, interior design, landscaping",
    model: "quotes",
    goal: "Attract clients with real budgets who already love your style.",
    headache: "\"People love our Instagram but their budget is a tenth of what it costs.\"",
    clientsCheck: [
      "Finished projects, in photos and walkthroughs",
      "How the process works, from brief to handover",
      "A rough budget range for a project like theirs",
    ],
    weBuild: [
      "A project-led portfolio with budgets and timelines",
      "A brief form that captures scope, site and budget",
      "Content that shows your process, not just the result",
      "Follow-ups that keep proposals warm",
    ],
    measure: ["Qualified briefs", "Proposal-to-project rate"],
  },
  {
    id: "agencies",
    sector: "professional",
    label: "Agencies & B2B services",
    icon: Megaphone,
    tint: "#e0456b",
    examples: "IT firms, design studios, HR, security services",
    model: "consultations",
    goal: "Win bigger contracts with a pipeline that doesn't depend on referrals alone.",
    headache: "\"All our clients came from referrals. When those slow down, so do we.\"",
    clientsCheck: [
      "Case studies from companies like theirs",
      "Your team, process and certifications",
      "A clear way to request a proposal",
    ],
    weBuild: [
      "Service and industry pages that rank for B2B searches",
      "Case studies with numbers and client names (with permission)",
      "LinkedIn content and ads aimed at decision makers",
      "A CRM pipeline from enquiry to signed contract",
    ],
    measure: ["Proposal requests", "Pipeline value"],
  },

  /* Property, home & trades */
  {
    id: "real-estate",
    sector: "property",
    label: "Real estate agents",
    icon: Building2,
    tint: "#2f7ee8",
    examples: "Brokers, developers, land sales, rentals",
    model: "consultations",
    goal: "Get serious buyers to viewings, and sellers to list with you.",
    headache: "\"I get 200 messages per listing. Ten are serious, and I can't tell which.\"",
    clientsCheck: [
      "Full listing details: price, size, deeds, photos and location",
      "That you're a real, established agent",
      "A quick way to book a viewing",
    ],
    weBuild: [
      "A searchable listings site with filters and maps",
      "Lead forms that ask budget, timeline and financing",
      "Viewing booking and automatic reminders",
      "Seller pages that win new listings",
    ],
    measure: ["Qualified buyer leads", "Viewings booked"],
  },
  {
    id: "trades",
    sector: "property",
    label: "Plumbers, electricians & AC",
    icon: Wrench,
    tint: "#e8833a",
    examples: "Plumbing, electrical, AC service, CCTV",
    model: "callouts",
    goal: "Be the first call for jobs near you, and the contact they save for next time.",
    headache: "\"I'm under a sink when the phone rings. By the time I call back, they've found someone else.\"",
    clientsCheck: [
      "That you cover their area and can come soon",
      "A rough idea of the call-out charge",
      "Reviews from neighbours who used you",
    ],
    weBuild: [
      "A Google Business Profile that ranks for \"near me\"",
      "Missed-call auto-replies on WhatsApp",
      "A job request form with photos of the problem",
      "Service reminders for AC cleaning and maintenance",
    ],
    measure: ["Calls and WhatsApp leads", "Repeat jobs"],
  },
  {
    id: "cleaning",
    sector: "property",
    label: "Cleaning & pest control",
    icon: SprayCan,
    tint: "#3fb1c8",
    examples: "Home and office cleaning, pest control",
    model: "memberships",
    goal: "Turn one-off jobs into monthly and yearly contracts.",
    headache: "\"Customers call once, then go back to whoever is cheapest.\"",
    clientsCheck: [
      "Exact prices for their house or office size",
      "That your staff are trained and trustworthy",
      "What's included, and a satisfaction promise",
    ],
    weBuild: [
      "An instant price estimate by size and service",
      "Online booking with recurring schedules",
      "Contract plans for offices and apartment complexes",
      "Review requests after every job",
    ],
    measure: ["Recurring contracts", "Online bookings"],
  },
  {
    id: "construction",
    sector: "property",
    label: "Builders & renovation",
    icon: HardHat,
    tint: "#b08a1e",
    examples: "Contractors, renovations, roofing, tiling",
    model: "quotes",
    goal: "Show you're reliable on big, scary projects, before the first site visit.",
    headache: "\"Every client has a horror story about a previous contractor.\"",
    clientsCheck: [
      "Finished projects, progress photos and references",
      "How you price, and how payments are staged",
      "Who will be on site and how long it takes",
    ],
    weBuild: [
      "Project case studies with before, during and after",
      "A quote request with plans, photos and budget",
      "Client updates during the build",
      "Local search for each area and service you cover",
    ],
    measure: ["Quote requests", "Projects won"],
  },
  {
    id: "solar",
    sector: "property",
    label: "Solar & home tech",
    icon: Sun,
    tint: "#e8b33a",
    examples: "Solar installers, CCTV, smart home, water",
    model: "quotes",
    goal: "Turn bill-shock curiosity into site surveys and signed installs.",
    headache: "\"People enquire when their bill is high, then forget about it.\"",
    clientsCheck: [
      "How much they'll save, in rupees",
      "Panel brands, warranty and after-sales service",
      "Financing and how long the install takes",
    ],
    weBuild: [
      "A savings estimator that captures leads",
      "Site survey booking with follow-ups",
      "Install case studies with real bills, with permission",
      "Ads timed to tariff changes and bill season",
    ],
    measure: ["Site surveys booked", "Survey-to-install rate"],
  },
  {
    id: "movers",
    sector: "property",
    label: "Movers & transport",
    icon: Truck,
    tint: "#6b7280",
    examples: "House movers, lorries, office relocation",
    model: "quotes",
    goal: "Give fast, clear quotes and win the job on the first reply.",
    headache: "\"Every move is a long phone call just to give a price.\"",
    clientsCheck: [
      "A price for their move, quickly",
      "That their things are safe and insured",
      "Availability on their date",
    ],
    weBuild: [
      "A quote form by rooms, distance and date",
      "Instant replies with a price range",
      "Reviews and photos from past moves",
      "Search pages for each city and route",
    ],
    measure: ["Quotes sent", "Jobs booked"],
  },

  /* Education & training */
  {
    id: "tuition",
    sector: "education",
    label: "Tuition classes & tutors",
    icon: BookOpen,
    tint: "#c40202",
    examples: "O/L, A/L, Cambridge, Edexcel, primary",
    model: "enrolments",
    goal: "Fill every batch before the term starts, and keep students to the exam.",
    headache: "\"Parents ask about fees and timetables in 50 different WhatsApp chats.\"",
    clientsCheck: [
      "Results from past students",
      "Class times, location, online option and fees",
      "Who the teacher is and how they teach",
    ],
    weBuild: [
      "A class site with timetables, fees and online registration",
      "Seminar and free-class sign-ups that fill the next batch",
      "Parent updates and fee reminders on WhatsApp",
      "Results pages and student stories after each exam",
    ],
    measure: ["Registrations per batch", "Fee collection on time"],
  },
  {
    id: "schools",
    sector: "education",
    label: "Schools & preschools",
    icon: Baby,
    tint: "#3fb1c8",
    examples: "International schools, Montessori, daycare",
    model: "enrolments",
    goal: "Make parents feel confident before the school tour, and fill each intake.",
    headache: "\"Parents visit five schools. We never know why they picked another one.\"",
    clientsCheck: [
      "Curriculum, teachers, safety and facilities",
      "Fees and admission dates",
      "What other parents say",
    ],
    weBuild: [
      "A school website parents can actually find things on",
      "Tour and open-day booking with reminders",
      "An online admissions form that tracks every applicant",
      "Parent stories and daily-life content",
    ],
    measure: ["School tours booked", "Applications per intake"],
  },
  {
    id: "language",
    sector: "education",
    label: "IELTS, language & exam prep",
    icon: Languages,
    tint: "#2f7ee8",
    examples: "IELTS, PTE, Japanese, Korean, German",
    model: "enrolments",
    goal: "Turn people dreaming of going abroad into enrolled, committed students.",
    headache: "\"They ask about the course, then go quiet for months.\"",
    clientsCheck: [
      "Band scores and results from past students",
      "Course length, schedule and online or physical",
      "Fees and the next start date",
    ],
    weBuild: [
      "Course pages with outcomes, schedules and fees",
      "Free mock tests and level checks that capture leads",
      "Nurture messages until the next intake opens",
      "Success stories from students now abroad",
    ],
    measure: ["Mock test sign-ups", "Enrolments"],
  },
  {
    id: "skills",
    sector: "education",
    label: "Driving & skills training",
    icon: Car,
    tint: "#e8833a",
    examples: "Driving schools, IT courses, vocational",
    model: "enrolments",
    goal: "Be the trusted name in your town that people recommend first.",
    headache: "\"Every driving school looks the same online, so people choose the cheapest.\"",
    clientsCheck: [
      "Pass rates and what's included",
      "Lesson times that fit work or school",
      "Total price, with no surprises",
    ],
    weBuild: [
      "Package pages with clear pricing",
      "Lesson booking and exam-date reminders",
      "Google Maps and local search for your town",
      "Review requests the day students pass",
    ],
    measure: ["Enrolments", "Google reviews"],
  },
  {
    id: "arts",
    sector: "education",
    label: "Music, dance & art classes",
    icon: Music,
    tint: "#c26bd6",
    examples: "Music academies, dance, art, swimming",
    model: "enrolments",
    goal: "Keep classes full and students progressing year after year.",
    headache: "\"Students join for a term, then quit when exams get busy.\"",
    clientsCheck: [
      "Performances, students' work and the teachers",
      "Age groups, levels and class times",
      "Monthly fees and exam options",
    ],
    weBuild: [
      "A lively site with videos of concerts and recitals",
      "Trial class booking and online registration",
      "Fee reminders and progress updates for parents",
      "Recital and exam-season campaigns",
    ],
    measure: ["Trial classes", "Students retained per term"],
  },
  {
    id: "online-courses",
    sector: "education",
    label: "Online courses & creators",
    icon: Laptop,
    tint: "#8a6bd6",
    examples: "Course creators, webinars, coaching programmes",
    model: "enrolments",
    goal: "Sell your expertise beyond your city, while you sleep.",
    headache: "\"My audience likes my content, but very few buy the course.\"",
    clientsCheck: [
      "What they'll be able to do after the course",
      "Proof from students who finished it",
      "Price, access and a refund promise",
    ],
    weBuild: [
      "Sales pages and checkout for courses and programmes",
      "Free webinars or mini-courses that grow your list",
      "Email and WhatsApp launch sequences",
      "Ads that retarget people who watched but didn't buy",
    ],
    measure: ["Course sales", "Webinar-to-sale rate"],
  },

  /* Events & creative */
  {
    id: "photographers",
    sector: "events",
    label: "Photographers & videographers",
    icon: Camera,
    tint: "#16161a",
    examples: "Wedding, pre-shoot, corporate, product",
    model: "quotes",
    goal: "Book your dream shoots at your real price, not the cheapest in the group.",
    headache: "\"People only ask the price and compare me with someone half my rate.\"",
    clientsCheck: [
      "Full galleries and films, not only highlights",
      "Package prices and delivery times",
      "Whether you're free on their date",
    ],
    weBuild: [
      "A fast portfolio site organised by type of shoot",
      "Packages with a date check and deposit",
      "Client galleries and review requests after delivery",
      "Search pages for \"wedding photographer in Kandy\" and similar",
    ],
    measure: ["Booked dates", "Average package value"],
  },
  {
    id: "wedding-planners",
    sector: "events",
    label: "Event & wedding planners",
    icon: PartyPopper,
    tint: "#e0456b",
    examples: "Wedding planners, décor, corporate events",
    model: "quotes",
    goal: "Win the big events by looking calm, organised and worth it.",
    headache: "\"Couples love our décor, then try to do it themselves to save money.\"",
    clientsCheck: [
      "Real events you've delivered, start to finish",
      "Packages, budgets and what's included",
      "How you'll handle the stress for them",
    ],
    weBuild: [
      "Event stories with photos, budgets and vendor credits",
      "A planning brief form: date, guests, style, budget",
      "Proposal follow-ups and deposit payments",
      "Content for each season and type of event",
    ],
    measure: ["Briefs received", "Events booked"],
  },
  {
    id: "entertainment",
    sector: "events",
    label: "Caterers, DJs & entertainment",
    icon: UtensilsCrossed,
    tint: "#e8833a",
    examples: "Caterers, DJs, bands, cake & décor",
    model: "quotes",
    goal: "Fill your calendar with bookings, not \"maybe\" dates.",
    headache: "\"Three people want the same Saturday, and none of them have paid.\"",
    clientsCheck: [
      "Menus, sets or packages, with prices",
      "Videos or tastings from past events",
      "Availability on their date",
    ],
    weBuild: [
      "Package pages with an availability check",
      "Deposits that confirm the booking",
      "Video and review highlights from past events",
      "Ads around wedding season and festivals",
    ],
    measure: ["Confirmed bookings", "Deposit rate"],
  },

  /* Auto, tech & repairs */
  {
    id: "vehicle",
    sector: "tech",
    label: "Vehicle service & detailing",
    icon: Car,
    tint: "#2f7ee8",
    examples: "Service centres, garages, detailing, tyres",
    model: "appointments",
    goal: "A booked-up workshop, and customers who come back every service.",
    headache: "\"Customers only remember us when something breaks.\"",
    clientsCheck: [
      "Prices for common services",
      "How long it takes and whether they can wait",
      "Reviews about honesty and quality",
    ],
    weBuild: [
      "Service booking by vehicle type and job",
      "Mileage and service-date reminders",
      "Detailing and coating galleries",
      "Local search for every service you offer",
    ],
    measure: ["Service bookings", "Return visits"],
  },
  {
    id: "repairs",
    sector: "tech",
    label: "Phone, laptop & appliance repair",
    icon: Smartphone,
    tint: "#3a9b5c",
    examples: "Phone repair, laptops, electronics, appliances",
    model: "callouts",
    goal: "Win the \"is it fixable, and how much?\" question in the first message.",
    headache: "\"People send photos of a cracked screen and ask the price all day.\"",
    clientsCheck: [
      "A rough price before they come in",
      "How long it takes, and the warranty on repairs",
      "That their data is safe",
    ],
    weBuild: [
      "A repair price list by model and fault",
      "\"Send a photo, get a quote\" on WhatsApp",
      "Repair status updates until pick-up",
      "Google Maps ranking for \"repair near me\"",
    ],
    measure: ["Repair enquiries", "Jobs booked"],
  },
  {
    id: "it-support",
    sector: "tech",
    label: "IT support & managed services",
    icon: Cpu,
    tint: "#6b7280",
    examples: "IT support, networking, software, CCTV",
    model: "memberships",
    goal: "Move from one-off fixes to monthly support contracts.",
    headache: "\"Clients call us only when it's broken, then question every invoice.\"",
    clientsCheck: [
      "What you cover and how fast you respond",
      "Monthly plans compared to paying per call",
      "Which businesses already trust you",
    ],
    weBuild: [
      "Support plans with clear response times",
      "A ticket or request form that logs every job",
      "Case studies and industry pages for B2B search",
      "Renewal and upgrade reminders",
    ],
    measure: ["Support contracts", "Renewal rate"],
  },

  /* Visa, travel & staffing */
  {
    id: "migration",
    sector: "travel",
    label: "Visa & migration consultants",
    icon: Plane,
    tint: "#2e9e8f",
    examples: "Visa, PR, work permits, migration",
    model: "consultations",
    goal: "Stand out as genuine in an industry full of scams.",
    headache: "\"People are scared of being cheated, so they don't trust anyone online.\"",
    clientsCheck: [
      "Registration, licences and a real office",
      "Success stories with real names and faces",
      "Honest eligibility and fees up front",
    ],
    weBuild: [
      "A trust-first website with licences and team profiles",
      "An eligibility checker that qualifies leads",
      "Consultation booking and case status updates",
      "Video testimonials from clients now abroad",
    ],
    measure: ["Eligible leads", "Files opened"],
  },
  {
    id: "study-abroad",
    sector: "travel",
    label: "Study-abroad agents",
    icon: GraduationCap,
    tint: "#8a6bd6",
    examples: "Student visas, university placements",
    model: "consultations",
    goal: "Guide students and parents from first question to visa approval.",
    headache: "\"Students enquire, then disappear when the parents get involved.\"",
    clientsCheck: [
      "Which countries and universities you work with",
      "Real students you've placed",
      "Costs, scholarships and timelines",
    ],
    weBuild: [
      "Country and course pages that rank in search",
      "Education fair and seminar registrations",
      "Separate follow-ups for students and parents",
      "A pipeline from enquiry to visa approval",
    ],
    measure: ["Counselling sessions", "Applications filed"],
  },
  {
    id: "recruitment",
    sector: "travel",
    label: "Recruitment & staffing",
    icon: UserCheck,
    tint: "#b7793a",
    examples: "Job agencies, foreign employment, manpower",
    model: "consultations",
    goal: "Attract both sides: good candidates and companies that hire.",
    headache: "\"We get hundreds of CVs, and still can't fill the jobs clients need.\"",
    clientsCheck: [
      "Licensed and registered, with real placements",
      "Open jobs with real details",
      "A simple way to apply or send a requirement",
    ],
    weBuild: [
      "A jobs board with filters and online applications",
      "Separate employer pages and hiring requests",
      "Candidate screening forms and WhatsApp updates",
      "LinkedIn and Meta campaigns for hard-to-fill roles",
    ],
    measure: ["Qualified applicants", "Employer requests"],
  },

  /* Care & everyday */
  {
    id: "daycare",
    sector: "care",
    label: "Childcare & daycare",
    icon: Heart,
    tint: "#e0456b",
    examples: "Daycare centres, after-school care, nannies",
    model: "memberships",
    goal: "Give parents peace of mind, and keep every place filled.",
    headache: "\"Parents want to see everything before they trust us with their child.\"",
    clientsCheck: [
      "Safety, staff and daily routines",
      "Hours, fees and meals",
      "A visit before they decide",
    ],
    weBuild: [
      "A warm website with staff, spaces and a day in the life",
      "Visit booking and a waiting list",
      "Parent updates and fee reminders",
      "Local search for \"daycare near me\"",
    ],
    measure: ["Visits booked", "Places filled"],
  },
  {
    id: "elder-care",
    sector: "care",
    label: "Elder care & home nursing",
    icon: HandHeart,
    tint: "#2e9e8f",
    examples: "Elder homes, home nursing, caregivers",
    model: "consultations",
    goal: "Be the calm, trustworthy answer when a family needs help fast.",
    headache: "\"Families find us in a crisis, and need answers that same day.\"",
    clientsCheck: [
      "Qualified, verified caregivers",
      "Care options, schedules and costs",
      "Someone to talk to right now",
    ],
    weBuild: [
      "A clear website with care options and caregiver profiles",
      "Fast call-back requests and WhatsApp replies",
      "Care assessment booking",
      "Family stories and trust signals",
    ],
    measure: ["Care enquiries", "Assessments booked"],
  },
  {
    id: "pet-services",
    sector: "care",
    label: "Pet grooming & boarding",
    icon: PawPrint,
    tint: "#7a9a2e",
    examples: "Groomers, boarding, training, pet sitters",
    model: "appointments",
    goal: "Booked out every holiday season, with regulars all year.",
    headache: "\"Everyone wants boarding over Avurudu and Christmas, and nobody books early.\"",
    clientsCheck: [
      "Clean, safe spaces and caring staff",
      "Prices by size and breed",
      "Availability on their dates",
    ],
    weBuild: [
      "Booking for grooming, boarding and training",
      "Holiday early-bird campaigns",
      "Grooming reminders based on each pet",
      "Happy pet photos and reviews",
    ],
    measure: ["Bookings", "Repeat grooming visits"],
  },
  {
    id: "laundry",
    sector: "care",
    label: "Laundry & home services",
    icon: WashingMachine,
    tint: "#3fb1c8",
    examples: "Laundry, dry cleaning, tailoring, errands",
    model: "memberships",
    goal: "Become the weekly habit for busy households nearby.",
    headache: "\"Our customers are loyal, but we can't seem to find new ones.\"",
    clientsCheck: [
      "Prices per item or per kilo",
      "Pick-up and delivery areas and times",
      "How long it takes",
    ],
    weBuild: [
      "A simple price list and pick-up booking",
      "Weekly subscription plans",
      "WhatsApp \"your order is ready\" updates",
      "Local ads for new apartments and neighbourhoods",
    ],
    measure: ["Weekly orders", "Subscribers"],
  },
];

/** Extra words people might type into the explorer's search, per type. */
export const SEARCH_ALIASES: Record<string, string> = {
  clinics: "doctor gp medical hospital channelling channeling pharmacy lab diagnostic",
  dental: "dentist teeth tooth braces orthodontist",
  physio: "physiotherapist rehab chiropractor speech therapist",
  counselling: "psychologist psychiatrist therapist counselor mental",
  "eye-care": "optician optometrist spectacles glasses lenses",
  vet: "veterinary animal pet doctor",
  salons: "hair barber hairdresser beauty parlour parlor",
  bridal: "makeup bride dresser mehendi henna",
  aesthetic: "skin laser botox dermatologist facial",
  spa: "massage ayurvedic wellness",
  fitness: "gym yoga pilates trainer zumba crossfit",
  legal: "lawyer attorney law firm notary",
  accounting: "accountant audit bookkeeping tax",
  consultants: "coach consultant consulting mentor hr",
  finance: "insurance leasing loans investment advisor",
  architects: "architect interior designer landscaping",
  agencies: "agency it software marketing security b2b",
  "real-estate": "property land broker realtor rentals apartments",
  trades: "plumber electrician ac air conditioning cctv handyman repair",
  cleaning: "cleaner pest control housekeeping",
  construction: "builder contractor renovation roofing tiling masonry",
  solar: "solar panels smart home water purifier",
  movers: "moving relocation lorry transport",
  tuition: "tutor teacher classes al ol a/l o/l math science",
  schools: "school preschool montessori nursery kindergarten",
  language: "ielts pte english japanese korean german french",
  skills: "driving school vocational it course",
  arts: "music dance art swimming piano guitar",
  "online-courses": "course creator webinar elearning udemy",
  photographers: "photography videography videographer studio",
  "wedding-planners": "event planner decorator wedding",
  entertainment: "caterer catering dj band sound lighting",
  vehicle: "garage mechanic car wash detailing tyres service centre",
  repairs: "phone mobile laptop computer appliance repair",
  "it-support": "it support network computer managed services",
  migration: "visa immigration pr work permit",
  "study-abroad": "student visa university education agent",
  recruitment: "jobs agency manpower foreign employment hr staffing",
  daycare: "childcare nanny babysitter after school",
  "elder-care": "nursing caregiver home care elders",
  "pet-services": "grooming boarding dog cat kennel",
  laundry: "dry cleaning tailor ironing",
};

/* ── One enquiry, two endings ─────────────────────────────────────────── */

export interface StoryMoment {
  time: string;
  without: string;
  with: string;
}

export const ENQUIRY_STORY: StoryMoment[] = [
  {
    time: "Mon 21:47",
    without: "Nadeesha messages: \"How much for braces? Do you have evening slots?\" Your phone is on silent. You're having dinner.",
    with: "Nadeesha messages the same question. In seconds she gets the price range, payment-plan options and a booking link with evening slots.",
  },
  {
    time: "Mon 21:52",
    without: "She messages two more clinics. One replies straight away.",
    with: "She books a consultation for Thursday at 6 pm, and pays a small deposit to hold it.",
  },
  {
    time: "Tue 09:15",
    without: "You reply: \"Hi, please call.\" She's already booked with the other clinic.",
    with: "Your team opens the dashboard. Her booking, her question and her phone number are already there.",
  },
  {
    time: "Wed 18:00",
    without: "An empty 6 pm slot. Someone else didn't turn up either, and didn't tell you.",
    with: "She gets a reminder with directions and parking. She taps \"Confirm\".",
  },
  {
    time: "Thu 18:00",
    without: "You boosted a post this week. You don't know if it brought a single patient.",
    with: "She arrives. She starts treatment. The report shows she came from your Google Ad.",
  },
  {
    time: "6 months on",
    without: "Nadeesha is telling her friends about the other clinic.",
    with: "She's left a 5-star review, booked her check-up and sent two friends your way.",
  },
];

/* ── Features ─────────────────────────────────────────────────────────── */

export const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Award,
    title: "A website that earns trust",
    body: "Your work, your people, your results and your prices, on a site that loads fast on any phone.",
  },
  {
    icon: CalendarCheck,
    title: "Online booking",
    body: "Real-time slots by service and staff member, synced to your calendar, open 24/7.",
  },
  {
    icon: BellRing,
    title: "Reminders that work",
    body: "WhatsApp, SMS and email reminders with one-tap confirm or reschedule. Fewer empty slots.",
  },
  {
    icon: MessageCircle,
    title: "Instant replies",
    body: "Answers to \"how much?\" and \"are you open?\" in seconds, on WhatsApp, Messenger and Instagram.",
  },
  {
    icon: ClipboardList,
    title: "Smart enquiry forms",
    body: "Forms that ask budget, timeline and needs first, so you spend time on the right people.",
  },
  {
    icon: LayoutDashboard,
    title: "One lead pipeline",
    body: "Every enquiry from every channel in one simple CRM, from \"new\" to \"client\".",
  },
  {
    icon: Search,
    title: "Google Maps & local SEO",
    body: "A Business Profile and service pages built to rank when people search \"near me\".",
  },
  {
    icon: Star,
    title: "Reviews on autopilot",
    body: "Happy clients are asked for a review at the right moment. Unhappy ones reach you first.",
  },
  {
    icon: CreditCard,
    title: "Deposits & payments",
    body: "Card, bank transfer and payment links that lock in bookings and cut no-shows.",
  },
  {
    icon: FileText,
    title: "Packages & pricing pages",
    body: "Clear packages and \"from\" prices that filter out bargain hunters before they message.",
  },
  {
    icon: PhoneCall,
    title: "Missed-call rescue",
    body: "Miss a call while you're with a client? They get a WhatsApp with a booking link straight away.",
  },
  {
    icon: BarChart3,
    title: "Reports that mean something",
    body: "Enquiries, bookings, show-ups and cost per client. Not likes, not reach.",
  },
];

/* ── Client journey ───────────────────────────────────────────────────── */

export interface JourneyStep {
  moment: string;
  /** What the client is doing. */
  client: string;
  /** What we put in place for that moment. */
  weDo: string;
  service: { label: string; href: string };
}

export const CLIENT_JOURNEY: JourneyStep[] = [
  {
    moment: "Search",
    client: "Googles \"dentist near me\" or asks a Facebook group for a recommendation.",
    weDo: "Local SEO and ads, so your name shows up first.",
    service: { label: "SEO", href: "/services/seo" },
  },
  {
    moment: "Check",
    client: "Looks at your reviews, photos, website and who's behind it.",
    weDo: "A brand and website that look as good as your work.",
    service: { label: "Brand identity", href: "/services/brand-identity" },
  },
  {
    moment: "Ask",
    client: "Sends a message, often late at night, often to three businesses at once.",
    weDo: "Instant replies with prices, answers and a next step.",
    service: { label: "Follow-up systems", href: "/services/follow-up" },
  },
  {
    moment: "Book",
    client: "Wants a time, a price and a confirmation without a phone call.",
    weDo: "Online booking, quote requests and deposits.",
    service: { label: "Web development", href: "/services/web-development" },
  },
  {
    moment: "Show up",
    client: "Life gets busy. Without a nudge, appointments get forgotten.",
    weDo: "Reminders, directions and easy rescheduling.",
    service: { label: "Follow-up systems", href: "/services/follow-up" },
  },
  {
    moment: "Return",
    client: "Happy, and ready to come back and tell friends, if you ask.",
    weDo: "Review requests, rebooking and referral offers.",
    service: { label: "Social & content", href: "/services/social-content" },
  },
];

/* ── Process ──────────────────────────────────────────────────────────── */

export const PROCESS: { icon: LucideIcon; title: string; body: string; youGet: string }[] = [
  {
    icon: ClipboardList,
    title: "Map your client path",
    body: "We trace how clients find you today, where enquiries go cold and what you track.",
    youGet: "A one-page plan: the leaks to fix first",
  },
  {
    icon: Hammer,
    title: "Build your trust kit",
    body: "Brand, website, Google profile and content that show your work at its best.",
    youGet: "A design you approve before we build",
  },
  {
    icon: Zap,
    title: "Switch on the system",
    body: "Booking, instant replies, reminders and a lead pipeline, connected to WhatsApp and your calendar.",
    youGet: "Every enquiry answered and tracked from day one",
  },
  {
    icon: BadgeCheck,
    title: "Grow, measure, repeat",
    body: "We run the ads and content, then improve what brings real clients, month after month.",
    youGet: "A monthly report: enquiries, bookings, cost per client",
  },
];
