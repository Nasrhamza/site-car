"use client";

import Image from "next/image";
import { ArrowRight, FileCheck2, Globe2, MessageCircle, Ship } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function HomeGlobalExport() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const ar = language === "ar";
  const destinations = ar
    ? ["دول الخليج", "أفريقيا", "أوروبا", "آسيا"]
    : ["GCC", "Africa", "Europe", "Asia"];

  return (
    <section className="overflow-hidden bg-white py-12 transition-colors dark:bg-zinc-950 sm:py-16">
      <div className="container-premium">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-[#172f3b] via-[#0b202c] to-[#050c15] px-5 py-7 text-white shadow-[0_28px_80px_rgba(32,55,70,.22)] sm:px-8 sm:py-9 lg:px-10"
        >
          <div className="premium-grid absolute inset-0 -z-10 opacity-30" />
          <div className="absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/25 blur-[90px]" />
          <div className="absolute -bottom-28 right-0 -z-10 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]" />

          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-white/80">
                <Globe2 className="h-4 w-4 text-emerald-400" />
                {ar ? "تصدير عالمي من دبي" : "Worldwide export from Dubai"}
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl lg:text-[2.7rem]">
                {ar ? "سيارتك تنطلق من دبي إلى وجهتك." : "Your vehicle, from Dubai to your destination."}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                {ar
                  ? "نتابع معك الوثائق، إجراءات التصدير، وترتيب الشحن إلى مختلف دول العالم بخطوات واضحة."
                  : "We coordinate documents, export procedures, and worldwide shipping with clear follow-up at every step."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {destinations.map((destination) => (
                  <span key={destination} className="rounded-full border border-white/10 bg-white/[.07] px-3 py-1.5 text-xs font-bold text-white/70">
                    {destination}
                  </span>
                ))}
              </div>

              <a
                href={buildWhatsAppUrl(ar ? "مرحباً، أريد عرض سعر لتصدير وشحن سيارة إلى بلدي." : "Hello, I would like a quote to export and ship a vehicle to my country.")}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(16,185,129,.24)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                <MessageCircle className="h-5 w-5" />
                {ar ? "اطلب عرض التصدير" : "Request an export quote"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-4 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/40">{ar ? "نقطة الانطلاق" : "Departure"}</p>
                  <p className="mt-1 text-lg font-black">{ar ? "دبي" : "Dubai"}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-emerald-400">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div className="text-end">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/40">{ar ? "الوجهة" : "Destination"}</p>
                  <p className="mt-1 text-lg font-black">{ar ? "كل العالم" : "Worldwide"}</p>
                </div>
              </div>

              <div className="relative my-5 text-center sm:my-7">
                <div className="relative mx-auto aspect-square w-full max-w-[240px] sm:max-w-[280px]">
                  <div aria-hidden="true" className="absolute inset-8 rounded-full bg-cyan-400/15 blur-3xl" />
                  <Image src="/brand/worldwide-export-globe.webp" alt={ar ? "الكرة الأرضية — تصدير السيارات من دبي إلى العالم" : "Digital globe — vehicle export from Dubai to the world"} width={480} height={480} unoptimized className="export-globe-float relative h-full w-full object-contain mix-blend-screen" />
                </div>
                <motion.div
                  key={language}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="relative -mt-1 pb-2"
                >
                  <h3 className={`export-world-caption text-3xl leading-tight sm:text-4xl ${ar ? "font-semibold" : "font-serif italic"}`}>
                    {ar ? "تصدير بلا حدود." : "Export without borders."}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs text-xs leading-6 tracking-wide text-cyan-100/60 sm:text-sm">
                    {ar ? "من دبي إلى العالم. وثائق، تصدير وشحن، خطوة بخطوة." : "From Dubai to the world. Documents, export and shipping, every step of the way."}
                  </p>
                </motion.div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
                  <FileCheck2 className="h-5 w-5 shrink-0 text-brand-gold" />
                  <span className="text-xs font-bold text-white/75">{ar ? "وثائق وإجراءات واضحة" : "Clear export documents"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
                  <Ship className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span className="text-xs font-bold text-white/75">{ar ? "متابعة الشحن حتى الوجهة" : "Shipping follow-up to destination"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#030609] px-5 py-9 text-center text-white shadow-premium sm:px-10 sm:py-12"
        >
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-cyan-300 sm:text-xs">{ar ? "نخدمك أينما كنت" : "Our reach. Your world."}</p>
          <h2 className={`mx-auto mt-4 max-w-3xl text-3xl leading-tight sm:text-5xl ${ar ? "font-bold" : "font-serif"}`}>
            {ar ? "من دبي. نخدم عملاءنا حول العالم." : "Based in Dubai. Serving customers worldwide."}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            {ar ? "أينما كانت وجهتك، تواصل مع فريقنا في دبي لاختيار سيارتك وتنسيق وثائق التصدير والشحن." : "Wherever your destination, connect with our Dubai team for your next vehicle, export documents and shipping support."}
          </p>
          <Image src="/brand/worldwide-export-map.webp" alt={ar ? "خريطة العالم توضّح خدمة عملائنا في مختلف القارات" : "Dotted world map representing our worldwide customer service and export reach"} width={1703} height={960} unoptimized className="export-world-map mx-auto my-6 h-auto w-full max-w-4xl object-contain mix-blend-screen sm:my-8" />
          <div className="flex flex-wrap justify-center gap-2">
            {(ar ? ["الشرق الأوسط", "أفريقيا", "أوروبا", "آسيا", "الأمريكتان", "أوقيانوسيا"] : ["Middle East", "Africa", "Europe", "Asia", "Americas", "Oceania"]).map((region) => <span key={region} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">{region}</span>)}
          </div>
          <a href={buildWhatsAppUrl(ar ? "مرحباً، أريد معرفة خيارات تصدير سيارة إلى وجهتي." : "Hello, I would like to discuss vehicle export options to my destination.")} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-6 py-3 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            {ar ? "أخبرنا بوجهتك" : "Tell us your destination"}<ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
