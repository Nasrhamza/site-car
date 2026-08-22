"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";
import { resolveMediaUrl } from "@/lib/utils";

export function HomeFinalCta({ imageUrl }: { imageUrl?: string }) {
  const { language, t } = useLanguage();
  const ar = language === "ar";
  const image = resolveMediaUrl(imageUrl);

  return (
    <section className="section-spacing overflow-hidden bg-white dark:bg-zinc-950">
      <div className="container-premium">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: .65 }} className="group relative isolate overflow-hidden rounded-[32px] bg-zinc-950 px-6 py-12 text-white shadow-[0_30px_80px_rgba(15,23,42,.18)] sm:px-10 sm:py-16 lg:px-14">
          {image ? <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition duration-[1200ms] group-hover:scale-105" /> : null}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/25 rtl:bg-gradient-to-l" />
          <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-brand/35 blur-[90px]" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.22em] text-brand-gold"><Sparkles className="h-4 w-4" />{ar ? "نحن هنا للمساعدة" : "We are here to help"}</span>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.04em] sm:text-5xl">{ar ? "لم تجد المركبة المناسبة بعد؟" : "Still searching for the right vehicle?"}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">{ar ? "أرسل لنا ما تبحث عنه وسنساعدك في الوصول إلى أفضل اختيار متوفر." : "Tell us what you need and our team will help you find the strongest available match."}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogue" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-100">{t.inventory}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>

              <a href={buildWhatsAppUrl(ar ? "مرحباً، أبحث عن مركبة وأريد المساعدة في الاختيار." : "Hello, I am looking for a vehicle and would like help choosing.")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"><MessageCircle className="h-4 w-4" />{t.whatsapp}</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
