"use client";

import Link from "next/link";
import { ArrowRight, Globe2, MapPin, MessageCircle } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { BrandLogo } from "@/components/brand-logo";
import {
  BODY_TYPE_OPTIONS,
  COMPANY_FACEBOOK_URL,
  COMPANY_NAME,
  COMPANY_WHATSAPP_DISPLAY,
  buildWhatsAppUrl
} from "@/lib/company";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

export function Footer() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const companyLinks = [
    { href: "/a-propos", en: "About us", ar: "من نحن" },
    { href: "/contact", en: "Contact us", ar: "تواصل معنا" },
    { href: "/guide", en: "Buying & export guide", ar: "دليل الشراء والتصدير" },
    { href: "/mentions-legales", en: "Legal notice", ar: "البيانات القانونية" },
    { href: "/confidentialite", en: "Privacy policy", ar: "سياسة الخصوصية" },
    { href: "/cookies", en: "Cookies", ar: "ملفات الارتباط" }
  ];
  const fuelLinks = [
    { value: "Essence", en: "Petrol", ar: "بنزين" },
    { value: "Diesel", en: "Diesel", ar: "ديزل" },
    { value: "Hybride", en: "Hybrid", ar: "هجين" },
    { value: "Électrique", en: "Electric", ar: "كهربائي" },
    { value: "PHEV", en: "PHEV", ar: "PHEV" },
    { value: "REEV", en: "REEV", ar: "REEV" }
  ];

  return (
    <footer className="border-t border-slate-700 bg-[#203746] text-white">
      <div className="container-premium py-12 sm:py-14">
        <div className="grid gap-8 border-b border-white/15 pb-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="max-w-xl">
            <div className="flex items-center gap-4"><BrandLogo className="h-16 w-16" /><div><p className="text-lg font-black">{COMPANY_NAME}</p><p className="text-sm text-white/60">{ar ? "سوق سيارات وتصدير عالمي من دبي" : "Dubai vehicle marketplace & worldwide export"}</p></div></div>
            <p className="mt-5 text-sm leading-7 text-white/70">{ar ? "سيارات مختارة ومعلومات واضحة ودعم مباشر في الوثائق والتصدير والشحن إلى مختلف دول العالم." : "Selected vehicles, clear information, and direct support with documents, export, and worldwide shipping."}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="flex items-center gap-2 text-sm font-extrabold"><Globe2 className="h-5 w-5 text-brand-gold" />{ar ? "هل تريد شحن سيارة إلى بلدك؟" : "Shipping a vehicle to your country?"}</p>
            <a href={buildWhatsAppUrl(ar ? "مرحباً، أريد عرض سعر لتصدير وشحن سيارة إلى بلدي." : "Hello, I would like a quote to export and ship a vehicle to my country.")} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-extrabold transition hover:bg-brand-dark">{ar ? "اطلب عرض شحن" : "Request shipping quote"}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></a>
          </div>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
          <FooterColumn title={ar ? "الشركة" : "Company"}>{companyLinks.map((item) => <Link key={item.href} href={item.href}>{ar ? item.ar : item.en}</Link>)}</FooterColumn>
          <FooterColumn title={ar ? "نوع الهيكل" : "Body type"}>{BODY_TYPE_OPTIONS.slice(0, 8).map((item) => <Link key={item} href={`/catalogue?bodyType=${encodeURIComponent(item)}`}>{translateVehicleValue(item, language)}</Link>)}</FooterColumn>
          <FooterColumn title={ar ? "نوع الوقود" : "Fuel type"}>{fuelLinks.map((item) => <Link key={item.value} href={`/catalogue?fuelType=${encodeURIComponent(item.value)}`}>{ar ? item.ar : item.en}</Link>)}</FooterColumn>
          <FooterColumn title={ar ? "روابط سريعة" : "Quick links"}>
            <Link href="/catalogue">{ar ? "كل السيارات" : "All vehicles"}</Link>
            <Link href="/catalogue?sort=-createdAt">{ar ? "أحدث السيارات" : "Latest vehicles"}</Link>
            <Link href="/guide">{ar ? "خطوات التصدير" : "Export process"}</Link>
            <Link href="/contact">{ar ? "اطلب سيارة" : "Request a vehicle"}</Link>
          </FooterColumn>
          <FooterColumn title={ar ? "تواصل معنا" : "Contact us"}>
            <span className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{ar ? "دبي، الإمارات العربية المتحدة" : "Dubai, United Arab Emirates"}</span>
            <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0" />{COMPANY_WHATSAPP_DISPLAY}</span>
            <div className="mt-2 flex gap-2">
              <a href={COMPANY_FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#1877f2]"><FaFacebookF /></a>
              <a href={buildWhatsAppUrl(ar ? "مرحباً، أريد معلومات عن السيارات المتوفرة." : "Hello, I would like information about the available vehicles.")} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#25D366]"><FaWhatsapp className="h-5 w-5" /></a>
            </div>
          </FooterColumn>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/55">&copy; {new Date().getFullYear()} {COMPANY_NAME}. {ar ? "جميع الحقوق محفوظة." : "All rights reserved."}</div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="text-sm font-extrabold text-white">{title}</h3><div className="mt-4 grid gap-2.5 text-sm text-white/65 [&_a]:transition [&_a:hover]:text-white">{children}</div></div>;
}
