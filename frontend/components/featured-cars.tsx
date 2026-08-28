"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function FeaturedCars({ cars = [] }: { cars?: any[] }) {
  const { language, t } = useLanguage();

  return (
    <section className="section-spacing overflow-hidden border-y border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900">
      <div className="container-premium">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-600">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              {t.featuredTag}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {t.featuredTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              {t.featuredText}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-brand hover:text-brand"
            >
              {t.inventory}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <a
              href={buildWhatsAppUrl(
                language === "ar"
                  ? "مرحباً، أريد قائمة السيارات المتوفرة."
                  : "Hello, I would like the list of available cars."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              <MessageCircle className="h-4 w-4" />
              {t.whatsapp}
            </a>
          </div>
        </div>

        {!cars.length ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 dark:border-white/15 dark:bg-zinc-950">
            {t.noCars}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cars.slice(0, 9).map((car) => (
              <CarCard key={car._id || car.id || car.slug} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
