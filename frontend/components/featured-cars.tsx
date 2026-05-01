import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { Reveal } from "@/components/reveal";
import { buildWhatsAppUrl } from "@/lib/company";

export function FeaturedCars({ cars = [] }: { cars?: any[] }) {
  return (
    <section className="section-spacing relative overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.26),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.14),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand/50 to-transparent" />

      <div className="container-premium relative">
        <Reveal className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" />
              مختارات مميزة
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              مركبات تجذب الانتباه من أول نظرة وتختصر عليك وقت البحث
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
              اخترنا لك عروضًا بارزة بصور أوضح، مواصفات مقنعة، وإمكانية تواصل مباشر إذا وجدت ما يناسبك.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
          >
            افتح المعرض
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {!cars.length ? (
          <Reveal className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
            <h3 className="text-2xl font-bold">لا توجد عروض مميزة الآن</h3>
            <p className="mt-3 text-zinc-300">
              يمكنك الدخول إلى المعرض أو مراسلتنا على واتساب للاستفسار عن المركبات المتوفرة حاليًا.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5"
              >
                المعرض
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={buildWhatsAppUrl(
                  "مرحبًا، أريد معرفة المركبات المتوفرة حاليًا لدى ALHADUNI CARS."
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                واتساب
              </a>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {cars.map((car: any, index: number) => (
              <Reveal key={car._id || car.id || car.slug || index} delay={0.05 * index}>
                <CarCard car={car} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
