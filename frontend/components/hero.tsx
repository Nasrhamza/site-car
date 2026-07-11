"use client";

import { ArrowRight, CheckCircle2, MessageCircle, Search, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";
import { resolveMediaUrl } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

type HeroCar = { _id?: string; slug?: string; name?: string; images?: Array<{ url?: string; alt?: string }> };

export function Hero({ cars = [] }: { cars?: HeroCar[] }) {
  const { language, t } = useLanguage();
  const photos = cars
    .flatMap((car, carIndex) => (car.images || []).map((image, imageIndex) => ({
      id: `${car._id || car.slug || carIndex}-${imageIndex}`,
      src: resolveMediaUrl(image.url),
      alt: image.alt || car.name || "ALHADUNI CARS"
    })))
    .filter((image) => Boolean(image.src))
    .slice(0, 10);
  const railPhotos = [...photos, ...photos];

  return (
    <section className="border-b border-zinc-200 bg-zinc-950 text-white">
      <div className="container-premium py-7 sm:py-9">
        {photos.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
            <div className="home-photo-rail flex w-max gap-2">
              {railPhotos.map((photo, index) => (
                <div key={`${photo.id}-${index}`} className="h-20 w-32 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-40">
                  <img src={photo.src || ""} alt={photo.alt} className="h-full w-full object-cover" loading={index < 4 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>
          </div>
        )}
        <form action="/catalogue" method="get" className="rounded-2xl bg-white p-2 shadow-2xl shadow-black/20">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                name="search"
                placeholder={t.search}
                className="h-12 w-full rounded-xl bg-zinc-50 px-4 pr-11 text-sm text-zinc-950 outline-none transition focus:ring-2 focus:ring-brand/40"
              />
            </label>
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-dark">
              {t.searchButton}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"><Sparkles className="h-3.5 w-3.5 text-brand" />{t.heroTag}</div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t.heroTitle}</h1>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-300">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" />{t.featuredTag}</span>
            <a href={buildWhatsAppUrl(language === "ar" ? "مرحباً، أريد معرفة السيارات المتوفرة لدى ALHADUNI CARS." : "Hello, I would like to check the available cars at ALHADUNI CARS.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-green-300"><MessageCircle className="h-4 w-4 text-green-400" />{t.whatsapp}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
