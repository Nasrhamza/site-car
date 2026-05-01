import { CheckCircle2, Search, Truck } from "lucide-react";
import { Reveal } from "@/components/reveal";

const steps = [
  {
    title: "اختر المركبة",
    description: "تصفح العروض، راجع الصور والمواصفات، وحدد المركبة الأقرب لاحتياجك.",
    icon: Search
  },
  {
    title: "المعاينة والتأكيد",
    description: "نرسل لك التفاصيل الموثقة ونرتب التأكيد النهائي بكل وضوح قبل الإتمام.",
    icon: CheckCircle2
  },
  {
    title: "الشحن والاستلام",
    description: "نتابع الملف من الفاتورة إلى الشحن والاستلام حتى تبقى الصورة كاملة أمامك.",
    icon: Truck
  }
];

export function HomeProcess() {
  return (
    <section className="section-spacing">
      <div className="container-premium">
        <Reveal className="max-w-3xl">
          <p className="gradient-text text-xs font-semibold uppercase tracking-[0.34em] sm:text-sm">
            كيف تتم العملية؟
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 transition-colors dark:text-white sm:text-4xl lg:text-5xl">
            ثلاث خطوات واضحة من أول اختيار إلى لحظة الاستلام
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300 sm:text-base">
            صممنا التجربة لتكون سريعة، موثقة، وسهلة المتابعة مهما كانت الفئة التي تبحث عنها.
          </p>
        </Reveal>

        <div className="relative mt-10 grid gap-5 lg:grid-cols-3">
          <div className="absolute right-8 left-8 top-14 hidden h-px bg-gradient-to-l from-transparent via-brand/30 to-transparent lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Reveal key={step.title} delay={0.08 * index}>
                <article className="relative h-full rounded-[30px] border border-zinc-200/70 bg-white/90 p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                  <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(193,18,31,0.08),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_38%)]" />
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                          الخطوة {index + 1}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-zinc-950 transition-colors dark:text-white">{step.title}</h3>
                      </div>
                    </div>

                    <p className="mt-6 text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300 sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
