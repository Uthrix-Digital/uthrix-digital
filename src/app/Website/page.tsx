import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("website");

export default function WebsitePage() {
  return <ServicePage id="website" />;
}
