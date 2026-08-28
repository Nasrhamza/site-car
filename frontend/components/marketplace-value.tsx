"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Globe2, Search, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/lib/site-language";

export function MarketplaceValue() {
  const { language, t } = useLanguage();
  const ar = language === "ar";
  const copy = ar ? {
    eyebrow: "من دبي إلى جميع أنحاء العالم", title: "نصدّر سيارتك من دبي إلى وجهتك أينما كنت.", body: "سيارات مختارة، معلومات دقيقة، صور واضحة ودعم كامل في الوثائق والتصدير والشحن إلى مختلف دول العالم.", cta: "استكشف السيارات", link: "اطلب عرض شحن", points: ["إعلانات موثقة", "تصدير عالمي", "دعم الشحن والوثائق"]
  } : {
    eyebrow: "From Dubai to the world", title: "We export your next vehicle worldwide.", body: "Explore carefully selected vehicles in Dubai with clear information and end-to-end support for documents, export, and shipping to destinations around the world.", cta: "Explore vehicles", link: "Request shipping quote", points: ["Verified listings", "Worldwide export", "Shipping and document support"]
  };
  const icons = [BadgeCheck, ShieldCheck, Truck];

  return <section className="relative isolate mb-8 min-h-[650px] overflow-hidden bg-zinc-950 text-white shadow-[0_24px_70px_rgba(15,23,42,.12)] sm:mb-12 sm:min-h-[700px]">
      <div className="absolute inset-0">
        <Image src="/brand/alhadunicars-marketplace-hero.png" alt="Premium vehicles presented by ALHADUNICARS in Dubai" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 1280px" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10 rtl:bg-gradient-to-l" />
      </div>

      <div className="container-premium absolute inset-x-0 top-5 z-20 sm:top-7">
        <form action="/catalogue" method="get" className="mx-auto w-full max-w-5xl rounded-[22px] border border-white/20 bg-black/65 p-2 shadow-[0_16px_45px_rgba(0,0,0,.32)] backdrop-blur-xl">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 rtl:left-auto rtl:right-4" />
              <input name="search" placeholder={t.search} className="h-14 w-full rounded-2xl border-0 bg-white px-12 text-sm font-medium text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:ring-2 focus:ring-brand/40" />
            </label>
            <button type="submit" className="button-glow inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand px-7 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark">{t.searchButton}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>
          </div>
        </form>
      </div>

      <div className="container-premium relative flex min-h-[650px] items-center pb-14 pt-32 sm:min-h-[700px] sm:pb-16 sm:pt-36">
        <div className="w-full max-w-5xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] backdrop-blur"><Globe2 className="h-4 w-4 text-brand" />{copy.eyebrow}</span>
          <h2 className="mt-6 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-.04em] sm:text-6xl">{copy.title}</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-lg sm:leading-8">{copy.body}</p>
        <div className="mt-4 flex flex-wrap gap-3"><Link href="/catalogue" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark">{copy.cta}<ArrowUpRight className="h-4 w-4" /></Link><Link href="/contact" className="inline-flex items-center rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20">{copy.link}</Link></div>
        <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-3">{copy.points.map((point, index) => { const Icon = icons[index]; return <div key={point} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/25 px-3 py-3 text-xs font-bold backdrop-blur"><Icon className="h-4 w-4 shrink-0 text-emerald-400" />{point}</div>; })}</div>
        </div>
      </div>
    </section>;
}
