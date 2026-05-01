import { BadgeCheck, Eye, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/reveal";

const trustPoints = [
  {
    title: "معاينة موثقة",
    description: "صور وتفاصيل تساعدك تقرر بثقة قبل أي خطوة.",
    icon: Eye
  },
  {
    title: "شفافية كاملة",
    description: "عرض واضح للمعلومة والسعر وحالة المركبة دون ضبابية.",
    icon: ShieldCheck
  },
  {
    title: "دعم مباشر",
    description: "تواصل سريع عبر واتساب وفريق يجاوبك بوضوح.",
    icon: MessageCircle
  },
  {
    title: "شحن آمن",
    description: "تنسيق ومتابعة حتى تصل المركبة كما تم الاتفاق.",
    icon: Truck
  }
];

export function HomeTrust() {
  return (
    <section className="section-spacing bg-zinc-50/80 transition-colors dark:bg-zinc-950">
      <div className="container-premium grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <Reveal className="rounded-[34px] bg-zinc-950 p-7 text-white shadow-[0_26px_80px_rgba(9,9,11,0.38)] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-gold">
            لماذا ALHADUNI CARS؟
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            لأن القرار الكبير يحتاج شريكًا واضحًا، سريعًا، واحترافيًا
          </h2>
          <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
            لا نعرض مركبات فقط، بل نبني تجربة شراء مطمئنة تبدأ بالمعلومة الدقيقة وتنتهي بملف منظم واستلام آمن.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              "فريق يتابع معك خطوة بخطوة",
              "تنسيق واضح للوثائق والفاتورة",
              "إيقاع سريع في الرد والتأكيد",
              "خدمة مناسبة للعملاء داخل وخارج الدولة"
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <BadgeCheck className="h-5 w-5 text-brand-gold" />
                <span className="text-sm text-zinc-100">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustPoints.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={0.06 * index}>
                <article className="h-full rounded-[30px] border border-zinc-200/70 bg-white/90 p-6 shadow-premium transition duration-300 hover:-translate-y-1 hover:border-brand/20 dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-zinc-950 transition-colors dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300">{item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
