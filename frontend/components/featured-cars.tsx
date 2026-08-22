"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";
import { currencyTnd, formatCurrency, resolveMediaUrl } from "@/lib/utils";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { useGarageStore } from "@/store/favorites";

export function FeaturedCars({ cars = [] }: { cars?: any[] }) {
  const { language, t } = useLanguage();

  return (
    <section className="section-spacing border-b border-zinc-200 bg-zinc-50">
      <div className="container-premium">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-600">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              {t.featuredTag}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              {t.featuredTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
              {t.featuredText}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-brand hover:text-brand"
            >
              {t.inventory}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildWhatsAppUrl(language === "ar" ? "مرحباً، أريد قائمة السيارات المتوفرة." : "Hello, I would like the list of available cars.")}
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
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
            {t.noCars}
          </div>
        ) : (
          <div className="grid min-w-0 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {cars.slice(0, 9).map((car: any) => (
              <HomeImageCard key={car._id || car.id || car.slug} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HomeImageCard({ car }: { car: any }) {
  const { language } = useLanguage();
  const { rate } = useAedToTndRate();
  const { favorites, toggleFavorite } = useGarageStore();
  const image = resolveMediaUrl(car?.images?.[0]?.url) || "/guide-import.svg";
  const saved = favorites.includes(car._id);
  const priceOnRequest = car?.priceType === "Sur demande" || !(Number(car?.price) > 0);

  return <article className="group relative isolate h-[300px] min-w-0 w-full transition duration-300 hover:-translate-y-1.5 sm:h-[285px]">
    <div aria-hidden className="absolute inset-x-[5%] -bottom-4 -z-20 h-[90%] overflow-hidden rounded-[24px] opacity-55 blur-2xl transition duration-500 group-hover:opacity-75"><img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full scale-105 object-cover" /></div>
    <Link href={`/voitures/${car.slug}`} className="absolute inset-0 -z-10 overflow-hidden rounded-[24px] bg-zinc-900 shadow-xl"><img src={image} alt={car?.images?.[0]?.alt || car.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/45" /></Link>
    <div className="pointer-events-none flex h-full min-w-0 flex-col justify-between p-4 text-white sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-extrabold">{car.brand}</p><p className="mt-1 truncate text-xs text-white/70">{car.model} · {car.year}</p></div><span className="max-w-[45%] shrink-0 truncate rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-bold backdrop-blur">{car.regionalSpecs || "Dubai"}</span></div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:gap-4"><div className="min-w-0"><h3 className="line-clamp-2 break-words text-xl font-black leading-tight sm:text-2xl">{car.name}</h3>{priceOnRequest ? <p className="mt-2 text-sm font-bold text-white/85">{language === "ar" ? "السعر عند الطلب" : "Price on request"}</p> : <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1"><p className="text-base font-black text-white sm:text-lg">{formatCurrency(Number(car.price))}</p><p className="text-xs font-bold text-white/65">≈ {currencyTnd(Number(car.price), rate)}</p></div>}</div><button type="button" onClick={() => toggleFavorite(car._id)} aria-label={language === "ar" ? "حفظ" : "Save vehicle"} className={`pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-white transition sm:h-11 sm:w-11 ${saved ? "bg-white text-brand" : "bg-black/20 text-white hover:bg-white/25"}`}><Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} /></button></div>
    </div>
  </article>;
}
