import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("social");

export default function SocialContentPage() {
  return <ServicePage id="social" />;
}
