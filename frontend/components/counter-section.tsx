"use client";

import { Clock3, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";

const stats = [
  {
    value: "120+",
    label: "ملف بيع ومعاينة تم ترتيبه باحتراف",
    icon: Sparkles
  },
  {
    value: "14",
    label: "سوقًا ووجهة شحن نتعامل معها بمرونة",
    icon: Globe2
  },
  {
    value: "48h",
    label: "متوسط الرد الأولي على الاستفسارات الجادة",
    icon: Clock3
  },
  {
    value: "100%",
    label: "تركيز على الوضوح في المعاينة والتأكيد",
    icon: ShieldCheck
  }
];

export function CounterSection() {
  return (
    <section className="section-spacing">
      <div className="container-premium">
        <Reveal className="max-w-3xl">
          <p className="gradient-text text-xs font-semibold uppercase tracking-[0.34em] sm:text-sm">
            أرقام تبني الثقة
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 transition-colors dark:text-white sm:text-4xl lg:text-5xl">
            مؤشرات سريعة تلخص أسلوب العمل في ALHADUNI CARS
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.label} delay={0.05 * index}>
                <article className="h-full rounded-[30px] border border-zinc-200/70 bg-white/90 p-6 shadow-premium transition-colors dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-brand sm:text-4xl">{item.value}</p>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300">{item.label}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
