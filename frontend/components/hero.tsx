"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { resolveMediaUrl } from "@/lib/utils";

type HeroCar = {
  _id?: string;
  slug?: string;
  name?: string;
  images?: Array<{ url?: string; alt?: string }>;
};

export function Hero({ cars = [] }: { cars?: HeroCar[] }) {
  const slides = useMemo(() => cars
    .map((car, index) => ({
      id: car._id || car.slug || String(index),
      src: resolveMediaUrl(car.images?.[0]?.url),
      alt: car.images?.[0]?.alt || car.name || "ALHADUNICARS vehicle"
    }))
    .filter((slide) => Boolean(slide.src))
    .slice(0, 5), [cars]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex % Math.max(slides.length, 1)];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section aria-label="Featured vehicle gallery" className="bg-white pb-12 dark:bg-zinc-950 sm:pb-16">
      <div className="container-premium">
        <div className="relative isolate h-[400px] overflow-hidden rounded-[30px] border border-zinc-200 bg-zinc-950 shadow-[0_24px_70px_rgba(15,23,42,.16)] dark:border-white/15 sm:h-[520px]">
          <AnimatePresence mode="sync">
            {activeSlide ? (
              <motion.img
                key={activeSlide.id}
                src={activeSlide.src || ""}
                alt={activeSlide.alt}
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1.055 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.9 }, scale: { duration: 7, ease: "linear" } }}
                className="absolute inset-0 h-full w-full object-cover object-center"
                fetchPriority={activeIndex === 0 ? "high" : "auto"}
                decoding="async"
              />
            ) : null}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
          <div className="hero-grain absolute inset-0 opacity-20" />

          {slides.length > 1 ? (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-3 shadow-lg backdrop-blur-xl">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-9 bg-brand" : "w-2 bg-white/50 hover:bg-white"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
