"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategoryLabel } from "@/lib/company";
import { formatCurrency, resolveMediaUrl } from "@/lib/utils";

type ShowcaseCar = {
  _id?: string;
  slug?: string;
  name?: string;
  brand?: string;
  category?: string;
  price?: number;
  images?: Array<{ url?: string; alt?: string }>;
};

type Slide = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price?: number;
  imageUrl: string;
  alt: string;
};

function buildSlides(cars: ShowcaseCar[]): Slide[] {
  const slides = cars
    .map((car, index) => {
      const imageUrl = resolveMediaUrl(car.images?.[0]?.url);

      if (!imageUrl) {
        return null;
      }

      return {
        id: car._id || car.slug || `${car.name || "car"}-${index}`,
        name: car.name || "ALHADUNI CARS",
        brand: car.brand || "ALHADUNI CARS",
        category: car.category ? getCategoryLabel(car.category) : "مركبات مختارة",
        price: car.price,
        imageUrl,
        alt: car.images?.[0]?.alt || car.name || "ALHADUNI CARS"
      };
    })
    .filter(Boolean) as Slide[];

  if (slides.length) {
    return slides;
  }

  return [
    {
      id: "fallback-showcase",
      name: "مركبات مختارة بمعايير واضحة",
      brand: "ALHADUNI CARS",
      category: "سيارات، شاحنات وآليات جاهزة للتواصل",
      imageUrl: "/guide-import.svg",
      alt: "ALHADUNI CARS"
    }
  ];
}

export function HomeAutoShowcase({ cars = [] }: { cars?: ShowcaseCar[] }) {
  const slides = buildSlides(cars);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex % slides.length];
  const railSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative mx-auto max-w-[590px]">
      <div className="animate-orbit-slow pointer-events-none absolute -inset-8 rounded-full border border-dashed border-brand-gold/25" />
      <div className="animate-float-soft absolute -right-3 top-8 z-20 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur md:block">
        <BadgeCheck className="mb-1 h-4 w-4 text-brand-gold" />
        جاهزة للمعاينة
      </div>
      <div className="animate-float-delayed absolute -left-3 bottom-32 z-20 hidden rounded-2xl border border-white/10 bg-zinc-950/75 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur md:block">
        <ShieldCheck className="mb-1 h-4 w-4 text-green-300" />
        شحن آمن
      </div>

      <div className="premium-shine relative overflow-hidden rounded-[34px] border border-white/10 bg-white/10 p-3 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur">
        <div className="relative h-[330px] overflow-hidden rounded-[26px] bg-zinc-900 sm:h-[430px] lg:h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.imageUrl}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <Image
                src={activeSlide.imageUrl}
                alt={activeSlide.alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="animate-scan-line pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs font-bold text-white/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
            عرض تلقائي
          </div>

          <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-black/60 p-4 text-white backdrop-blur-xl sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              {activeSlide.brand}
            </p>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">{activeSlide.name}</h2>
                <p className="mt-2 text-sm text-white/70">{activeSlide.category}</p>
              </div>

              {activeSlide.price ? (
                <span className="rounded-full bg-brand px-4 py-2 text-sm font-black shadow-lg shadow-brand/30">
                  {formatCurrency(activeSlide.price)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-2 backdrop-blur">
        <div className="animate-home-image-rail flex w-max gap-3">
          {railSlides.map((slide, index) => {
            const realIndex = index % slides.length;
            const isActive = realIndex === activeIndex % slides.length;

            return (
              <button
                key={`${slide.id}-${index}`}
                type="button"
                onClick={() => setActiveIndex(realIndex)}
                className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl border p-1 text-right transition hover:-translate-y-0.5 ${
                  isActive ? "border-brand bg-brand/20" : "border-white/10 bg-white/10"
                }`}
                aria-label={slide.name}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt}
                  fill
                  className="object-cover opacity-85 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                  sizes="128px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <span className="absolute inset-x-2 bottom-2 truncate text-[11px] font-bold text-white">
                  {slide.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
