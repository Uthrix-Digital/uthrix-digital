import type { Metadata } from "next";
import {
  ServicePage,
  getServiceMetadata,
} from "@/components/shared/(ServicePage)/ServicePage";

export const metadata: Metadata = getServiceMetadata("strategy");

export default function BusinessStrategyPage() {
  return <ServicePage id="strategy" />;
}
