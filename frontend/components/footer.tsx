"use client";

import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  COMPANY_NAME,
  COMPANY_WHATSAPP_DISPLAY,
  buildWhatsAppUrl
} from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function Footer() {
  const { language, t } = useLanguage();
  const navLinks = [
    { href: "/", label: t.nav[0] },
    { href: "/catalogue", label: t.nav[1] },
    { href: "/contact", label: t.nav[2] }
  ];

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-900">
      <div className="container-premium grid gap-8 py-12 md:grid-cols-4">
        <div>
          <BrandLogo className="h-20 w-20" />
          <p className="mt-4 text-sm leading-7 text-zinc-600">{t.footerText}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {language === "ar" ? "التنقل" : "Navigation"}
          </h4>
          <div className="mt-4 grid gap-2 text-sm text-zinc-700">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-brand">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">{language === "ar" ? "معلومات" : "Information"}</h4>
          <div className="mt-4 grid gap-2 text-sm text-zinc-700">
            <Link href="/mentions-legales" className="transition hover:text-brand">
              {language === "ar" ? "الشروط القانونية" : "Legal notice"}
            </Link>
            <Link href="/confidentialite" className="transition hover:text-brand">
              {language === "ar" ? "الخصوصية" : "Privacy policy"}
            </Link>
            <Link href="/cookies" className="transition hover:text-brand">
              {language === "ar" ? "ملفات الارتباط" : "Cookies"}
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.contact}
          </h4>
          <div className="mt-4 grid gap-3 text-sm text-zinc-700">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t.location}
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp {COMPANY_WHATSAPP_DISPLAY}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {language === "ar" ? "معلومات واضحة ومتابعة مباشرة" : "Clear details and direct follow-up"}
            </p>
            <a
              href={buildWhatsAppUrl(language === "ar" ? "مرحباً، أريد مزيداً من المعلومات عن السيارات المتوفرة." : "Hello, I would like more information about the available cars.")}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              {t.contact}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
