import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudiencePage } from "@/components/shared/(AudiencePage)/AudiencePage";
import { AUDIENCES, AUDIENCE_ORDER, isAudienceId } from "@/config/audiences";
import { HospitalityPage } from "./_components/hospitality/HospitalityPage";
import { ProductSellersPage } from "./_components/product-sellers/ProductSellersPage";

export const instant = false;

interface AudienceRouteProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return AUDIENCE_ORDER.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: AudienceRouteProps): Promise<Metadata> {
  const { type } = await params;
  if (!isAudienceId(type)) return {};

  const audience = AUDIENCES[type];
  return {
    title: `${audience.label} | Uthrix Digital`,
    description: audience.metaDescription,
  };
}

export default async function AudienceRoute({ params }: AudienceRouteProps) {
  const { type } = await params;
  if (!isAudienceId(type)) notFound();

  if (type === "hospitality") return <HospitalityPage />;
  if (type === "product-sellers") return <ProductSellersPage />;
  return <AudiencePage id={type} />;
}
