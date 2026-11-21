import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("ads");

export default function MetaGoogleAdsPage() {
  return <ServicePage id="ads" />;
}
