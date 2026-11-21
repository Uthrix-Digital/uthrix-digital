import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("seo");

export default function SeoPage() {
  return <ServicePage id="seo" />;
}
