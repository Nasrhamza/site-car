import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { GuidePreview } from "@/components/guide-preview";
import {
  COMPANY_NAME,
  GUIDE_PAGES,
  buildWhatsAppUrl
} from "@/lib/company";

export const metadata: Metadata = {
  title: `الدليل | ${COMPANY_NAME}`,
  description:
    "دليل عربي واضح يشرح خطوات الشراء الآمن من المعاينة الميدانية إلى الفاتورة الرسمية والشحن والمتابعة."
};

export default function GuidePage() {
  const mainGuide = GUIDE_PAGES[0];

  return (
    <div className="container-premium section-spacing">
      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">الدليل</p>
            <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
              مقال عملي يشرح كيفاش تتم العملية من البداية للنهاية
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {mainGuide.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl(mainGuide.ctaMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              تحدث معنا على واتساب
            </a>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/10"
            >
              افتح المعرض
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <GuidePreview />
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {mainGuide.highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900"
          >
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
