"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Fuel,
  Gauge,
  GitCompareArrows,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { getBadgeLabel, getFuelTypeLabel, getStatusLabel } from "@/lib/company";
import { buildWhatsAppLink, cn, formatCurrency, formatNumber, resolveMediaUrl } from "@/lib/utils";
import { useGarageStore } from "@/store/favorites";

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
  const isList = variant === "list";

  const isFavorite = favorites.includes(car._id);
  const isCompared = compare.includes(car._id);
  const availability = getStatusLabel(car.availability || car.status || "Disponible");
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
      label: "الكلم",
      value: `${formatNumber(car.mileage || 0)} km`,
      icon: Gauge
    },
    {
      label: "السنة",
      value: String(car.year || "-"),
      icon: ShieldCheck
    },
    {
      label: "الوقود",
      value: getFuelTypeLabel(car.fuelType || "Autre"),
      icon: Fuel
    },
    {
      label: "الحالة",
      value: availability,
      icon: Sparkles
    }
  ];

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.005 }}
      transition={{ duration: 0.32 }}
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-zinc-200/70 bg-white/95 shadow-[0_16px_42px_rgba(15,23,42,0.12)] transition duration-300 dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-[0_22px_70px_rgba(0,0,0,0.32)]",
        "hover:border-brand/25 hover:shadow-[0_22px_60px_rgba(193,18,31,0.14)] dark:hover:border-brand/35",
        isList && "grid gap-0 md:grid-cols-[360px_1fr]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_28%)]" />

      <div className={cn("relative overflow-hidden", isList ? "h-64 md:h-full md:min-h-[260px]" : "h-60 sm:h-64")}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes={isList ? "(max-width: 768px) 100vw, 360px" : "(max-width: 1536px) 33vw, 25vw"}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            {car.badges?.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-black/15"
              >
                {getBadgeLabel(badge)}
              </span>
            ))}
            <span className="rounded-full border border-white/20 bg-brand/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-brand/30">
              {availability}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => toggleFavorite(car._id)}
              className={cn(
                "rounded-full border p-2 shadow-lg shadow-black/15 transition",
                isFavorite
                  ? "border-rose-500 bg-rose-500 text-white"
                  : "border-white/25 bg-black/45 text-white hover:bg-black/60"
              )}
              aria-label="إضافة إلى المفضلة"
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </button>

            <button
              type="button"
              onClick={() => toggleCompare(car._id)}
              className={cn(
                "rounded-full border p-2 shadow-lg shadow-black/15 transition",
                isCompared
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-white/25 bg-black/45 text-white hover:bg-black/60"
              )}
              aria-label="مقارنة هذه المركبة"
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] text-zinc-500 transition-colors dark:text-zinc-400">
              {car.brand} - {car.model}
            </p>
            <h3 className="mt-1 truncate text-lg font-bold tracking-tight text-zinc-950 transition-colors dark:text-white">
              {car.name}
            </h3>
          </div>

          <div className="shrink-0 text-left">
            <p className="text-[10px] text-zinc-400">جاهزة الآن</p>
            <p className="mt-1 text-lg font-bold text-brand">{formatCurrency(car.price || 0)}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5 text-[11px] text-zinc-600 transition-colors dark:text-zinc-300">
          {specs.map((spec) => {
            const Icon = spec.icon;

            return (
              <div
                key={spec.label}
                className="rounded-xl border border-zinc-200/70 bg-zinc-50/80 p-2 transition-colors dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-center gap-1 text-[9px] text-zinc-400">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="sr-only">{spec.label}</span>
                </div>
                <p className="mt-1 truncate text-center font-semibold text-zinc-950 transition-colors dark:text-white">
                  {spec.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <Link
            href={`/voitures/${car.slug}`}
            className="button-glow inline-flex items-center justify-center rounded-xl bg-zinc-950 px-3 py-2 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand"
          >
            التفاصيل
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-[11px] font-semibold text-green-700 transition hover:-translate-y-0.5 hover:border-green-500/40 hover:bg-green-500/15 dark:text-green-300"
          >
            <MessageCircle className="h-4 w-4" />
            واتساب
          </a>
        </div>
      </div>
    </motion.article>
  );
}
