"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, CarFront, FileCheck2, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

const content = {
  en: {
    eyebrow: "Simple process",
    title: "Buying a car, made clear.",
    text: "From your first search to delivery, we keep every step easy to understand.",
    catalogue: "Browse cars",
    whatsapp: "Talk on WhatsApp",
    steps: [
      ["1", "Browse available cars", "Use the catalogue and filters to find a car that fits your needs and budget.", Search],
      ["2", "Ask for details", "Send us a WhatsApp message to confirm availability, specifications, price, and photos.", MessageCircle],
      ["3", "Review and agree", "We share the documents and the final terms with you before you make a decision.", FileCheck2],
      ["4", "Complete the purchase", "Once everything is approved, we help you finalize the sale and delivery process.", CarFront]
    ],
    noteTitle: "Clear and direct",
    noteText: "Questions before buying? We are available on WhatsApp to help you choose with confidence."
  },
  ar: {
    eyebrow: "خطوات بسيطة",
    title: "شراء السيارة بكل وضوح.",
    text: "من أول بحث إلى إتمام التسليم، نوضح لك كل مرحلة بطريقة سهلة.",
    catalogue: "عرض السيارات",
    whatsapp: "تحدث معنا عبر واتساب",
    steps: [
      ["١", "ابحث عن السيارة المناسبة", "استعمل المعرض والفلاتر لاختيار السيارة التي تناسب احتياجك وميزانيتك.", Search],
      ["٢", "اطلب التفاصيل", "راسلنا عبر واتساب للتأكد من التوفر والمواصفات والسعر والصور.", MessageCircle],
      ["٣", "راجع واتفق", "نشارك معك الوثائق والشروط النهائية قبل أن تأخذ قرارك.", FileCheck2],
      ["٤", "أكمل عملية الشراء", "بعد الموافقة نساعدك لإتمام البيع وترتيب التسليم.", CarFront]
    ],
    noteTitle: "وضوح وتواصل مباشر",
    noteText: "عندك سؤال قبل الشراء؟ نحن متوفرون على واتساب لمساعدتك في الاختيار بثقة."
  }
} as const;

export function GuidePageClient() {
  const { language } = useLanguage();
  const copy = content[language];

  return (
    <main className="bg-zinc-50">
      <section className="border-b border-zinc-200 bg-zinc-950 py-14 text-white sm:py-20">
        <div className="container-premium max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-brand" /> {copy.eyebrow}
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">{copy.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/catalogue" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
              {copy.catalogue}<ArrowRight className="h-4 w-4" />
            </Link>
            <a href={buildWhatsAppUrl(language === "ar" ? "مرحباً، أريد معرفة خطوات شراء سيارة." : "Hello, I would like to know the steps to buy a car.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <MessageCircle className="h-4 w-4 text-green-400" />{copy.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <section className="container-premium py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {copy.steps.map(([number, title, description, Icon]) => (
            <article key={number} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-base font-bold text-white">{number}</span>
                <div>
                  <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-brand" /><h2 className="font-semibold text-zinc-950">{title}</h2></div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2 font-semibold text-zinc-950"><BadgeCheck className="h-5 w-5 text-brand" />{copy.noteTitle}</div><p className="mt-2 text-sm text-zinc-600">{copy.noteText}</p></div>
          <a href={buildWhatsAppUrl(language === "ar" ? "مرحباً، أحتاج مساعدة لاختيار سيارة." : "Hello, I need help choosing a car.")} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600"><MessageCircle className="h-4 w-4" />{copy.whatsapp}</a>
        </div>
      </section>
    </main>
  );
}
