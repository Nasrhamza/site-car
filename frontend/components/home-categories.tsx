"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getCategoryDisplayLabel, getCategorySlug } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";
import { resolveMediaUrl } from "@/lib/utils";

type CategoryCar = {
  _id?: string;
  category?: string;
  images?: Array<{ url?: string; alt?: string }>;
};

const categories = ["Véhicules légers", "Utilitaires", "Camions", "Tracteurs", "Semi-remorques"];

export function HomeCategories({ cars = [] }: { cars?: CategoryCar[] }) {
  const { language } = useLanguage();
  const ar = language === "ar";
  const carsWithPhotos = cars.filter((car) => car.images?.[0]?.url);
  const cards = categories.map((category, index) => {
    const exactCar = carsWithPhotos.find((car) => car.category === category);
    const fallbackCar = carsWithPhotos[index % Math.max(carsWithPhotos.length, 1)];
    const car = exactCar || fallbackCar;
    return {
      category,
      label: getCategoryDisplayLabel(category, language),
      href: `/categorie/${getCategorySlug(category)}`,
      image: resolveMediaUrl(car?.images?.[0]?.url),
      count: cars.filter((item) => item.category === category).length
    };
  });

  return (
    <section className="overflow-hidden bg-white py-12 dark:bg-zinc-950 sm:py-16">
      <div className="container-premium">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }} className="flex items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[.24em] text-brand">{ar ? "اختر حسب الفئة" : "Explore by category"}</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] text-zinc-950 dark:text-white sm:text-5xl">{ar ? "كل طريق يبدأ باختيار." : "Every road starts with a choice."}</h2>
          </div>
          <Link href="/catalogue" className="hidden items-center gap-2 text-sm font-extrabold text-zinc-950 transition hover:text-brand dark:text-white sm:inline-flex">{ar ? "كل الفئات" : "All categories"}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </motion.div>

        <div className="hide-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11vw] pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {cards.map((card, index) => (
            <motion.div key={card.category} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, delay: index * 0.06 }} className="w-[78vw] shrink-0 snap-center sm:w-auto">
              <Link href={card.href} className="group relative block h-[330px] overflow-hidden rounded-[26px] bg-zinc-900 shadow-[0_18px_45px_rgba(15,23,42,.12)] sm:h-[360px]">
                {card.image ? <img src={card.image} alt={card.label} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,.5),transparent_48%),linear-gradient(135deg,#18181b,#09090b)]" />}
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/10" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
                  <span><span className="block text-xl font-black sm:text-2xl">{card.label}</span><span className="mt-1 block text-xs font-bold text-white/60">{card.count ? `${card.count} ${ar ? "متوفر" : "available"}` : ar ? "استكشف الفئة" : "Explore category"}</span></span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition duration-300 group-hover:rotate-[-12deg] group-hover:bg-brand"><ArrowRight className="h-5 w-5 rtl:rotate-180" /></span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
