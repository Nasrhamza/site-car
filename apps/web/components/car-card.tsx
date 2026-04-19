"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Gauge, GitCompareArrows, MessageCircle, ShieldCheck } from "lucide-react";
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
  const availability = car.availability || car.status || "Disponible";
  const imageSrc = resolveMediaUrl(car.images?.[0]?.url) || "/guide-import.svg";
  const imageAlt = car.images?.[0]?.alt || car.name;
  const whatsappHref = buildWhatsAppLink({
    name: car.name,
    slug: car.slug,
    price: car.price,
    mileage: car.mileage,
    year: car.year
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white shadow-premium transition dark:border-white/10 dark:bg-zinc-900",
        isList && "grid gap-0 md:grid-cols-[340px_1fr]"
      )}
    >
      <div className={cn("relative overflow-hidden", isList ? "h-64 md:h-full" : "h-64 sm:h-72")}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes={isList ? "(max-width: 768px) 100vw, 340px" : "(max-width: 1280px) 50vw, 33vw"}
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="flex flex-wrap gap-2">
            {car.badges?.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/25 bg-black/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(car._id)}
              className={cn(
                "rounded-full border p-2 backdrop-blur transition",
                isFavorite
                  ? "border-rose-500 bg-rose-500 text-white"
                  : "border-white/30 bg-black/30 text-white hover:bg-black/45"
              )}
              aria-label="Ajouter aux favoris"
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </button>

            <button
              type="button"
              onClick={() => toggleCompare(car._id)}
              className={cn(
                "rounded-full border p-2 backdrop-blur transition",
                isCompared
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-white/30 bg-black/30 text-white hover:bg-black/45"
              )}
              aria-label="Comparer ce vehicule"
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-2xl border border-white/15 bg-black/45 p-3 text-white backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">{car.brand}</p>
            <h3 className="mt-1 text-xl font-semibold">{car.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/80">
              <span className="rounded-full bg-white/10 px-3 py-1">{car.year}</span>
              {car.category ? (
                <span className="rounded-full bg-white/10 px-3 py-1">{car.category}</span>
              ) : null}
              {car.fuelType ? (
                <span className="rounded-full bg-white/10 px-3 py-1">{car.fuelType}</span>
              ) : null}
              {car.gearbox ? (
                <span className="rounded-full bg-white/10 px-3 py-1">{car.gearbox}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {car.brand} - {car.model}
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{car.name}</h3>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Prix</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950 dark:text-white">
              {formatCurrency(car.price)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-4">
          <div className="rounded-2xl bg-zinc-100/80 p-3 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
              <Gauge className="h-4 w-4" />
              Kilometrage
            </div>
            <p className="mt-2 font-semibold text-zinc-950 dark:text-white">
              {formatNumber(car.mileage)} km
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-100/80 p-3 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
              <ShieldCheck className="h-4 w-4" />
              Annee
            </div>
            <p className="mt-2 font-semibold text-zinc-950 dark:text-white">{car.year}</p>
          </div>

          <div className="rounded-2xl bg-zinc-100/80 p-3 dark:bg-white/5">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-400">Carburant</div>
            <p className="mt-2 font-semibold text-zinc-950 dark:text-white">
              {car.fuelType || "Autre"}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-100/80 p-3 dark:bg-white/5">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-400">Disponibilite</div>
            <p className="mt-2 font-semibold text-zinc-950 dark:text-white">
              {availability}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/voitures/${car.slug}`}
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Voir details
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-700 transition hover:-translate-y-0.5 dark:text-green-300"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => toggleFavorite(car._id)}
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
