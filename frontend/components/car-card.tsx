"use client";

import Link from "next/link";
import {
  Fuel,
  Gauge,
  GitCompareArrows,
  Heart,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import { getBadgeLabel, getFuelTypeLabel, getStatusLabel } from "@/lib/company";
import { buildWhatsAppLink, cn, formatCurrency, formatNumber, resolveMediaUrl } from "@/lib/utils";
import { useGarageStore } from "@/store/favorites";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

type CarImage = {
  url: string;
  alt?: string;
};

type CarFront = {
  _id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  category?: string;
  year: number;
  mileage: number;
  price: number;
  status?: string;
  availability?: string;
  fuelType?: string;
  gearbox?: string;
  transmission?: string;
  badges?: string[];
  images?: CarImage[];
};

export function CarCard({
  car,
  variant = "grid"
}: {
  car: CarFront;
  variant?: "grid" | "list";
}) {
  const { favorites, compare, toggleFavorite, toggleCompare } = useGarageStore();
  const { language, t } = useLanguage();
  const isList = variant === "list";

  const isFavorite = favorites.includes(car._id);
  const isCompared = compare.includes(car._id);
  const availability = translateVehicleValue(car.availability || car.status || "Available", language) || getStatusLabel(car.availability || car.status || "Available");
  const availabilityKey = (car.availability || car.status || "").toLowerCase();
  const availabilityStyle = availabilityKey.includes("vend") || availabilityKey.includes("sold")
    ? "bg-zinc-700 text-white"
    : availabilityKey.includes("reserv")
      ? "bg-amber-400 text-amber-950"
      : "bg-emerald-500 text-white";
  const imageSrc = resolveMediaUrl(car.images?.[0]?.url) || "/guide-import.svg";
  const imageAlt = car.images?.[0]?.alt || car.name;
  const whatsappHref = buildWhatsAppLink({
    name: car.name,
    slug: car.slug,
    price: car.price,
    mileage: car.mileage,
    year: car.year
  });
  const specs = [
    {
      label: t.mileage,
      value: `${formatNumber(car.mileage || 0)} km`,
      icon: Gauge
    },
    {
      label: t.year,
      value: String(car.year || "-"),
      icon: ShieldCheck
    },
    {
      label: t.fuel,
      value: translateVehicleValue(car.fuelType, language) || getFuelTypeLabel(car.fuelType || "Other"),
      icon: Fuel
    },
  ];

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md",
        isList && "grid gap-0 md:grid-cols-[320px_1fr]"
      )}
    >
      <div className={cn("relative overflow-hidden bg-zinc-100", isList ? "h-64 md:h-full" : "h-56")}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            {car.badges?.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-zinc-800 shadow-sm"
              >
                {getBadgeLabel(badge)}
              </span>
            ))}
            <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm", availabilityStyle)}>
              {availability}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => toggleFavorite(car._id)}
              className={cn(
                "rounded-full border p-2 shadow-sm transition",
                isFavorite ? "border-rose-500 bg-rose-500 text-white" : "border-white/30 bg-white/90 text-zinc-700"
              )}
              aria-label={t.favourite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </button>

            <button
              type="button"
              onClick={() => toggleCompare(car._id)}
              className={cn(
                "rounded-full border p-2 shadow-sm transition",
                isCompared ? "border-zinc-900 bg-zinc-900 text-white" : "border-white/30 bg-white/90 text-zinc-700"
              )}
              aria-label={t.compare}
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-500">
              {car.brand} {car.model ? `- ${car.model}` : ""}
            </p>
            <h3 className="mt-1 truncate text-lg font-semibold text-zinc-950">{car.name}</h3>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs text-zinc-400">{t.price}</p>
            <p className="mt-1 text-lg font-bold text-brand">{formatCurrency(car.price || 0)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-zinc-600">
          {specs.map((spec) => {
            const Icon = spec.icon;

            return (
              <div key={spec.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-2">
                <div className="flex items-center justify-center gap-1 text-zinc-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1 truncate text-center font-semibold text-zinc-950">{spec.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-zinc-500">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />{language === "ar" ? "إعلان موثّق" : "Verified listing"}</span>
          <span>Dubai, UAE</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/voitures/${car.slug}`}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand"
          >
            {t.details}
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-500/15"
          >
            <MessageCircle className="h-4 w-4" />
            {t.whatsapp}
          </a>
        </div>
      </div>
    </article>
  );
}
