"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/data";
import { Check, ChevronDown, Grid2X2, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getCategoryDisplayLabel } from "@/lib/company";
import { currency } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

type Params = Record<string, any>;

const PRICE_MIN = 0;
const PRICE_MAX = 2_000_000;
const PRICE_STEP = 5_000;
const FUEL_FILTERS = [
  { value: "Essence", label: "Petrol", ar: "بنزين", image: "/fuel-types/petrol.png" },
  { value: "Diesel", label: "Diesel", ar: "ديزل", image: "/fuel-types/diesel.png" },
  { value: "Hybride", label: "Hybrid", ar: "هجين", image: "/fuel-types/hybrid.png" },
  { value: "Électrique", label: "Electric", ar: "كهربائي", image: "/fuel-types/electric.png" },
  { value: "PHEV", label: "PHEV", ar: "هجين قابل للشحن", image: "/fuel-types/phev.png" },
  { value: "REEV", label: "REEV", ar: "كهربائي ممتد المدى", image: "/fuel-types/reev.png" }
] as const;

export function SearchFilters({ params, setParams, view, setView, total, suggestions = [], brands = [], models = [] }: {
  params: Params;
  setParams: (value: Params | ((prev: Params) => Params)) => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  total: number;
  suggestions?: string[];
  brands?: string[];
  models?: string[];
}) {
  const [search, setSearch] = useState(params.search || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const copy = isArabic ? {
    search: "الماركة، الموديل أو كلمة مفتاحية", filters: "الفلاتر", show: "عرض", cars: "مركبة",
    make: "الماركة", model: "الموديل", any: "الكل", price: "السعر", year: "السنة", reset: "إعادة ضبط",
    advanced: "فلاتر متقدمة", advancedHint: "اختر المواصفات المناسبة ثم اعرض النتائج.", min: "الأدنى", max: "الأقصى",
    mileage: "عدد الكيلومترات", fuel: "نوع الوقود", body: "نوع المركبة", transmission: "ناقل الحركة",
    automatic: "أوتوماتيك", manual: "يدوي", sort: "ترتيب النتائج", newest: "الأحدث",
    priceLow: "السعر: من الأقل", priceHigh: "السعر: من الأعلى", mostViewed: "الأكثر مشاهدة", clearAll: "مسح الكل"
  } : {
    search: "Make, model, trim, or keyword", filters: "Filters", show: "Show", cars: "cars",
    make: "Make", model: "Model", any: "Any", price: "Price", year: "Year", reset: "Reset",
    advanced: "Advanced filters", advancedHint: "Choose the right specifications, then show the matching cars.", min: "Min", max: "Max",
    mileage: "Mileage", fuel: "Fuel type", body: "Body type", transmission: "Transmission",
    automatic: "Automatic", manual: "Manual", sort: "Sort results", newest: "Newest",
    priceLow: "Price: low to high", priceHigh: "Price: high to low", mostViewed: "Most viewed", clearAll: "Reset all"
  };

  const paramMin = Math.min(Math.max(Number(params.minPrice) || PRICE_MIN, PRICE_MIN), PRICE_MAX - PRICE_STEP);
  const paramMax = Math.max(Math.min(Number(params.maxPrice) || PRICE_MAX, PRICE_MAX), paramMin + PRICE_STEP);
  const [selectedMin, setSelectedMin] = useState(paramMin);
  const [selectedMax, setSelectedMax] = useState(paramMax);
  const minPercent = ((selectedMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((selectedMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  useEffect(() => setSearch(params.search || ""), [params.search]);
  useEffect(() => { setSelectedMin(paramMin); setSelectedMax(paramMax); }, [paramMin, paramMax]);
  useEffect(() => {
    const timer = setTimeout(() => setParams((prev: Params) => ({ ...prev, page: 1, search })), 300);
    return () => clearTimeout(timer);
  }, [search, setParams]);
  useEffect(() => {
    if (!filtersOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setFiltersOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [filtersOpen]);

  const activeFilters = useMemo(() => [
    params.brand, params.model, params.category, params.fuelType, params.minPrice, params.maxPrice,
    params.yearFrom, params.yearTo, params.minMileage, params.maxMileage, params.transmission
  ].filter(Boolean).length, [params]);

  const applyPriceRange = () => setParams((prev: Params) => ({
    ...prev, page: 1,
    minPrice: selectedMin <= PRICE_MIN ? "" : String(selectedMin),
    maxPrice: selectedMax >= PRICE_MAX ? "" : String(selectedMax)
  }));
  const updateParam = (key: string, value: string) => setParams((prev: Params) => ({ ...prev, page: 1, [key]: value }));
  const resetFilters = () => {
    setSearch(""); setSelectedMin(PRICE_MIN); setSelectedMax(PRICE_MAX);
    setParams((prev: Params) => ({
      ...prev, page: 1, search: "", brand: "", model: "", category: "", fuelType: "", minPrice: "", maxPrice: "",
      yearFrom: "", yearTo: "", minMileage: "", maxMileage: "", transmission: "", sort: "-createdAt"
    }));
  };
  return <>
    <section className="overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.08)] dark:border-white/10 dark:bg-zinc-900">
      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 rtl:left-auto rtl:right-4" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} className="h-[52px] w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-11 text-sm font-bold text-zinc-950 outline-none transition placeholder:font-semibold placeholder:text-zinc-600 focus:border-brand focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white" list="catalogue-suggestions" />
          <datalist id="catalogue-suggestions">{suggestions.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-5 text-sm font-bold transition hover:border-brand hover:text-brand dark:border-white/10">
          <SlidersHorizontal className="h-4 w-4" />{copy.filters}{activeFilters ? <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-[11px] text-white">{activeFilters}</span> : null}
        </button>
        <button type="button" onClick={() => setFiltersOpen(false)} className="h-[52px] rounded-2xl bg-brand px-6 text-sm font-extrabold text-white shadow-lg shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-dark">{copy.show} {total.toLocaleString()} {copy.cars}</button>
      </div>

      <div className="grid border-t border-zinc-200 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/10">
        <label className="relative border-b border-zinc-200 px-4 py-3 sm:border-r xl:border-b-0 dark:border-white/10">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">{copy.make}</span>
          <input value={params.brand || ""} onChange={(event) => updateParam("brand", event.target.value)} list="catalogue-brands" placeholder={copy.any} className="mt-1 block w-full bg-transparent pr-6 text-sm font-extrabold text-zinc-950 outline-none placeholder:text-zinc-900 dark:text-white dark:placeholder:text-white" />
          <ChevronDown className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 text-zinc-700 rtl:left-4 rtl:right-auto" />
          <datalist id="catalogue-brands">{brands.map((brand) => <option key={brand} value={brand} />)}</datalist>
        </label>
        <label className="relative border-b border-zinc-200 px-4 py-3 xl:border-b-0 xl:border-r dark:border-white/10">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">{copy.model}</span>
          <input value={params.model || ""} onChange={(event) => updateParam("model", event.target.value)} list="catalogue-models" placeholder={copy.any} className="mt-1 block w-full bg-transparent pr-6 text-sm font-extrabold text-zinc-950 outline-none placeholder:text-zinc-900 dark:text-white dark:placeholder:text-white" />
          <ChevronDown className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 text-zinc-700 rtl:left-4 rtl:right-auto" />
          <datalist id="catalogue-models">{models.map((model) => <option key={model} value={model} />)}</datalist>
        </label>
        <div className="border-b border-zinc-200 px-4 py-3 sm:border-r xl:border-b-0 dark:border-white/10">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">{copy.price} (AED)</span>
          <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <input type="number" min="0" value={params.minPrice || ""} onChange={(event) => updateParam("minPrice", event.target.value)} placeholder={copy.min} className="min-w-0 bg-transparent text-sm font-extrabold text-zinc-950 outline-none placeholder:text-zinc-900 dark:text-white dark:placeholder:text-white" />
            <span className="font-bold text-zinc-400">—</span>
            <input type="number" min="0" value={params.maxPrice || ""} onChange={(event) => updateParam("maxPrice", event.target.value)} placeholder={copy.max} className="min-w-0 bg-transparent text-sm font-extrabold text-zinc-950 outline-none placeholder:text-zinc-900 dark:text-white dark:placeholder:text-white" />
          </div>
        </div>
        <div className="px-4 py-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">{copy.year}</span>
          <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <input type="number" min="1900" max="2100" value={params.yearFrom || ""} onChange={(event) => updateParam("yearFrom", event.target.value)} placeholder={copy.min} className="min-w-0 bg-transparent text-sm font-extrabold text-zinc-950 outline-none placeholder:text-zinc-900 dark:text-white dark:placeholder:text-white" />
            <span className="font-bold text-zinc-400">—</span>
            <input type="number" min="1900" max="2100" value={params.yearTo || ""} onChange={(event) => updateParam("yearTo", event.target.value)} placeholder={copy.max} className="min-w-0 bg-transparent text-sm font-extrabold text-zinc-950 outline-none placeholder:text-zinc-900 dark:text-white dark:placeholder:text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 dark:border-white/10 lg:px-5">
        <p className="text-xs font-extrabold text-zinc-950 dark:text-white">{total.toLocaleString()} {copy.cars}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setView("grid")} aria-label="Grid" className={`grid h-9 w-9 place-items-center rounded-xl border transition ${view === "grid" ? "border-brand bg-brand text-white" : "border-zinc-200 dark:border-white/10"}`}><Grid2X2 className="h-4 w-4" /></button>
          <button type="button" onClick={() => setView("list")} aria-label="List" className={`grid h-9 w-9 place-items-center rounded-xl border transition ${view === "list" ? "border-brand bg-brand text-white" : "border-zinc-200 dark:border-white/10"}`}><List className="h-4 w-4" /></button>
          <button type="button" onClick={resetFilters} className="inline-flex h-9 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-xs font-bold transition hover:border-brand hover:text-brand dark:border-white/10"><RotateCcw className="h-3.5 w-3.5" />{copy.reset}</button>
        </div>
      </div>
    </section>

    <AnimatePresence>
      {filtersOpen ? <motion.div className="fixed inset-0 z-[90] bg-zinc-950/45 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && setFiltersOpen(false)}>
        <motion.aside role="dialog" aria-modal="true" aria-label={copy.advanced} initial={{ x: isArabic ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: isArabic ? "-100%" : "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className={`absolute inset-y-0 w-full max-w-[560px] overflow-y-auto bg-white shadow-2xl dark:bg-zinc-950 ${isArabic ? "left-0" : "right-0"}`}>
          <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95">
            <div><h2 className="text-xl font-extrabold">{copy.advanced}</h2><p className="mt-1 text-xs text-zinc-500">{copy.advancedHint}</p></div>
            <button type="button" onClick={() => setFiltersOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 dark:border-white/10" aria-label="Close"><X className="h-5 w-5" /></button>
          </header>

          <div className="space-y-7 p-5 pb-28">
            <section><h3 className="text-sm font-extrabold">{copy.year}</h3><div className="mt-3 grid grid-cols-2 gap-3">
              <label className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-400">{copy.min}</span><input type="number" min="1900" max="2100" value={params.yearFrom || ""} onChange={(event) => updateParam("yearFrom", event.target.value)} placeholder={copy.any} className="mt-1 block w-full bg-transparent text-sm font-bold outline-none" /></label>
              <label className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-400">{copy.max}</span><input type="number" min="1900" max="2100" value={params.yearTo || ""} onChange={(event) => updateParam("yearTo", event.target.value)} placeholder={copy.any} className="mt-1 block w-full bg-transparent text-sm font-bold outline-none" /></label>
            </div></section>

            <section><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-extrabold">{copy.price} (AED)</h3><span className="text-xs font-bold text-brand">{currency(selectedMin)} – {currency(selectedMax)}</span></div>
              <div className="relative mt-4 h-8"><div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700" /><div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-brand" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={selectedMin} onChange={(event) => setSelectedMin(Math.min(Number(event.target.value), selectedMax - PRICE_STEP))} onPointerUp={applyPriceRange} onBlur={applyPriceRange} onKeyUp={applyPriceRange} className="price-range-input" aria-label={`${copy.min} ${copy.price}`} />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={selectedMax} onChange={(event) => setSelectedMax(Math.max(Number(event.target.value), selectedMin + PRICE_STEP))} onPointerUp={applyPriceRange} onBlur={applyPriceRange} onKeyUp={applyPriceRange} className="price-range-input" aria-label={`${copy.max} ${copy.price}`} />
              </div>
            </section>

            <section><h3 className="text-sm font-extrabold">{copy.mileage}</h3><div className="mt-3 grid grid-cols-2 gap-3">
              <label className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-400">{copy.min}</span><input type="number" min="0" value={params.minMileage || ""} onChange={(event) => updateParam("minMileage", event.target.value)} placeholder="0 km" className="mt-1 block w-full bg-transparent text-sm font-bold outline-none" /></label>
              <label className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-400">{copy.max}</span><input type="number" min="0" value={params.maxMileage || ""} onChange={(event) => updateParam("maxMileage", event.target.value)} placeholder={copy.any} className="mt-1 block w-full bg-transparent text-sm font-bold outline-none" /></label>
            </div></section>

            <section><h3 className="text-sm font-extrabold">{copy.fuel}</h3><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FUEL_FILTERS.map((fuel) => { const selected = params.fuelType === fuel.value; return <button key={fuel.value} type="button" onClick={() => updateParam("fuelType", selected ? "" : fuel.value)} className={`relative overflow-hidden rounded-2xl border p-3 text-center transition ${selected ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-zinc-200 hover:border-brand/40 dark:border-white/10"}`}>
                {selected ? <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-brand text-white"><Check className="h-3 w-3" /></span> : null}
                <div className="relative mx-auto h-14 w-20"><Image src={fuel.image} alt="" fill className="object-contain" sizes="80px" /></div><span className="mt-2 block text-xs font-extrabold">{isArabic ? fuel.ar : fuel.label}</span>
              </button>; })}
            </div></section>

            <section><h3 className="text-sm font-extrabold">{copy.body}</h3><div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => <button key={category.name} type="button" onClick={() => updateParam("category", params.category === category.name ? "" : category.name)} className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${params.category === category.name ? "border-brand bg-brand text-white" : "border-zinc-200 hover:border-brand/40 dark:border-white/10"}`}>{getCategoryDisplayLabel(category.name, language)}</button>)}
            </div></section>

            <section><h3 className="text-sm font-extrabold">{copy.transmission}</h3><div className="mt-3 grid grid-cols-2 gap-3">
              {[{ value: "Automatique", label: copy.automatic }, { value: "Manuelle", label: copy.manual }].map((option) => <button key={option.value} type="button" onClick={() => updateParam("transmission", params.transmission === option.value ? "" : option.value)} className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${params.transmission === option.value ? "border-brand bg-brand text-white" : "border-zinc-200 hover:border-brand/40 dark:border-white/10"}`}>{option.label}</button>)}
            </div></section>

            <section><h3 className="text-sm font-extrabold">{copy.sort}</h3><select value={params.sort || "-createdAt"} onChange={(event) => updateParam("sort", event.target.value)} className="mt-3 h-12 w-full rounded-2xl border border-zinc-200 bg-transparent px-4 text-sm font-bold outline-none dark:border-white/10">
              <option value="-createdAt">{copy.newest}</option><option value="price">{copy.priceLow}</option><option value="-price">{copy.priceHigh}</option><option value="-views">{copy.mostViewed}</option>
            </select></section>
          </div>

          <footer className="fixed inset-x-0 bottom-0 ml-auto flex w-full max-w-[560px] gap-3 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95">
            <button type="button" onClick={resetFilters} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 text-sm font-bold dark:border-white/10"><RotateCcw className="h-4 w-4" />{copy.clearAll}</button>
            <button type="button" onClick={() => setFiltersOpen(false)} className="h-12 flex-1 rounded-2xl bg-brand px-5 text-sm font-extrabold text-white">{copy.show} {total.toLocaleString()} {copy.cars}</button>
          </footer>
        </motion.aside>
      </motion.div> : null}
    </AnimatePresence>
  </>;
}
