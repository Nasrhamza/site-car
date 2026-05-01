import Link from "next/link";
import {
  ArrowUpLeft,
  Bus,
  CarFront,
  Package,
  ShieldCheck,
  Truck,
  Wrench
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { categories } from "@/lib/data";
import { getCategoryLabel, getCategorySlug } from "@/lib/company";

const categoryMeta: Record<
  string,
  {
    description: string;
    icon: typeof CarFront;
  }
> = {
  Tracteurs: {
    description: "حلول جر متينة للتوريد والعمل اليومي.",
    icon: Truck
  },
  "Semi-remorques": {
    description: "خيارات جاهزة للتحميل والنقل الثقيل.",
    icon: Package
  },
  Camions: {
    description: "شاحنات مختارة بفحص واضح وملف نظيف.",
    icon: Truck
  },
  Utilitaires: {
    description: "مركبات عملية للتجارة والخدمة السريعة.",
    icon: CarFront
  },
  "Engins TP": {
    description: "آليات أشغال بتركيز على الجاهزية والمتانة.",
    icon: Wrench
  },
  "Bus / Minibus": {
    description: "حلول نقل للأفراد والمؤسسات والسياحة.",
    icon: Bus
  },
  "Véhicules légers": {
    description: "سيارات خفيفة مختارة للاستخدام اليومي والفاخر.",
    icon: ShieldCheck
  }
};

export function HomeCategories() {
  return (
    <section className="section-spacing pt-10 sm:pt-14">
      <div className="container-premium">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="gradient-text text-xs font-semibold uppercase tracking-[0.34em] sm:text-sm">
              تصفح حسب الفئة
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 transition-colors dark:text-white sm:text-4xl lg:text-5xl">
              فئات واضحة تساعدك توصل إلى المركبة المناسبة أسرع
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300 sm:text-base">
              اختر المجال الذي تبحث عنه، ثم انتقل مباشرة إلى عروض مرتبة ومهيأة للمعاينة والتواصل.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-premium transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            عرض كل المركبات
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {categories.map((category, index) => {
            const meta = categoryMeta[category.name] || {
              description: "عروض مختارة مع متابعة مباشرة وشفافة.",
              icon: CarFront
            };
            const Icon = meta.icon;

            return (
              <Reveal key={category.name} delay={0.05 * index}>
                <Link
                  href={`/categorie/${getCategorySlug(category.name)}`}
                  className="group relative block h-full overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white/90 p-5 shadow-premium transition duration-300 hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-[0_26px_60px_rgba(193,18,31,0.12)] dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
                >
                  <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.14),transparent_36%)]" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg transition duration-300 group-hover:bg-brand">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-950 transition-colors dark:text-white">
                          {getCategoryLabel(category.name)}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600 transition-colors dark:text-zinc-300">
                          {meta.description}
                        </p>
                      </div>

                      <span className="rounded-full border border-zinc-200 bg-white/80 p-2 text-zinc-500 transition group-hover:border-brand/20 group-hover:text-brand dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
                        <ArrowUpLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
