import type { Metadata } from "next";
import { GuidePageClient } from "@/components/guide-page-client";

export const metadata: Metadata = {
  title: "How it works | ALHADUNICARS",
  description: "A simple guide to buying a car with ALHADUNICARS."
};

export default function GuidePage() {
  return <GuidePageClient />;
}
