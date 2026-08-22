"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock3, Globe2, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/lib/site-language";

export function HomeTrust({ totalCars = 0 }: { totalCars?: number }) {
  const { language } = useLanguage();
  const ar = language === "ar";
  const cards = ar ? [
    { title: "معلومات واضحة", text: "صور، مواصفات وأسعار منظمة تساعدك على المقارنة بسرعة.", icon: ShieldCheck },
    { title: "تواصل مباشر", text: "تحدث معنا مباشرة عبر واتساب دون خطوات معقدة.", icon: MessageCircle },
    { title: "متابعة كاملة", text: "نبقى معك من اختيار المركبة إلى الشحن والاستلام.", icon: Truck }
  ] : [
    { title: "Clear information", text: "Organized photos, specifications, and pricing that make comparison easy.", icon: ShieldCheck },
    { title: "Direct support", text: "Talk to our team on WhatsApp without unnecessary steps.", icon: MessageCircle },
    { title: "End-to-end follow-up", text: "Support from vehicle selection through shipping and delivery.", icon: Truck }
  ];

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-14 text-white sm:py-20">
      <div className="premium-grid absolute inset-0 opacity-25" />
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand/25 blur-[110px]" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-gold/15 blur-[110px]" />
      <div className="container-premium relative">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.65 }} className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-brand-gold"><BadgeCheck className="h-4 w-4" />{ar ? "لماذا ALHADUNICARS؟" : "Why ALHADUNICARS?"}</span>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-.04em] sm:text-5xl">{ar ? "الثقة ليست إضافة. إنها أساس كل صفقة." : "Trust is not an extra. It is the foundation."}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/60 sm:text-base">{ar ? "نبني تجربة واضحة وسريعة تساعدك على اتخاذ القرار بثقة، مع فريق حقيقي جاهز للإجابة والمتابعة." : "A clear, fast experience designed to help you decide with confidence, backed by a real team ready to answer and follow up."}</p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return <motion.article key={card.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, delay: index * 0.08 }} whileHover={{ y: -7 }} className="rounded-[26px] border border-white/10 bg-white/[.06] p-6 backdrop-blur-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-zinc-950"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-5 text-xl font-black">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{card.text}</p>
            </motion.article>;
          })}
        </div>

        <motion.div initial={{ opacity: 0, scale: .98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="mt-5 grid grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-[26px] border border-white/10 bg-black/25 sm:grid-cols-4 rtl:divide-x-reverse">
          {[
            { value: totalCars ? `${totalCars}+` : "New", label: ar ? "مركبات متوفرة" : "vehicles available", icon: BadgeCheck },
            { value: "24/7", label: ar ? "تصفح في أي وقت" : "browse anytime", icon: Clock3 },
            { value: "Dubai", label: ar ? "الإمارات العربية" : "United Arab Emirates", icon: Globe2 },
            { value: "Direct", label: ar ? "دعم عبر واتساب" : "WhatsApp support", icon: MessageCircle }
          ].map((stat) => { const Icon = stat.icon; return <div key={stat.value} className="p-5 sm:p-6"><Icon className="h-4 w-4 text-brand-gold" /><p className="mt-3 text-2xl font-black sm:text-3xl">{stat.value}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-[.1em] text-white/40 sm:text-xs">{stat.label}</p></div>; })}
        </motion.div>
      </div>
    </section>
  );
}
