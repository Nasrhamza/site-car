"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Grid2X2, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/lib/data";
import { ENGINE_CAPACITY_OPTIONS, REGIONAL_SPECS_OPTIONS, getCategoryDisplayLabel } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

type Params = Record<string, any>;
type PopoverKey = "brand" | "model" | "price" | "year" | "engineCapacity" | "regionalSpecs" | null;

const FUEL_FILTERS = [
  { value: "Essence", label: "Petrol", ar: "بنزين", image: "/fuel-types/petrol.png" },
  { value: "Diesel", label: "Diesel", ar: "ديزل", image: "/fuel-types/diesel.png" },
  { value: "Hybride", label: "Hybrid", ar: "هجين", image: "/fuel-types/hybrid.png" },
  { value: "Électrique", label: "Electric", ar: "كهربائي", image: "/fuel-types/electric.png" },
  { value: "PHEV", label: "PHEV", ar: "هجين قابل للشحن", image: "/fuel-types/phev.png" },
  { value: "REEV", label: "REEV", ar: "كهربائي ممتد المدى", image: "/fuel-types/reev.png" }
] as const;
const YEARS = Array.from({ length: 101 }, (_, index) => 2050 - index);

function FieldButton({ label, value, active, onClick }: { label: string; value: string; active?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex h-[52px] min-w-0 items-center justify-between gap-2 rounded-xl border px-4 text-left transition ${active ? "border-brand ring-1 ring-brand/20" : "border-zinc-300 hover:border-zinc-500 dark:border-white/15"}`}>
    <span className="min-w-0"><span className="block text-[10px] font-extrabold uppercase tracking-[.14em] text-zinc-500">{label}</span><span className="mt-0.5 block truncate text-sm font-bold text-zinc-950 dark:text-white">{value}</span></span>
    <ChevronDown className={`h-4 w-4 shrink-0 transition ${active ? "rotate-180" : ""}`} />
  </button>;
}

function DropdownShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <motion.div initial={{ opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .98 }} transition={{ duration: .16 }} className={`absolute left-0 top-[60px] z-40 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900 ${wide ? "w-[min(460px,calc(100vw-2rem))]" : "w-full min-w-[260px]"}`}>{children}</motion.div>;
}

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
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [search, setSearch] = useState(params.search || "");
  const [popover, setPopover] = useState<PopoverKey>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  const copy = isArabic ? {
    search: "الماركة، الموديل أو كلمة مفتاحية", filters: "الفلاتر", show: "عرض", cars: "مركبة", make: "الماركة", model: "الموديل", any: "الكل", price: "السعر (AED)", year: "السنة", engine: "سعة المحرك", regional: "المواصفات", reset: "إعادة ضبط", min: "الأدنى", max: "الأقصى", findMake: "ابحث عن ماركة", findModel: "ابحث عن موديل", advanced: "فلاتر متقدمة", mileage: "الكيلومترات", fuel: "نوع الوقود", body: "نوع المركبة", transmission: "علبة السرعة", automatic: "أوتوماتيك", manual: "يدوي", sort: "الترتيب", newest: "الأحدث", priceLow: "السعر: الأقل", priceHigh: "السعر: الأعلى", mostViewed: "الأكثر مشاهدة"
  } : {
    search: "Make, model, trim, or keyword", filters: "Filters", show: "Show", cars: "cars", make: "Make", model: "Model", any: "Any", price: "Price (AED)", year: "Year", engine: "Engine capacity", regional: "Regional specs", reset: "Reset", min: "Min", max: "Max", findMake: "Search make", findModel: "Search model", advanced: "Advanced filters", mileage: "Mileage", fuel: "Fuel type", body: "Body type", transmission: "Transmission", automatic: "Automatic", manual: "Manual", sort: "Sort results", newest: "Newest", priceLow: "Price: low to high", priceHigh: "Price: high to low", mostViewed: "Most viewed"
  };

  useEffect(() => setSearch(params.search || ""), [params.search]);
  useEffect(() => { const timer = window.setTimeout(() => setParams((prev: Params) => ({ ...prev, page: 1, search })), 300); return () => window.clearTimeout(timer); }, [search, setParams]);
  useEffect(() => { const close = (event: MouseEvent) => !filterRef.current?.contains(event.target as Node) && setPopover(null); document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  useEffect(() => { if (!drawerOpen) return; const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [drawerOpen]);

  const update = (key: string, value: string) => setParams((prev: Params) => ({ ...prev, page: 1, [key]: value }));
  const activeFilters = useMemo(() => [params.brand, params.model, params.category, params.fuelType, params.minPrice, params.maxPrice, params.yearFrom, params.yearTo, params.minMileage, params.maxMileage, params.transmission, params.engineCapacity, params.regionalSpecs].filter(Boolean).length, [params]);
  const filteredBrands = useMemo(() => brands.filter((item) => item.toLowerCase().includes(brandSearch.toLowerCase())), [brands, brandSearch]);
  const filteredModels = useMemo(() => models.filter((item) => item.toLowerCase().includes(modelSearch.toLowerCase())), [models, modelSearch]);
  const reset = () => { setSearch(""); setPopover(null); setParams((prev: Params) => ({ ...prev, page: 1, search: "", brand: "", model: "", category: "", fuelType: "", minPrice: "", maxPrice: "", yearFrom: "", yearTo: "", minMileage: "", maxMileage: "", transmission: "", engineCapacity: "", regionalSpecs: "", sort: "-createdAt" })); };
  const toggle = (key: PopoverKey) => setPopover((current) => current === key ? null : key);
  const selectAndClose = (key: string, value: string) => { update(key, value); setPopover(null); };
  const valueRange = (min: string, max: string) => min || max ? `${min || copy.any} – ${max || copy.any}` : copy.any;

  const listDropdown = (kind: "brand" | "model", values: string[], value: string, searchValue: string, setSearchValue: (value: string) => void) => <DropdownShell><div className="p-3"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input autoFocus value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={kind === "brand" ? copy.findMake : copy.findModel} className="h-11 w-full rounded-xl border px-9 text-sm outline-none focus:border-brand dark:border-white/15 dark:bg-zinc-950" /></div></div><div className="max-h-72 overflow-y-auto border-t dark:border-white/10"><button onClick={() => selectAndClose(kind, "")} className="block w-full px-4 py-3 text-left text-sm font-bold hover:bg-zinc-50 dark:hover:bg-white/5">{copy.any}</button>{values.map((item) => <button key={item} onClick={() => selectAndClose(kind, item)} className={`block w-full border-t border-zinc-100 px-4 py-3 text-left text-sm hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5 ${item === value ? "font-extrabold text-brand" : ""}`}>{item}</button>)}</div></DropdownShell>;

  return <>
    <section ref={filterRef} className="relative rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.09)] dark:border-white/10 dark:bg-zinc-900">
      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 rtl:left-auto rtl:right-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} list="catalogue-suggestions" className="h-[56px] w-full rounded-xl border border-zinc-300 bg-zinc-50 px-12 text-base font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-brand focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white" /><datalist id="catalogue-suggestions">{suggestions.map((item) => <option key={item} value={item} />)}</datalist></div>
        <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex h-[56px] items-center justify-center gap-2 rounded-xl border border-zinc-300 px-6 font-bold transition hover:border-brand hover:text-brand dark:border-white/15"><SlidersHorizontal className="h-4 w-4" />{copy.filters}{activeFilters ? <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs text-white">{activeFilters}</span> : null}</button>
        <button type="button" onClick={() => setPopover(null)} className="h-[56px] rounded-xl bg-brand px-7 font-extrabold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark">{copy.show} {total.toLocaleString()} {copy.cars}</button>
      </div>

      <div className="grid gap-2 border-t border-zinc-100 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.05fr_1.05fr_1.15fr_1fr_1.15fr_1.2fr_auto] dark:border-white/10">
        <div className="relative"><FieldButton label={copy.make} value={params.brand || copy.any} active={popover === "brand"} onClick={() => toggle("brand")} /><AnimatePresence>{popover === "brand" ? listDropdown("brand", filteredBrands, params.brand, brandSearch, setBrandSearch) : null}</AnimatePresence></div>
        <div className="relative"><FieldButton label={copy.model} value={params.model || copy.any} active={popover === "model"} onClick={() => toggle("model")} /><AnimatePresence>{popover === "model" ? listDropdown("model", filteredModels, params.model, modelSearch, setModelSearch) : null}</AnimatePresence></div>
        <div className="relative"><FieldButton label={copy.price} value={valueRange(params.minPrice, params.maxPrice)} active={popover === "price"} onClick={() => toggle("price")} /><AnimatePresence>{popover === "price" ? <DropdownShell wide><RangeFields firstKey="minPrice" secondKey="maxPrice" params={params} update={update} copy={copy} /><ApplyBar reset={() => { update("minPrice", ""); update("maxPrice", ""); }} apply={() => setPopover(null)} total={total} copy={copy} /></DropdownShell> : null}</AnimatePresence></div>
        <div className="relative"><FieldButton label={copy.year} value={valueRange(params.yearFrom, params.yearTo)} active={popover === "year"} onClick={() => toggle("year")} /><AnimatePresence>{popover === "year" ? <DropdownShell wide><div className="grid grid-cols-2 gap-3 p-4">{["yearFrom", "yearTo"].map((key, index) => <label key={key} className="rounded-xl border p-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-500">{index ? copy.max : copy.min}</span><select value={params[key] || ""} onChange={(e) => update(key, e.target.value)} className="mt-1 w-full bg-transparent font-bold outline-none"><option value="">{copy.any}</option>{YEARS.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>)}</div><ApplyBar reset={() => { update("yearFrom", ""); update("yearTo", ""); }} apply={() => setPopover(null)} total={total} copy={copy} /></DropdownShell> : null}</AnimatePresence></div>
        <div className="relative"><FieldButton label={copy.engine} value={params.engineCapacity ? `${Number(params.engineCapacity).toFixed(1)} L` : copy.any} active={popover === "engineCapacity"} onClick={() => toggle("engineCapacity")} /><AnimatePresence>{popover === "engineCapacity" ? <DropdownShell><div className="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto p-2"><button onClick={() => selectAndClose("engineCapacity", "")} className="rounded-lg px-3 py-2 text-left text-sm font-bold hover:bg-zinc-100 dark:hover:bg-white/5">{copy.any}</button>{ENGINE_CAPACITY_OPTIONS.map((capacity) => <button key={capacity} onClick={() => selectAndClose("engineCapacity", String(capacity))} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-white/5">{capacity.toFixed(1)} L</button>)}</div></DropdownShell> : null}</AnimatePresence></div>
        <div className="relative"><FieldButton label={copy.regional} value={params.regionalSpecs || copy.any} active={popover === "regionalSpecs"} onClick={() => toggle("regionalSpecs")} /><AnimatePresence>{popover === "regionalSpecs" ? <DropdownShell><div className="p-2"><button onClick={() => selectAndClose("regionalSpecs", "")} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold hover:bg-zinc-100 dark:hover:bg-white/5">{copy.any}</button>{REGIONAL_SPECS_OPTIONS.map((option) => <button key={option} onClick={() => selectAndClose("regionalSpecs", option)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-white/5">{option}</button>)}</div></DropdownShell> : null}</AnimatePresence></div>
        <button type="button" onClick={reset} className="h-[52px] rounded-xl bg-zinc-100 px-5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white dark:bg-white/5">{copy.reset}</button>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 dark:border-white/10"><p className="text-sm font-bold">{total.toLocaleString()} {copy.cars}</p><div className="flex gap-2"><button onClick={() => setView("grid")} className={`grid h-9 w-9 place-items-center rounded-xl ${view === "grid" ? "bg-brand text-white" : "border dark:border-white/10"}`} aria-label="Grid"><Grid2X2 className="h-4 w-4" /></button><button onClick={() => setView("list")} className={`grid h-9 w-9 place-items-center rounded-xl ${view === "list" ? "bg-brand text-white" : "border dark:border-white/10"}`} aria-label="List"><List className="h-4 w-4" /></button></div></div>
    </section>

    <AnimatePresence>{drawerOpen ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setDrawerOpen(false)}><motion.aside initial={{ x: isArabic ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: isArabic ? "-100%" : "100%" }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className={`absolute inset-y-0 w-full max-w-[560px] overflow-y-auto bg-white p-5 shadow-2xl dark:bg-zinc-950 ${isArabic ? "left-0" : "right-0"}`}><div className="flex items-center justify-between border-b pb-4 dark:border-white/10"><div><h2 className="text-2xl font-black">{copy.advanced}</h2><p className="mt-1 text-sm text-zinc-500">{isArabic ? "اختر المواصفات ثم اعرض المركبات المطابقة." : "Choose the right specifications, then show matching cars."}</p></div><button onClick={() => setDrawerOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border dark:border-white/10"><X /></button></div>
      <div className="space-y-7 py-6"><section><h3 className="font-extrabold">{copy.mileage}</h3><RangeFields firstKey="minMileage" secondKey="maxMileage" params={params} update={update} copy={copy} /></section>
      <section><h3 className="font-extrabold">{copy.fuel}</h3><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{FUEL_FILTERS.map((fuel) => { const selected = params.fuelType === fuel.value; return <button key={fuel.value} onClick={() => update("fuelType", selected ? "" : fuel.value)} className={`relative rounded-2xl border p-3 ${selected ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-zinc-200 dark:border-white/10"}`}>{selected ? <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-brand text-white"><Check className="h-3 w-3" /></span> : null}<span className="relative mx-auto block h-14 w-20"><Image src={fuel.image} alt="" fill className="object-contain" sizes="80px" /></span><span className="mt-2 block text-xs font-extrabold">{isArabic ? fuel.ar : fuel.label}</span></button>; })}</div></section>
      <section><h3 className="font-extrabold">{copy.body}</h3><div className="mt-3 flex flex-wrap gap-2">{categories.map((category) => <button key={category.name} onClick={() => update("category", params.category === category.name ? "" : category.name)} className={`rounded-full border px-3 py-2 text-xs font-bold ${params.category === category.name ? "border-brand bg-brand text-white" : "dark:border-white/10"}`}>{getCategoryDisplayLabel(category.name, language)}</button>)}</div></section>
      <section><h3 className="font-extrabold">{copy.transmission}</h3><div className="mt-3 grid grid-cols-2 gap-3">{[{ value: "Automatique", label: copy.automatic }, { value: "Manuelle", label: copy.manual }].map((option) => <button key={option.value} onClick={() => update("transmission", params.transmission === option.value ? "" : option.value)} className={`rounded-2xl border p-3 font-bold ${params.transmission === option.value ? "border-brand bg-brand text-white" : "dark:border-white/10"}`}>{option.label}</button>)}</div></section>
      <section><h3 className="font-extrabold">{copy.sort}</h3><select value={params.sort || "-createdAt"} onChange={(e) => update("sort", e.target.value)} className="mt-3 h-12 w-full rounded-2xl border bg-transparent px-4 font-bold dark:border-white/10"><option value="-createdAt">{copy.newest}</option><option value="price">{copy.priceLow}</option><option value="-price">{copy.priceHigh}</option><option value="-views">{copy.mostViewed}</option></select></section></div>
      <div className="sticky bottom-0 flex gap-3 border-t bg-white/95 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"><button onClick={reset} className="inline-flex h-12 items-center gap-2 rounded-xl border px-4 font-bold dark:border-white/10"><RotateCcw className="h-4 w-4" />{copy.reset}</button><button onClick={() => setDrawerOpen(false)} className="h-12 flex-1 rounded-xl bg-brand font-extrabold text-white">{copy.show} {total.toLocaleString()} {copy.cars}</button></div></motion.aside></motion.div> : null}</AnimatePresence>
  </>;
}

function RangeFields({ firstKey, secondKey, params, update, copy }: { firstKey: string; secondKey: string; params: Params; update: (key: string, value: string) => void; copy: Record<string, string> }) {
  return <div className="grid grid-cols-2 gap-3 p-4"><label className="rounded-xl border p-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-500">{copy.min}</span><input type="number" min="0" value={params[firstKey] || ""} onChange={(e) => update(firstKey, e.target.value)} placeholder={copy.any} className="mt-1 w-full bg-transparent font-bold outline-none" /></label><label className="rounded-xl border p-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-500">{copy.max}</span><input type="number" min="0" value={params[secondKey] || ""} onChange={(e) => update(secondKey, e.target.value)} placeholder={copy.any} className="mt-1 w-full bg-transparent font-bold outline-none" /></label></div>;
}

function ApplyBar({ reset, apply, total, copy }: { reset: () => void; apply: () => void; total: number; copy: Record<string, string> }) {
  return <div className="flex gap-3 border-t p-4 dark:border-white/10"><button onClick={reset} className="h-11 rounded-xl bg-zinc-200 px-6 font-bold dark:bg-white/10">{copy.reset}</button><button onClick={apply} className="h-11 flex-1 rounded-xl bg-brand px-5 font-bold text-white">{copy.show} {total.toLocaleString()} {copy.cars}</button></div>;
}
