import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "../_components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Use | UthriX Digital",
  description:
    "The terms that apply when you use the UthriX Digital website, send us an enquiry or book a call with our team.",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Agreeing to these terms",
    paragraphs: [
      "These terms apply to your use of the UthriX Digital website. By using the site, you agree to them. If you do not agree, please do not use the site.",
    ],
  },
  {
    id: "about-the-site",
    title: "What this website is for",
    paragraphs: [
      "This website describes our marketing, design and software development services and lets you contact us or book a call. The content is general information, not professional advice for your specific situation, and it is not an offer that can be accepted to form a contract.",
    ],
  },
  {
    id: "client-work",
    title: "Working with us",
    paragraphs: [
      "Any project we take on is covered by a separate written proposal or agreement that sets out the scope, timeline, price and payment terms. If that agreement and these terms say different things, the agreement applies to the project.",
    ],
  },
  {
    id: "enquiries-and-bookings",
    title: "Enquiries and call bookings",
    paragraphs: [
      "When you send an enquiry or book a call, you agree to give accurate information and to use your own contact details, or details you have permission to share. A booked call is a free, no-obligation conversation. Please let us know if you need to cancel or reschedule. We may decline or cancel a booking if we cannot attend or if a submission looks automated or abusive.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: ["When you use this website, you agree not to:"],
    items: [
      "Break any law or infringe anyone else's rights.",
      "Send spam or submit forms using automated tools.",
      "Try to gain unauthorised access to the site, its servers or its data.",
      "Introduce malware or do anything that disrupts or overloads the site.",
      "Copy or scrape the site's content for commercial use without our permission.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      "The text, design, graphics, logos and code on this website belong to UthriX Digital or our licensors. You may view the site and share links to it. You may not reproduce, modify or republish its content without our written permission.",
      "Client names, logos and project materials shown in our case studies remain the property of their owners.",
    ],
  },
  {
    id: "case-studies",
    title: "Case studies and results",
    paragraphs: [
      "Results described on this website come from specific projects. They depend on many factors, including the market, budget and the client's own business, and they are not a promise that your project will achieve the same outcome.",
    ],
  },
  {
    id: "third-party-links",
    title: "Third-party links and services",
    paragraphs: [
      "This website links to third-party websites and services, such as WhatsApp and social media platforms. We do not control them and are not responsible for their content, availability or practices.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      "We work to keep this website accurate and available, but it is provided “as is”. We do not guarantee that it will always be available, free of errors or fully up to date, and we may change or remove content at any time.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the extent the law allows, UthriX Digital is not liable for any indirect or consequential loss, or for loss of profit, revenue or data, that results from your use of this website or from relying on its content. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    paragraphs: [
      "Our privacy policy explains how we handle the personal information you share with us through this website. It forms part of these terms.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of Sri Lanka. Any dispute about them or about your use of this website will be handled by the courts of Sri Lanka.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The “last updated” date at the top of this page shows when they last changed. If you keep using the site after a change, you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of use"
      lastUpdated="13 November 2026"
      lastUpdatedIso="2026-11-13"
      intro="The short version: use this website fairly, and any project we do together is covered by its own written agreement."
      sections={sections}
    />
  );
}
