import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Careers | UthriX Digital",
  description:
    "Careers at UthriX Digital. Open roles in marketing, design and software development will be listed here.",
  alternates: { canonical: "/careers" },
  // Placeholder page: keep it out of search results until real content ships.
  robots: { index: false, follow: true },
};

export default function CareersPage() {
  return (
    <ComingSoon
      eyebrow="Careers"
      title="Work with us"
      description="We're putting our careers page together. Open roles will be listed here soon. If you'd like to introduce yourself in the meantime, get in touch."
    />
  );
}
