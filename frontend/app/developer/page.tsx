import type { Metadata } from "next";
import { DeveloperProfile } from "@/components/developer-profile";
import { DEVELOPER_NAME, getDeveloperSchema, getSiteUrl } from "@/lib/company";

export const metadata: Metadata = {
  title: `${DEVELOPER_NAME} — ALHADUNICARS Developer`,
  description: "Hamza Nasr (حمزة نصر), designer and developer of ALHADUNICARS. Phone: +216 28 260 802. Contact via WhatsApp or Facebook.",
  alternates: { canonical: "/developer" },
  openGraph: {
    title: `${DEVELOPER_NAME} — ALHADUNICARS Developer`,
    description: "The developer behind ALHADUNICARS. Get in touch directly.",
    url: "/developer"
  }
};

export default function DeveloperPage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${getSiteUrl()}/developer#profile`,
    url: `${getSiteUrl()}/developer`,
    name: "Hamza Nasr — Developer of ALHADUNICARS",
    mainEntity: getDeveloperSchema(),
    isPartOf: { "@id": `${getSiteUrl()}/#website` }
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema).replace(/</g, "\\u003c") }} />
    <DeveloperProfile />
  </>;
}
