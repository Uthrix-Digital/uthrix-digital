/**
 * Content for the hospitality & travel landing page (/for/hospitality).
 *
 * Everything here is specific to tourism businesses. The shared parts of the
 * page (stages, proof, FAQ) still come from `@/config/audiences`.
 */
import {
  BarChart3,
  Binoculars,
  CalendarCheck,
  CarFront,
  Compass,
  Flower2,
  Hotel,
  House,
  Images,
  Languages,
  MapPin,
  MessageCircle,
  Mountain,
  PenLine,
  Plane,
  Route,
  Search,
  Ship,
  ShieldCheck,
  Smartphone,
  Star,
  Tent,
  BedDouble,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const HERO_HIGHLIGHTS: { icon: LucideIcon; label: string; note: string }[] = [
  { icon: Smartphone, label: "Built for phones", note: "Where most travellers plan" },
  { icon: CalendarCheck, label: "Direct booking", note: "Or a clean enquiry flow" },
  { icon: MessageCircle, label: "WhatsApp ready", note: "One tap to ask a question" },
  { icon: Search, label: "Found on Google", note: "Search, Maps and reviews" },
  { icon: Zap, label: "Fast and secure", note: "Even on slow connections" },
];

/* ── Business types ───────────────────────────────────────────────────── */

export interface TourismType {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Card photo (Unsplash, Unsplash License), 640×400. */
  image: string;
  /** Small line under the label, e.g. examples or places. */
  examples: string;
  /** What this business wants most, in one line. */
  goal: string;
  /** What a guest must see before they trust you and book. */
  guestsNeed: string[];
  /** What we build for this type. */
  weBuild: string[];
  /** The numbers we report on. */
  measure: string[];
}

export const TOURISM_TYPES: TourismType[] = [
  {
    id: "hotels",
    image: "/assets/Images/hospitality/types/hotels.jpg",
    label: "Hotels & resorts",
    icon: Hotel,
    examples: "City hotels, beach resorts, boutique hotels",
    goal: "Fill more rooms directly and pay less commission on each one.",
    guestsNeed: [
      "Each room type with real photos, size and what's included",
      "Live availability and a rate they can trust",
      "Location, facilities and recent guest reviews in one place",
    ],
    weBuild: [
      "A direct booking engine, or a clean link to the one you already use",
      "Room, offer and package pages that sell the stay",
      "Prices in the guest's own currency",
      "Google Hotel listing and Business Profile set up properly",
    ],
    measure: ["Direct booking share", "Cost per booking"],
  },
  {
    id: "villas",
    image: "/assets/Images/hospitality/types/villas.jpg",
    label: "Villas & boutique stays",
    icon: House,
    examples: "Private villas, bungalows, holiday homes",
    goal: "Look as special online as the place is in person, and book the whole villa direct.",
    guestsNeed: [
      "A feel for the place: light, views, space and privacy",
      "Exactly what's included: staff, meals, pool, transfers",
      "Proof that others loved staying there",
    ],
    weBuild: [
      "An image-led website with a full gallery and video",
      "An availability calendar with a booking or enquiry form",
      "Your Airbnb and Booking.com reviews shown on your own site",
      "Ads aimed at couples, families and groups who book villas",
    ],
    measure: ["Direct enquiries", "Nights booked direct"],
  },
  {
    id: "guest-houses",
    image: "/assets/Images/hospitality/types/guest-houses.jpg",
    label: "Guest houses & homestays",
    icon: BedDouble,
    examples: "Family-run guest houses, homestays, hostels",
    goal: "Get found on Google Maps and take bookings without the paperwork.",
    guestsNeed: [
      "Clean, honest photos of the rooms",
      "How to get there and what is nearby",
      "A quick way to ask about dates",
    ],
    weBuild: [
      "A simple, affordable website that works well on phones",
      "Google Business Profile so you show up on Maps",
      "A WhatsApp booking button with your dates and rates",
      "A review routine that grows your Google rating",
    ],
    measure: ["Google profile views", "WhatsApp enquiries"],
  },
  {
    id: "tour-operators",
    image: "/assets/Images/hospitality/types/tour-operators.jpg",
    label: "Tour operators & DMCs",
    icon: Compass,
    examples: "Round tours, custom itineraries, inbound DMCs",
    goal: "Win the trust of travellers who plan months ahead and have never met you.",
    guestsNeed: [
      "Day-by-day itineraries with a clear price guide",
      "SLTDA registration, real guides, real vehicles",
      "Reviews from travellers from their own country",
    ],
    weBuild: [
      "Tour package pages that rank for what travellers search",
      "A custom-tour request form that collects dates, group size and budget",
      "Quote and itinerary templates that cut hours to minutes",
      "Multilingual pages for your main source markets",
    ],
    measure: ["Tour enquiries", "Enquiry-to-booking rate"],
  },
  {
    id: "travel-agencies",
    image: "/assets/Images/hospitality/types/travel-agencies.jpg",
    label: "Travel agencies",
    icon: Plane,
    examples: "Outbound holidays, ticketing, visa services",
    goal: "Turn package browsing into qualified enquiries your team can close.",
    guestsNeed: [
      "Packages they can filter by country, budget and dates",
      "What's included, without calling to ask",
      "A real person to talk to before they pay",
    ],
    weBuild: [
      "A package catalogue that your team can update easily",
      "Enquiry forms for flights, visas and holidays",
      "Seasonal campaigns on Meta and Google",
      "A lead inbox so no enquiry is forgotten",
    ],
    measure: ["Qualified enquiries", "Cost per lead"],
  },
  {
    id: "safari",
    image: "/assets/Images/hospitality/types/safari.jpg",
    label: "Safari & wildlife tours",
    icon: Binoculars,
    examples: "Jeep safaris, birding, national park tours",
    goal: "Be the safari travellers book before they arrive, not the one they find at the gate.",
    guestsNeed: [
      "Which park, which season and what they might see",
      "Pick-up points, timings and jeep details",
      "Reviews and photos from recent trips",
    ],
    weBuild: [
      "Park and season guide pages that rank on Google",
      "Time-slot booking for morning, evening and full-day trips",
      "WhatsApp confirmation with pick-up details",
      "TripAdvisor and Google reviews pulled onto your site",
    ],
    measure: ["Advance bookings", "Review count"],
  },
  {
    id: "adventure",
    image: "/assets/Images/hospitality/types/adventure.jpg",
    label: "Adventure & activities",
    icon: Mountain,
    examples: "Rafting, diving, surfing, hiking, ziplining",
    goal: "Fill every slot, every day, with bookings made before guests reach town.",
    guestsNeed: [
      "Video of the activity: it sells better than words",
      "Safety, equipment and who can join",
      "Simple slot booking for their group",
    ],
    weBuild: [
      "Activity pages with video and clear safety information",
      "Slot booking with group sizes and deposits",
      "Short-form content for Instagram and TikTok",
      "Partner pages for hotels that send you guests",
    ],
    measure: ["Slots filled", "Online booking share"],
  },
  {
    id: "wellness",
    image: "/assets/Images/hospitality/types/wellness.jpg",
    label: "Wellness & Ayurveda retreats",
    icon: Flower2,
    examples: "Ayurveda resorts, yoga retreats, spa programmes",
    goal: "Explain longer, higher-value stays clearly enough that people commit.",
    guestsNeed: [
      "What a day in the programme looks like",
      "Who the doctors and teachers are",
      "Clear prices for 7, 14 and 21-night stays",
    ],
    weBuild: [
      "Programme pages with daily schedules and pricing",
      "A consultation request so guests can ask before they book",
      "Helpful articles that rank for wellness searches",
      "Email follow-up for guests still deciding",
    ],
    measure: ["Programme enquiries", "Average stay value"],
  },
  {
    id: "transport",
    image: "/assets/Images/hospitality/types/transport-sedan.jpg",
    label: "Transport & chauffeur",
    icon: CarFront,
    examples: "Airport transfers, chauffeur-guides, car hire",
    goal: "Get booked for transfers and round tours before travellers land.",
    guestsNeed: [
      "The vehicle, the driver and what the price includes",
      "Airport pick-up confirmed in advance",
      "Someone who replies quickly",
    ],
    weBuild: [
      "Fleet and driver pages with real photos",
      "A route quote form for transfers and round tours",
      "WhatsApp booking with automatic confirmation",
      "Google Ads for airport transfer searches",
    ],
    measure: ["Transfer bookings", "Reply time"],
  },
  {
    id: "boat-tours",
    image: "/assets/Images/hospitality/types/boat-tours.jpg",
    label: "Boat & whale-watching tours",
    icon: Ship,
    examples: "Whale watching, lagoon safaris, boat trips",
    goal: "Fill the boat on every sailing during the season.",
    guestsNeed: [
      "Season dates and the chance of sightings",
      "What the boat is like, and safety on board",
      "A booking they can make the night before",
    ],
    weBuild: [
      "Season and sailing pages with live availability",
      "Mobile booking that takes deposits",
      "Partner links for hotels and guest houses nearby",
      "Seasonal ads timed to when travellers plan",
    ],
    measure: ["Seats booked", "Repeat partner referrals"],
  },
  {
    id: "eco-camping",
    image: "/assets/Images/hospitality/types/eco-camping.jpg",
    label: "Eco lodges & camping",
    icon: Tent,
    examples: "Glamping, tree houses, nature lodges",
    goal: "Reach travellers looking for something different, and stand out from hotels.",
    guestsNeed: [
      "What the experience is really like, day and night",
      "How to get there and what to bring",
      "What makes the stay sustainable",
    ],
    weBuild: [
      "A story-led site that sells the experience",
      "Booking with packages: stay, meals and activities",
      "Content for Instagram, where these trips are found",
      "SEO for searches like glamping and nature stays",
    ],
    measure: ["Direct bookings", "Instagram enquiries"],
  },
  {
    id: "restaurants",
    image: "/assets/Images/hospitality/types/restaurants.jpg",
    label: "Restaurants & cafés",
    icon: UtensilsCrossed,
    examples: "Beach cafés, rooftop bars, tourist-town restaurants",
    goal: "Be the place visitors find on Maps when they search for dinner nearby.",
    guestsNeed: [
      "The menu, with prices",
      "Photos of the food and the space",
      "Opening hours, location and a way to reserve",
    ],
    weBuild: [
      "A fast menu website that works well on phones",
      "Google Maps profile, photos and review replies",
      "Table reservations by form or WhatsApp",
      "Event and offer posts for the busy season",
    ],
    measure: ["Map direction requests", "Reservations"],
  },
];

/* ── Commission calculator defaults ───────────────────────────────────── */

export const CALCULATOR = {
  bookings: { min: 5, max: 400, step: 5, initial: 60 },
  value: { min: 20, max: 1500, step: 10, initial: 180 },
  commission: { min: 10, max: 30, step: 1, initial: 18 },
  directShare: { min: 5, max: 60, step: 5, initial: 25 },
} as const;

/* ── Features ─────────────────────────────────────────────────────────── */

export const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Smartphone,
    title: "Built for phones",
    body: "Most travellers plan and book on their phone. Every page is designed for a small screen first.",
  },
  {
    icon: CalendarCheck,
    title: "Booking & enquiries",
    body: "A direct booking engine, or an enquiry form that collects dates, guests and budget in one go.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp & live chat",
    body: "One tap to message you, with the page they were on already filled in.",
  },
  {
    icon: Route,
    title: "Tours & packages",
    body: "Day-by-day itineraries, inclusions and price guides that are easy for your team to update.",
  },
  {
    icon: Images,
    title: "Galleries & video",
    body: "Fast-loading photo galleries and video that show what the stay or trip is really like.",
  },
  {
    icon: Languages,
    title: "Languages & currencies",
    body: "Pages for your main source markets, with prices shown in the guest's currency.",
  },
  {
    icon: Star,
    title: "Reviews on your site",
    body: "Your Google, TripAdvisor and Booking.com reviews shown where guests decide.",
  },
  {
    icon: Search,
    title: "Ready for search",
    body: "Page structure, speed and content built to rank for the trips and stays you sell.",
  },
  {
    icon: MapPin,
    title: "Google Maps profile",
    body: "A complete Business Profile, so you show up when travellers search nearby.",
  },
  {
    icon: ShieldCheck,
    title: "Fast & secure",
    body: "Secure hosting, SSL and pages that load quickly, even on a slow hotel Wi-Fi.",
  },
  {
    icon: PenLine,
    title: "Easy to update",
    body: "Change rates, photos and packages yourself, without calling a developer.",
  },
  {
    icon: BarChart3,
    title: "Booking tracking",
    body: "See which ads, pages and channels bring bookings, not just visits.",
  },
];

/* ── Guest journey ────────────────────────────────────────────────────── */

export interface JourneyStep {
  moment: string;
  /** What the traveller is doing. */
  guest: string;
  /** What we put in place for that moment. */
  weDo: string;
  service: { label: string; href: string };
}

export const GUEST_JOURNEY: JourneyStep[] = [
  {
    moment: "Dream",
    guest: "Scrolls Instagram and TikTok, saving places they'd love to visit.",
    weDo: "Content and reels that put your place in their saved folder.",
    service: { label: "Social & content", href: "/services/social-content" },
  },
  {
    moment: "Search",
    guest: "Googles \"villa in Ella\" or \"Yala safari\" and checks the map.",
    weDo: "SEO and a Maps profile so you appear when they look.",
    service: { label: "SEO", href: "/services/seo" },
  },
  {
    moment: "Compare",
    guest: "Opens five tabs, checks photos, prices and reviews.",
    weDo: "A brand and website that look like the best choice.",
    service: { label: "Brand identity", href: "/services/brand-identity" },
  },
  {
    moment: "Ask",
    guest: "Sends a question on WhatsApp, email or Instagram.",
    weDo: "One inbox and quick replies, so no enquiry goes cold.",
    service: { label: "Follow-up systems", href: "/services/follow-up" },
  },
  {
    moment: "Book",
    guest: "Wants to pay and confirm without friction.",
    weDo: "A clear, fast booking flow on your own site.",
    service: { label: "Web development", href: "/services/web-development" },
  },
  {
    moment: "Return",
    guest: "Goes home, and plans the next trip next year.",
    weDo: "Re-booking messages and ads to past guests at the right time.",
    service: { label: "Meta & Google Ads", href: "/services/meta-google-ads" },
  },
];

/* ── Process ──────────────────────────────────────────────────────────── */

export const PROCESS: { title: string; body: string; youGet: string }[] = [
  {
    title: "Understand your business",
    body: "We learn who your guests are, where they come from and how they book today.",
    youGet: "A short plan with what to fix first",
  },
  {
    title: "Design & content",
    body: "We design the pages around your best photos, rooms, tours and reviews.",
    youGet: "A design you approve before we build",
  },
  {
    title: "Build & connect",
    body: "We build the site and connect booking, WhatsApp, Maps and tracking.",
    youGet: "A fast site you can update yourself",
  },
  {
    title: "Launch & grow",
    body: "We launch, then bring in guests with SEO, ads and follow-up.",
    youGet: "A monthly report in plain numbers",
  },
];
