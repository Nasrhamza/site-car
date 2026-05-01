import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";

const items = [
  {
    name: "سنية",
    role: "شراء سيارة خفيفة",
    text: "الخدمة كانت واضحة من البداية، والصور الموثقة والمعاينة خلتني نأخذ القرار وأنا مطمئنة فعلًا."
  },
  {
    name: "كريم",
    role: "اقتناء مركبة نفعية",
    text: "الملف كان مرتب، والردود سريعة، والمتابعة على واتساب وفرت عليّ وقتًا كبيرًا قبل التأكيد."
  },
  {
    name: "أميرة",
    role: "استيراد وشحن",
    text: "من الفاتورة إلى الشحن، كل خطوة كانت مفهومة وواضحة. هذا بالضبط النوع من الاحتراف الذي كنت أبحث عنه."
  }
];

export function Testimonials({ compact = false }: { compact?: boolean }) {
  const content = (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal
          key={item.name}
          delay={0.05 * index}
          className={index === 0 ? "lg:col-span-2" : undefined}
        >
          <article className="relative h-full overflow-hidden rounded-[32px] border border-zinc-200/80 bg-gradient-to-br from-white via-white to-zinc-50 p-6 shadow-premium ring-1 ring-black/5 transition-colors dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 dark:ring-white/5 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_30%)]" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-brand/30" />
              </div>

              <p className="mt-6 text-base leading-8 text-zinc-700 transition-colors dark:text-zinc-200">
                &quot;{item.text}&quot;
              </p>

              <div className="mt-8 border-t border-zinc-200/80 pt-4 transition-colors dark:border-white/10">
                <p className="text-lg font-bold text-zinc-950 transition-colors dark:text-white">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500 transition-colors dark:text-zinc-400">{item.role}</p>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );

  if (compact) return content;

  return (
    <section className="section-spacing bg-zinc-50 transition-colors dark:bg-zinc-950">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">
            آراء العملاء
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 transition-colors dark:text-white">
            تجارب حقيقية تعكس طريقة العمل
          </h2>
        </div>
        {content}
      </div>
    </section>
  );
}
