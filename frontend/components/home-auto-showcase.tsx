"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Images, ListFilter, Search } from "lucide-react";
import { useEffect, useState } from "react";
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
    .flatMap((car, carIndex) =>
      (car.images || []).map((image, imageIndex) => {
        const imageUrl = resolveMediaUrl(image.url);

        if (!imageUrl) return null;

        return {
          id: `${car._id || car.slug || `${car.name || "car"}-${carIndex}`}-${imageIndex}`,
          name: car.name || "ALHADUNICARS",
          brand: car.brand || "ALHADUNICARS",
          category: car.category || "Inventory photo",
          price: car.price,
          imageUrl,
          alt: image.alt || car.name || "ALHADUNICARS"
        };
      })
    )
    .filter(Boolean) as Slide[];

  if (slides.length) return slides;

  return [
    {
      id: "fallback-showcase",
      name: "Inventory preview",
      brand: "ALHADUNICARS",
      category: "Add cars from the admin panel to show them here",
      imageUrl: "",
      alt: "ALHADUNICARS"
    }
  ];
}

export function HomeAutoShowcase({ cars = [] }: { cars?: ShowcaseCar[] }) {
  const slides = buildSlides(cars);
  const isFallback = slides.length === 1 && slides[0].id === "fallback-showcase";
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex % slides.length];
  const railSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    if (slides.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      {isFallback ? (
        <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 sm:h-[420px] lg:h-[500px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,18,31,0.06),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.08),transparent_30%)]" />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600">
              <ListFilter className="h-3.5 w-3.5 text-brand" />
              Inventory preview
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-zinc-950">No cars published yet</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Add vehicles from the admin panel and the homepage will show real listings here.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Photos",
                "Price",
                "Mileage",
                "Contact"
              ].map((item) => (
                <div key={item} className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              <Search className="h-4 w-4" />
              Browse the catalogue
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-[320px] overflow-hidden rounded-xl bg-zinc-100 sm:h-[420px] lg:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.imageUrl}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <img
                  src={activeSlide.imageUrl}
                  alt={activeSlide.alt}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur">
              <Images className="h-3.5 w-3.5 text-brand" />
              Inventory photos
            </div>

            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 p-4 text-zinc-900 shadow-sm backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {activeSlide.brand}
              </p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold sm:text-2xl">{activeSlide.name}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{activeSlide.category}</p>
                </div>
                {activeSlide.price ? (
                  <span className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
                    {formatCurrency(activeSlide.price)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-xl bg-zinc-50 p-2">
            <div className="animate-home-image-rail flex w-max gap-2">
              {railSlides.map((slide, index) => {
                const realIndex = index % slides.length;
                const isActive = realIndex === activeIndex % slides.length;

                return (
                  <button
                    key={`${slide.id}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(realIndex)}
                    className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border transition ${
                      isActive ? "border-brand" : "border-transparent"
                    }`}
                    aria-label={slide.name}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
