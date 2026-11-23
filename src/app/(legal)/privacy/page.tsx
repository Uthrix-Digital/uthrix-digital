import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { LegalDocument, type LegalSection } from "../_components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | UthriX Digital",
  description:
    "How UthriX Digital collects, uses, stores and protects the personal information you share through our website, enquiry form and call bookings.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    paragraphs: [
      "UthriX Digital is a digital marketing and software development company based in Sri Lanka. This policy explains what personal information we collect through this website, why we collect it and what we do with it.",
      "For the information described here, UthriX Digital is the party responsible for deciding how it is used.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "We only collect information you choose to give us. That happens when you send an enquiry, book a call or message us directly.",
    ],
    items: [
      "Contact details: your name, email address and phone number.",
      "Business details: your website, your type of business, the stage it is at and what you are looking for.",
      "Booking details: the time slot you choose, your time zone and the email addresses of any guests you invite to the call.",
      "Anything you write in a message to us, including on WhatsApp or by email.",
      "How you heard about us, if you tell us.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    paragraphs: ["We use your information to:"],
    items: [
      "Reply to your enquiry and prepare for a conversation with you.",
      "Schedule, confirm and remind you about calls you have booked.",
      "Prepare proposals and deliver services you have asked for.",
      "Keep our website secure and stop spam and automated submissions.",
      "Meet our legal and accounting obligations.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    paragraphs: [
      "We store a small amount of information in your browser so the site works the way you left it: your light or dark theme preference and your cookie choice. This is strictly necessary, stays on your device and is not used to identify you.",
      "With your permission, we also use analytics and advertising tools from Google and Meta. Nothing from these tools sets a cookie or sends identifying data about you until you choose “Accept” on the cookie banner. If you choose “Reject”, the site works the same.",
      "You can change or withdraw your choice at any time using the “Cookie settings” link at the bottom of every page. Withdrawing switches these tools off and removes their cookies from this site.",
      "The tools we use are:",
    ],
    items: [
      "Google Tag Manager, which loads Google’s measurement and advertising tags, such as Google Analytics. It runs in Google Consent Mode: before you accept, Google tags set no cookies and only send basic, cookieless signals (for example, that a page was viewed). After you accept, they may set cookies such as _ga, _ga_<id> and _gcl_au, which last up to two years, to tell us how visitors use the site and how our Google adverts perform.",
      "The Meta Pixel, from Meta Platforms. It is only loaded after you accept. It sets the _fbp cookie, and the _fbc cookie if you arrived from one of our ads on Facebook or Instagram, each lasting up to 90 days. It tells Meta which pages you visit, together with technical details such as your IP address, browser and device, so we can measure our adverts and show them to people who have visited this site. Meta may link this activity to your Facebook or Instagram account.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    paragraphs: [
      "We do not sell your personal information. We share it only with service providers that help us run this website and our business, and only as far as they need it to do that work:",
    ],
    items: [
      "Website hosting and database providers, which store enquiries and bookings.",
      "Email delivery providers, which send confirmation and notification emails.",
      "Messaging services such as WhatsApp, if you choose to contact us there.",
      "Google, through Google Tag Manager and the tags it loads, with cookies only if you accept them.",
      "Meta Platforms, through the Meta Pixel, only if you accept cookies.",
      "Authorities or advisers, where the law requires it or to protect our legal rights.",
    ],
  },
  {
    id: "international-transfers",
    title: "International transfers",
    paragraphs: [
      "Some of our service providers store data on servers outside Sri Lanka. When your information is transferred to another country, we rely on providers that apply recognised security and data protection safeguards.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    paragraphs: [
      "We keep enquiry and booking records for as long as we need them to respond to you and to manage our relationship with you. If we do not go on to work together, we delete or anonymise your details within a reasonable period, unless the law requires us to keep them for longer.",
    ],
  },
  {
    id: "security",
    title: "How we protect it",
    paragraphs: [
      "We use encrypted connections, restricted access and reputable service providers to protect your information. No method of sending or storing data online is completely secure, so we cannot guarantee absolute security, but we work to keep the risk low and will tell you if a breach affects you where the law requires it.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "Depending on where you live, you may have the right to:",
    ],
    items: [
      "Ask what personal information we hold about you and receive a copy.",
      "Ask us to correct information that is wrong or out of date.",
      "Ask us to delete your information.",
      "Object to, or ask us to limit, how we use your information.",
      "Withdraw consent you have previously given.",
    ],
  },
  {
    id: "exercising-your-rights",
    title: "Exercising your rights",
    paragraphs: [
      `To make any of these requests, email ${siteConfig.email}. We may ask you to confirm your identity before we act on a request, and we will respond within a reasonable time.`,
    ],
  },
  {
    id: "third-party-links",
    title: "Links to other websites",
    paragraphs: [
      "Our website links to other sites, including our social media profiles and client work. We are not responsible for how those sites handle your information, so please read their privacy policies.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "Our website and services are intended for businesses and are not directed at children. We do not knowingly collect personal information from anyone under 18.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. When we do, we will change the “last updated” date at the top of this page. Significant changes will be made clear on the website.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      lastUpdated="23 November 2026"
      lastUpdatedIso="2026-11-23"
      intro="We collect as little personal information as we can, use it only to talk to you and work with you, and never sell it."
      sections={sections}
    />
  );
}
