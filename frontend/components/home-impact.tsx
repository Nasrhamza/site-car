import Link from "next/link";
import { ArrowUpLeft, BadgeCheck, FileCheck2, MessageCircle, Route, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { buildWhatsAppUrl } from "@/lib/company";

const pillars = [
  {
    title: "اختيار مضبوط",
    text: "نرتب العروض حسب الفئة، الحالة، والسعر حتى يصل العميل بسرعة للقرار الصحيح.",
    icon: Route
  },
  {
    title: "ملف واضح",
    text: "صور، تفاصيل، وبيانات مهمة في مكان واحد بدون غموض أو كلام زائد.",
    icon: FileCheck2
  },
  {
    title: "ثقة في التنفيذ",
    text: "تواصل مباشر، متابعة منظمة، وخطوات واضحة من المعاينة حتى الاستلام.",
    icon: ShieldCheck
  }
];

export function HomeImpact() {
  return (
    <section className="relative overflow-hidden bg-white py-8 transition-colors dark:bg-zinc-950 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand/35 to-transparent" />

      <div className="container-premium">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Reveal className="relative overflow-hidden rounded-[30px] bg-zinc-950 p-6 text-white shadow-[0_24px_80px_rgba(9,9,11,0.24)] sm:p-8">
            <div className="absolute inset-0 premium-grid opacity-50" />
            <div className="absolute -left-14 top-8 h-40 w-40 rounded-full bg-brand/25 blur-3xl" />
            <div className="absolute -right-10 bottom-4 h-36 w-36 rounded-full bg-brand-gold/20 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-brand-gold">
                <BadgeCheck className="h-4 w-4" />
                ليس مجرد معرض
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                الصفحة لازم تبيع الثقة قبل ما تبيع المركبة.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                لهذا خلينا الواجهة تشرح الخدمة بسرعة: ماذا نعرض، كيف نتابع، ولماذا العميل يقدر يطمئن قبل التواصل.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:-translate-y-1 hover:bg-brand hover:text-white"
                >
                  شاهد المركبات
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>

                <a
                  href={buildWhatsAppUrl("مرحبا، أريد التواصل مع فريق ALHADUNI CARS.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/15"
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب مباشر
                </a>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <Reveal key={pillar.title} delay={0.06 * index} className="h-full">
                  <article className="group relative h-full overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:border-brand/25 hover:shadow-[0_28px_70px_rgba(193,18,31,0.13)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_18px_48px_rgba(0,0,0,0.26)]">
                    <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.10),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.14),transparent_38%)]" />

                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg transition group-hover:bg-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-xl font-black text-zinc-950 dark:text-white">{pillar.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{pillar.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
