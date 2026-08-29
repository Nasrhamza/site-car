"use client";

import { ArrowRight, FileCheck2, Globe2, MessageCircle, Plane, Ship } from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function HomeGlobalExport() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const destinations = ar
    ? ["دول الخليج", "أفريقيا", "أوروبا", "آسيا"]
    : ["GCC", "Africa", "Europe", "Asia"];

  return (
    <section className="overflow-hidden bg-white py-12 transition-colors dark:bg-zinc-950 sm:py-16">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="relative isolate overflow-hidden rounded-[32px] bg-[#203746] px-5 py-7 text-white shadow-[0_28px_80px_rgba(32,55,70,.22)] sm:px-8 sm:py-9 lg:px-10"
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
                  <p className="mt-1 text-lg font-black">Dubai</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-emerald-400">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div className="text-end">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/40">{ar ? "الوجهة" : "Destination"}</p>
                  <p className="mt-1 text-lg font-black">{ar ? "كل العالم" : "Worldwide"}</p>
                </div>
              </div>

              <div className="export-flight-route relative mt-7 h-32" aria-label={ar ? "مسار تصدير من دبي إلى العالم" : "Export route from Dubai to the world"}>
                <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/20" />
                <div className="export-flight-progress absolute left-5 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-brand via-red-400 to-emerald-400" />
                <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-[#203746] bg-brand shadow-[0_0_0_3px_rgba(255,255,255,.13)]" />
                <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-[#203746] bg-emerald-400 shadow-[0_0_0_3px_rgba(255,255,255,.13)]" />
                <div className="export-flight-plane absolute left-7 top-1/2 z-10 grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-white text-[#203746] shadow-[0_16px_32px_rgba(0,0,0,.28)]">
                  <Plane className="h-7 w-7 rotate-45 text-brand" />
                </div>
                <span className="export-flight-cloud absolute left-[34%] top-2 h-5 w-14 rounded-full bg-white/10 before:absolute before:-top-2 before:left-2 before:h-7 before:w-7 before:rounded-full before:bg-white/10 after:absolute after:-top-3 after:right-2 after:h-8 after:w-8 after:rounded-full after:bg-white/10" />
                <span className="export-flight-cloud export-flight-cloud-delay absolute bottom-2 right-[24%] h-4 w-12 rounded-full bg-white/[.07] before:absolute before:-top-2 before:left-2 before:h-6 before:w-6 before:rounded-full before:bg-white/[.07] after:absolute after:-top-2 after:right-1 after:h-6 after:w-6 after:rounded-full after:bg-white/[.07]" />
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
      </div>
    </section>
  );
}
