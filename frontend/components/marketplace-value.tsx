"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Globe2, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/lib/site-language";

export function MarketplaceValue() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const copy = ar ? {
    eyebrow: "من دبي إلى وجهتك", title: "سيارتك القادمة، باختيار أوضح وثقة أكبر.", body: "نجمع لك سيارات مختارة في دبي مع معلومات دقيقة، صور واضحة، تواصل مباشر ومتابعة حتى إتمام العملية.", cta: "استكشف السيارات", link: "كيف نعمل", points: ["إعلانات موثقة", "معلومات شفافة", "متابعة التصدير والشحن"]
  } : {
    eyebrow: "From Dubai to your destination", title: "Your next vehicle, selected with clarity and confidence.", body: "Discover carefully selected vehicles in Dubai with clear information, detailed photos, direct contact, and support through every step.", cta: "Explore vehicles", link: "How it works", points: ["Verified listings", "Clear information", "Export and shipping support"]
  };
  const icons = [BadgeCheck, ShieldCheck, Truck];

  return <section className="container-premium py-10 sm:py-14">
    <div className="relative min-h-[470px] overflow-hidden rounded-[34px] bg-zinc-950 shadow-[0_30px_90px_rgba(15,23,42,.2)]">
      <Image src="/brand/alhadunicars-marketplace-hero.png" alt="Premium vehicles presented by ALHADUNICARS in Dubai" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 1280px" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10 rtl:bg-gradient-to-l" />
      <div className="relative flex min-h-[470px] max-w-2xl flex-col justify-center p-7 text-white sm:p-12 lg:p-16">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] backdrop-blur"><Globe2 className="h-4 w-4 text-brand" />{copy.eyebrow}</span>
        <h2 className="mt-6 text-3xl font-black leading-tight sm:text-5xl">{copy.title}</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">{copy.body}</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/catalogue" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark">{copy.cta}<ArrowUpRight className="h-4 w-4" /></Link><Link href="/guide" className="inline-flex items-center rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20">{copy.link}</Link></div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">{copy.points.map((point, index) => { const Icon = icons[index]; return <div key={point} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/25 px-3 py-3 text-xs font-bold backdrop-blur"><Icon className="h-4 w-4 shrink-0 text-emerald-400" />{point}</div>; })}</div>
      </div>
    </div>
  </section>;
}
