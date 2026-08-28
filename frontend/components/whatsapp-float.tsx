"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const href = buildWhatsAppUrl(
    "مرحبًا، أريد الاستفسار عن المركبات المتوفرة لديكم."
  );
  const copy = language === "ar"
    ? { title: "تحتاج مساعدة؟", action: "ادخل للواتساب واحكي معنا", label: "تواصل معنا عبر واتساب" }
    : { title: "Need help?", action: "Chat with us on WhatsApp", label: "Chat with us on WhatsApp" };

  if (pathname.startsWith("/voitures/") || pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  return (
    <div className="whatsapp-float-shell fixed bottom-4 right-4 z-50 flex items-end gap-2 sm:bottom-5 sm:right-5">
      <div className="whatsapp-robot-callout pointer-events-none hidden items-end sm:flex" aria-hidden="true">
        <div className="mb-4 max-w-[220px] rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-start shadow-xl dark:border-emerald-500/25 dark:bg-zinc-900">
          <p className="text-xs font-black text-zinc-950 dark:text-white">{copy.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-emerald-700 dark:text-emerald-300">{copy.action}</p>
        </div>
        <WhatsAppArrow />
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-floating-button pointer-events-auto flex min-h-14 min-w-14 items-center justify-center rounded-full bg-[#25D366] px-4 text-white shadow-[0_14px_36px_rgba(37,211,102,.35)] transition hover:scale-110 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label={copy.label}
      >
        <span className="hidden pe-2 text-sm font-extrabold sm:inline">WhatsApp</span>
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function WhatsAppArrow() {
  return (
    <svg className="whatsapp-pointer-arrow h-20 w-28 shrink-0" viewBox="0 0 150 100" role="presentation">
      <g className="whatsapp-arrow-motion">
        <path d="M10 78C48 83 59 31 112 40" fill="none" stroke="white" strokeLinecap="round" strokeWidth="20" opacity=".95" />
        <path d="M10 78C48 83 59 31 112 40" fill="none" stroke="#25D366" strokeLinecap="round" strokeWidth="11" />
        <path d="m101 17 39 25-41 22 10-23Z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="9" />
        <path d="m101 17 39 25-41 22 10-23Z" fill="#25D366" stroke="#25D366" strokeLinejoin="round" strokeWidth="3" />
        <circle cx="12" cy="78" r="8" fill="#c1121f" stroke="white" strokeWidth="4" />
      </g>
    </svg>
  );
}
