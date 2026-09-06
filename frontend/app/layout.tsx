import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { BottomRadialNav } from "@/components/bottom-radial-nav";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import {
  COMPANY_FACEBOOK_URL,
  COMPANY_NAME,
  COMPANY_WHATSAPP_PHONE,
  getSiteUrl
} from "@/lib/company";

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_NAME} | Find your next car`,
    template: `%s | ${COMPANY_NAME}`
  },
  description: "A simple Dubai car marketplace. Browse cars and contact the team directly.",
  metadataBase: new URL(getSiteUrl()),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: [
      { url: "/alhaduni-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/alhaduni-icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: "/alhaduni-icon-192.png",
    shortcut: "/alhaduni-icon-32.png"
  },
  openGraph: {
    title: COMPANY_NAME,
    description: "A simple Dubai car marketplace. Browse cars and contact the team directly.",
    images: ["/og.png"],
    url: "/",
    siteName: COMPANY_NAME
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = getSiteUrl();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: COMPANY_NAME,
    url: siteUrl,
    logo: `${siteUrl}/alhaduni-logo.jpg`,
    image: `${siteUrl}/og.png`,
    telephone: `+${COMPANY_WHATSAPP_PHONE}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE"
    },
    sameAs: [COMPANY_FACEBOOK_URL]
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c")
          }}
        />
        <Providers>
          <AnalyticsTracker />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          <BottomRadialNav />
        </Providers>
      </body>
    </html>
  );
}
