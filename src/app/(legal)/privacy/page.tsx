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
      "This website does not currently use advertising or analytics cookies. We store a small amount of information in your browser, such as your light or dark theme preference, so the site works the way you left it. This stays on your device and is not used to identify you.",
      "If we add analytics or advertising tools in future, we will update this policy before they are switched on.",
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
      lastUpdated="13 November 2026"
      lastUpdatedIso="2026-11-13"
      intro="We collect as little personal information as we can, use it only to talk to you and work with you, and never sell it."
      sections={sections}
    />
  );
}
