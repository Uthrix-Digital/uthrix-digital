import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("brand");

export default function BrandIdentityPage() {
  return <ServicePage id="brand" />;
}
