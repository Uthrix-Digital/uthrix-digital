/**
 * Content for the product sellers landing page (/for/product-sellers).
 *
 * Two ways in: what you sell (category) and how you sell it (channel).
 * The shared parts of the page (stages, proof, FAQ) still come from
 * `@/config/audiences`.
 */
import {
  Baby,
  BadgeCheck,
  BarChart3,
  Boxes,
  Cake,
  Camera,
  ClipboardList,
  CreditCard,
  Factory,
  Gem,
  LayoutDashboard,
  MessageCircle,
  MessagesSquare,
  PackageCheck,
  PawPrint,
  Pill,
  Repeat,
  Scissors,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const HERO_HIGHLIGHTS: { icon: LucideIcon; label: string; note: string }[] = [
  { icon: ShoppingBag, label: "Store or catalogue", note: "Buy without asking \"price?\"" },
  { icon: MessageCircle, label: "WhatsApp & DM orders", note: "Replies in seconds, 24/7" },
  { icon: PackageCheck, label: "COD confirmation", note: "Fewer returned parcels" },
  { icon: BarChart3, label: "Ads that track sales", note: "Know which post sold" },
  { icon: LayoutDashboard, label: "One order inbox", note: "No more spreadsheets" },
];

/** The comments every seller knows. Shown as a moving wall under the hero. */
export const COMMENTS: string[] = [
  "price?",
  "pm",
  "Inbox plz 🙏",
  "COD available?",
  "Size chart?",
  "Delivery to Jaffna?",
  "Still available?",
  "Other colours?",
  "Last price?",
  "How to order?",
  "Is this original?",
  "Wholesale price?",
  "Can I get it by Friday?",
  "Sent you a message",
  "Is there a warranty?",
  "Where is your shop?",
];

/* ── What you sell ────────────────────────────────────────────────────── */

export interface SellerCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Accent colour for the card art. Used through a CSS variable. */
  tint: string;
  /** Small line under the label. */
  examples: string;
  /** What this seller wants most, in one line. */
  goal: string;
  /** The headache, in the owner's own words. */
  headache: string;
  /** What a buyer must see before they trust you and order. */
  buyersNeed: string[];
  /** What we build for this category. */
  weBuild: string[];
  /** The numbers we report on. */
  measure: string[];
}

export const SELLER_CATEGORIES: SellerCategory[] = [
  {
    id: "fashion",
    label: "Fashion & clothing",
    icon: Shirt,
    tint: "#e0456b",
    examples: "Clothing brands, boutiques, sarees, kidswear",
    goal: "Sell out each new drop, with fewer \"size?\" messages and fewer returns.",
    headache: "\"Every new collection means 300 messages asking the same five questions.\"",
    buyersNeed: [
      "The piece on a real person, front, back and close-up",
      "A size guide they can trust, in cm and inches",
      "Delivery time, exchange policy and how to pay",
    ],
    weBuild: [
      "A lookbook-style store with sizes, colours and stock per variant",
      "Reels and try-on content planned around each drop",
      "Auto-replies that send price, sizes and the order link",
      "Meta Ads that retarget people who viewed but didn't buy",
    ],
    measure: ["Sell-through per drop", "Exchange rate"],
  },
  {
    id: "beauty",
    label: "Beauty & skincare",
    icon: Sparkles,
    tint: "#c26bd6",
    examples: "Skincare, cosmetics, haircare, perfumes",
    goal: "Win trust for products people put on their skin, and turn first orders into refills.",
    headache: "\"Half my DMs are 'is this original?' and I can't prove it fast enough.\"",
    buyersNeed: [
      "Proof it's genuine: batch codes, sourcing, real reviews",
      "Which product suits their skin or hair type",
      "Ingredients, how to use it and real results",
    ],
    weBuild: [
      "Product pages with ingredients, skin-type guides and reviews",
      "A short quiz that recommends the right routine",
      "Refill reminders timed to when the bottle runs out",
      "Creator and before-after content that builds trust",
    ],
    measure: ["Repeat purchase rate", "Average order value"],
  },
  {
    id: "electronics",
    label: "Electronics & gadgets",
    icon: Smartphone,
    tint: "#2f7ee8",
    examples: "Phones, accessories, computers, appliances",
    goal: "Compete on trust and service, not just on the lowest price in the group.",
    headache: "\"Customers compare me with ten other pages and buy wherever is Rs. 200 cheaper.\"",
    buyersNeed: [
      "Exact specs, model numbers and what's in the box",
      "Warranty terms and who honours them",
      "Stock they can count on, and fast delivery",
    ],
    weBuild: [
      "A searchable catalogue with filters by brand, spec and price",
      "Warranty, service and \"why buy from us\" pages",
      "Google Shopping and search ads for model-number searches",
      "Bundle and accessory offers at checkout",
    ],
    measure: ["Orders from search", "Accessory attach rate"],
  },
  {
    id: "furniture",
    label: "Furniture & home décor",
    icon: Sofa,
    tint: "#b7793a",
    examples: "Showrooms, custom furniture, décor, lighting",
    goal: "Turn browsing online into showroom visits, quotes and big-ticket orders.",
    headache: "\"People love the photos, then go quiet when they hear the price.\"",
    buyersNeed: [
      "Real photos in real rooms, with exact dimensions",
      "Materials, finishes and how long it lasts",
      "Delivery, assembly and an easy way to ask for a quote",
    ],
    weBuild: [
      "Room-by-room catalogues with dimensions and finishes",
      "A quote request for custom sizes and colours",
      "Google Maps and local search to bring people to the showroom",
      "Instalment and payment-plan messaging that eases the price",
    ],
    measure: ["Quote requests", "Showroom visits"],
  },
  {
    id: "food",
    label: "Food, cakes & home bakers",
    icon: Cake,
    tint: "#e8833a",
    examples: "Cake makers, snacks, spices, packaged foods",
    goal: "Take orders for the right date without juggling chats at midnight.",
    headache: "\"I miss orders because I'm baking when the messages come in.\"",
    buyersNeed: [
      "Photos and a menu with clear prices and sizes",
      "Which dates are still open, and how far ahead to order",
      "Delivery areas, pick-up times and how to pay the advance",
    ],
    weBuild: [
      "An order form with date, size, flavour and message on the cake",
      "Advance payment so orders are confirmed, not \"maybe\"",
      "A WhatsApp catalogue that matches your menu",
      "Seasonal campaigns for Avurudu, Christmas and Valentine's",
    ],
    measure: ["Pre-booked orders", "Advance-paid share"],
  },
  {
    id: "groceries",
    label: "Groceries & daily essentials",
    icon: ShoppingBasket,
    tint: "#3a9b5c",
    examples: "Mini-marts, organic produce, home delivery",
    goal: "Become the shop people reorder from every week without thinking.",
    headache: "\"Customers send me their list by voice note and I type it all out.\"",
    buyersNeed: [
      "Today's prices and what's in stock",
      "Delivery slots and areas you cover",
      "A quick way to reorder last week's basket",
    ],
    weBuild: [
      "A simple grocery store with categories and quick search",
      "One-tap \"order again\" from past baskets",
      "Delivery slot booking by area",
      "Weekly offers sent on WhatsApp to regular buyers",
    ],
    measure: ["Weekly repeat orders", "Basket size"],
  },
  {
    id: "handmade",
    label: "Handmade & crafts",
    icon: Scissors,
    tint: "#d1553f",
    examples: "Batik, candles, gifts, art, handloom",
    goal: "Get paid what handmade is worth, locally and from overseas.",
    headache: "\"People say it's beautiful, then ask why it costs more than a shop.\"",
    buyersNeed: [
      "The story: who made it, how and how long it takes",
      "Custom and gift options with a clear lead time",
      "Shipping overseas and how to pay from abroad",
    ],
    weBuild: [
      "A story-led store that sells the craft, not just the item",
      "Custom order and gift-message options",
      "International shipping and card payments",
      "Content for Instagram and Pinterest, where gifts are found",
    ],
    measure: ["Average order value", "Overseas orders"],
  },
  {
    id: "jewellery",
    label: "Jewellery & accessories",
    icon: Gem,
    tint: "#b08a1e",
    examples: "Gold, gems, silver, bags, watches",
    goal: "Make high-value pieces feel safe to buy, online or at the counter.",
    headache: "\"Nobody sends Rs. 150,000 to a page they found yesterday.\"",
    buyersNeed: [
      "Certificates, weight, purity and hallmarks",
      "Close-up video that shows the real shine",
      "A real shop, real people and a returns promise",
    ],
    weBuild: [
      "Product pages with certificates, video and live gold-rate pricing",
      "Appointment booking for private viewing",
      "Trust pages: your shop, your story, your guarantees",
      "Ads around engagements, weddings and festivals",
    ],
    measure: ["Viewing appointments", "Enquiry-to-sale rate"],
  },
  {
    id: "kids",
    label: "Baby, kids & toys",
    icon: Baby,
    tint: "#3fb1c8",
    examples: "Baby care, toys, school items, kidswear",
    goal: "Be the store busy parents trust and come back to as their kids grow.",
    headache: "\"Parents ask about age, safety and size before every order.\"",
    buyersNeed: [
      "Age range, safety and what it's made from",
      "Gift ideas by age and budget",
      "Fast, reliable delivery for birthdays",
    ],
    weBuild: [
      "Shop by age, by budget and by occasion",
      "Gift wrapping and birthday-date delivery",
      "Reminders as children reach the next age or size",
      "Parent-focused content and community groups",
    ],
    measure: ["Repeat customers", "Gift orders"],
  },
  {
    id: "health",
    label: "Health, pharmacy & supplements",
    icon: Pill,
    tint: "#2e9e8f",
    examples: "Pharmacies, supplements, medical supplies",
    goal: "Make reordering easy and keep every claim accurate and compliant.",
    headache: "\"Regular customers forget to reorder until they've already run out.\"",
    buyersNeed: [
      "Accurate product details and who it's suitable for",
      "Prescription upload where it's needed",
      "Discreet packaging and dependable delivery",
    ],
    weBuild: [
      "A catalogue with clear, careful product information",
      "Prescription upload and pharmacist call-back",
      "Monthly reorder reminders and subscriptions",
      "Search pages for the products people already look for",
    ],
    measure: ["Reorder rate", "Orders from search"],
  },
  {
    id: "hardware",
    label: "Hardware, auto & tools",
    icon: Wrench,
    tint: "#6b7280",
    examples: "Building supplies, auto parts, tools, electrical",
    goal: "Answer \"do you have this part?\" before the customer calls someone else.",
    headache: "\"I get photos of broken parts and spend all day checking stock.\"",
    buyersNeed: [
      "The exact part: model, size, brand and fit",
      "Price and stock, without a phone call",
      "Delivery to site, or a counter to collect from",
    ],
    weBuild: [
      "A parts catalogue you can search by model or part number",
      "A \"send a photo, get a quote\" request",
      "Trade accounts with their own prices for contractors",
      "Google Maps so you're the nearest shop that has it",
    ],
    measure: ["Quote requests", "Trade account orders"],
  },
  {
    id: "pets-garden",
    label: "Pets, plants & garden",
    icon: PawPrint,
    tint: "#7a9a2e",
    examples: "Pet food, aquariums, nurseries, garden supplies",
    goal: "Turn hobby buyers into loyal regulars who order every month.",
    headache: "\"My customers are passionate, but they buy from whoever posts last.\"",
    buyersNeed: [
      "Care guides and what suits their pet or garden",
      "Live stock photos, sizes and health guarantees",
      "Delivery that keeps plants and animals safe",
    ],
    weBuild: [
      "A store with care guides next to every product",
      "Food and supply subscriptions on a schedule",
      "Community content: tips, reels and customer photos",
      "Local ads to hobby groups near you",
    ],
    measure: ["Subscribers", "Monthly repeat orders"],
  },
];

/* ── How you sell ─────────────────────────────────────────────────────── */

export interface SalesChannel {
  id: string;
  label: string;
  icon: LucideIcon;
  /** "This is you if…" */
  who: string;
  /** The problem, in their words. */
  quote: string;
  /** What we set up. */
  fix: string[];
  /** The one number we move first. */
  metric: string;
}

export const SALES_CHANNELS: SalesChannel[] = [
  {
    id: "social",
    label: "Social sellers",
    icon: MessagesSquare,
    who: "You sell on Facebook, Instagram or TikTok, and orders happen in the inbox.",
    quote: "\"My page is busy, but I'm a full-time typist, not a business owner.\"",
    fix: [
      "A catalogue link so people can see prices and order without asking",
      "Comment and DM auto-replies with price, sizes and the order link",
      "Meta Ads with tracking that shows which post actually sold",
    ],
    metric: "Orders per 100 messages",
  },
  {
    id: "online-store",
    label: "Online stores",
    icon: ShoppingBag,
    who: "You have a website (Shopify, WooCommerce or custom), but sales are slow.",
    quote: "\"People add to cart, then leave. I don't know why.\"",
    fix: [
      "A faster, clearer store that works well on phones",
      "Abandoned-cart messages by WhatsApp, SMS and email",
      "Checkout with COD, card, bank transfer and pay-later options",
    ],
    metric: "Store conversion rate",
  },
  {
    id: "showroom",
    label: "Shops & showrooms",
    icon: Store,
    who: "Customers come through the door, and you want more of them.",
    quote: "\"People check us online first. If they can't find us, they go elsewhere.\"",
    fix: [
      "Google Maps and local search so nearby buyers find you first",
      "Product pages that make people want to see it in person",
      "Call and visit tracking, so you know what brings people in",
    ],
    metric: "Calls and direction requests",
  },
  {
    id: "marketplace",
    label: "Marketplace sellers",
    icon: Tag,
    who: "You sell on Daraz, Kapruka or other marketplaces, and pay fees on every order.",
    quote: "\"The marketplace owns my customers. I can't even message them again.\"",
    fix: [
      "Your own store alongside the marketplace, not instead of it",
      "Inserts and offers that bring marketplace buyers to you next time",
      "A customer list you own, for reorders without fees",
    ],
    metric: "Share of orders you own",
  },
  {
    id: "wholesale",
    label: "Wholesalers & distributors",
    icon: Warehouse,
    who: "You sell to shops, resellers or businesses, often in bulk.",
    quote: "\"Orders arrive by phone, WhatsApp and paper. Mistakes are expensive.\"",
    fix: [
      "A trade ordering portal with each customer's own prices",
      "Reorder in two taps from past orders",
      "Credit limits, invoices and order status in one place",
    ],
    metric: "Orders placed without a call",
  },
  {
    id: "brands",
    label: "Brands & manufacturers",
    icon: Factory,
    who: "You make the product and want to sell direct, or support your dealers.",
    quote: "\"We make a great product, but nobody knows our name.\"",
    fix: [
      "A brand identity and website that earns a premium price",
      "Direct-to-customer store, plus a dealer and stockist finder",
      "Campaigns that build the brand and sell at the same time",
    ],
    metric: "Direct sales and brand searches",
  },
];

/* ── A day in the life ────────────────────────────────────────────────── */

export interface DayMoment {
  time: string;
  without: string;
  with: string;
}

export const DAY_IN_THE_LIFE: DayMoment[] = [
  {
    time: "08:00",
    without: "63 unread messages across Messenger, Instagram and WhatsApp. You start replying before breakfast.",
    with: "Overnight orders are already in your dashboard, confirmed and ready to pack.",
  },
  {
    time: "11:00",
    without: "You type the same price, sizes and delivery reply for the fortieth time.",
    with: "Auto-replies send price, sizes and the order link in seconds. You answer only the real questions.",
  },
  {
    time: "14:00",
    without: "Copying names, phone numbers and addresses into Excel for the courier.",
    with: "Courier details come straight from the order list. Customers get a tracking update automatically.",
  },
  {
    time: "18:00",
    without: "Two cash-on-delivery parcels come back: \"I never ordered this.\"",
    with: "Every COD order was confirmed by WhatsApp before it left, so fewer parcels come back.",
  },
  {
    time: "22:00",
    without: "Still replying. You boosted a post today, and have no idea if it sold anything.",
    with: "Phone down. Today's report shows which ad brought which orders, and what each order cost.",
  },
];

/* ── Order leak calculator defaults ───────────────────────────────────── */

export const CALCULATOR = {
  messages: { min: 50, max: 5000, step: 50, initial: 600 },
  value: { min: 500, max: 50000, step: 500, initial: 4500 },
  conversion: { min: 2, max: 50, step: 1, initial: 12 },
  returns: { min: 0, max: 40, step: 1, initial: 15 },
  /** Scenario we show: this many more orders per 100 messages… */
  liftPoints: 3,
  /** …and returns cut by this share. */
  returnCut: 1 / 3,
} as const;

/* ── Features ─────────────────────────────────────────────────────────── */

export const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShoppingBag,
    title: "Store or catalogue",
    body: "A full online store or a simple catalogue link. Whatever fits your stage and budget.",
  },
  {
    icon: CreditCard,
    title: "Pay your way",
    body: "Cash on delivery, card, bank transfer and pay-later options, all in one checkout.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp ordering",
    body: "Customers order on WhatsApp, and the order lands in your system, not just your chat.",
  },
  {
    icon: MessagesSquare,
    title: "Comment & DM replies",
    body: "Instant answers to \"price?\" and \"pm\" on Facebook and Instagram, with the order link.",
  },
  {
    icon: LayoutDashboard,
    title: "One order dashboard",
    body: "Every order from every channel in one list, with status from new to delivered.",
  },
  {
    icon: Truck,
    title: "Delivery updates",
    body: "Courier details, tracking and delivery messages sent without you typing them.",
  },
  {
    icon: Boxes,
    title: "Stock & variants",
    body: "Sizes, colours and stock counts that update when something sells.",
  },
  {
    icon: Camera,
    title: "Product content",
    body: "Photos, reels and short videos planned to sell, not just to look nice.",
  },
  {
    icon: BarChart3,
    title: "Sales tracking",
    body: "Meta Pixel and Conversions API set up, so you see which ad brought which order.",
  },
  {
    icon: Search,
    title: "Found on Google",
    body: "Product pages and a Maps profile built to show up when people search to buy.",
  },
  {
    icon: Star,
    title: "Reviews & proof",
    body: "Customer reviews, photos and unboxing videos where buyers decide.",
  },
  {
    icon: Repeat,
    title: "Reorder reminders",
    body: "Messages that bring customers back at the right time, with the right offer.",
  },
];

/* ── Buyer journey ────────────────────────────────────────────────────── */

export interface JourneyStep {
  moment: string;
  /** What the buyer is doing. */
  buyer: string;
  /** What we put in place for that moment. */
  weDo: string;
  service: { label: string; href: string };
}

export const BUYER_JOURNEY: JourneyStep[] = [
  {
    moment: "Scroll",
    buyer: "Sees your product in a reel, a story or a friend's share.",
    weDo: "Content that stops the thumb and shows the price.",
    service: { label: "Social & content", href: "/services/social-content" },
  },
  {
    moment: "Search",
    buyer: "Googles the product, or \"near me\", to compare.",
    weDo: "SEO and a Maps profile so you show up first.",
    service: { label: "SEO", href: "/services/seo" },
  },
  {
    moment: "Trust",
    buyer: "Checks your page, reviews and whether you look real.",
    weDo: "A brand that looks worth the price.",
    service: { label: "Brand identity", href: "/services/brand-identity" },
  },
  {
    moment: "Order",
    buyer: "Wants to pick a size, pay and be done in a minute.",
    weDo: "A fast store or order form that works on any phone.",
    service: { label: "Web development", href: "/services/web-development" },
  },
  {
    moment: "Receive",
    buyer: "Waits for the parcel and wants to know where it is.",
    weDo: "Confirmation and delivery updates, sent automatically.",
    service: { label: "Follow-up systems", href: "/services/follow-up" },
  },
  {
    moment: "Reorder",
    buyer: "Liked it. Will buy again, if you remind them.",
    weDo: "Offers and ads to past buyers at the right moment.",
    service: { label: "Meta & Google Ads", href: "/services/meta-google-ads" },
  },
];

/* ── Process ──────────────────────────────────────────────────────────── */

export const PROCESS: { icon: LucideIcon; title: string; body: string; youGet: string }[] = [
  {
    icon: ClipboardList,
    title: "Map how you sell today",
    body: "We look at where your orders come from, where they get stuck and what you track today.",
    youGet: "A one-page plan: the leaks to fix first",
  },
  {
    icon: Camera,
    title: "Brand, content & store",
    body: "We design the store or catalogue around your best products, photos and offers.",
    youGet: "A design you approve before we build",
  },
  {
    icon: PackageCheck,
    title: "Connect the order flow",
    body: "We connect WhatsApp, social inboxes, payments, delivery and tracking into one system.",
    youGet: "Every order in one place, from day one",
  },
  {
    icon: BadgeCheck,
    title: "Launch & sell more",
    body: "We launch, run the ads and content, then improve what sells, month after month.",
    youGet: "A monthly report: orders, cost per order, returns",
  },
];
