import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("followup");

export default function FollowUpPage() {
  return <ServicePage id="followup" />;
}
