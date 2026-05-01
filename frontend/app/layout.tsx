import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { COMPANY_DESCRIPTION, COMPANY_NAME, COMPANY_SUBTITLE, getSiteUrl } from "@/lib/company";

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_NAME} | ${COMPANY_SUBTITLE}`,
    template: `%s | ${COMPANY_NAME}`
  },
  description: COMPANY_DESCRIPTION,
  metadataBase: new URL(getSiteUrl()),
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
    description: COMPANY_DESCRIPTION,
    url: "/",
    siteName: COMPANY_NAME
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
