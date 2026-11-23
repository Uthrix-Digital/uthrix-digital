import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan your growth path | Uthrix Digital",
  description:
    "Connect the services your business needs, from strategy and branding to websites, ads, SEO and follow-up, into one growth path built around a single goal.",
  alternates: { canonical: "/growth-map" },
};

export default function GrowthMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
