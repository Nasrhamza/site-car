"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Grid2X2, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import {
  BODY_TYPE_OPTIONS,
  DRIVETRAIN_OPTIONS,
  ENGINE_CAPACITY_OPTIONS,
  EXPORT_STATUS_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
  GEARBOX_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  REGIONAL_SPECS_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  STEERING_SIDE_OPTIONS,
  TRIM_OPTIONS
} from "@/lib/company";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

type Params = Record<string, any>;
type PopoverKey = "brand" | "model" | "price" | "year" | "engineCapacity" | "regionalSpecs" | null;

const FUEL_FILTERS = [
  { value: "Essence", label: "Petrol", ar: "بنزين" },
  { value: "Diesel", label: "Diesel", ar: "ديزل" },
  { value: "Hybride", label: "Hybrid", ar: "هجين" },
  { value: "Électrique", label: "Electric", ar: "كهربائي" },
  { value: "PHEV", label: "PHEV", ar: "PHEV" },
  { value: "REEV", label: "REEV", ar: "REEV" }
] as const;
const YEARS = Array.from({ length: 101 }, (_, index) => 2050 - index);
const FILTER_KEYS = ["brand", "model", "bodyType", "fuelType", "minPrice", "maxPrice", "yearFrom", "yearTo", "minMileage", "maxMileage", "gearbox", "transmission", "engineCapacity", "regionalSpecs", "trim", "exteriorColor", "interiorColor", "cylinders", "minPowerHp", "maxPowerHp", "steeringSide", "doors", "seats", "wheelSize", "location", "exportStatus", "serviceHistory", "availability", "safety"];

function FieldButton({ label, value, active, onClick }: { label: string; value: string; active?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex h-[52px] w-full min-w-0 items-center justify-between gap-2 rounded-xl border px-4 text-left transition ${active ? "border-brand ring-1 ring-brand/20" : "border-zinc-300 hover:border-zinc-500 dark:border-white/15"}`}>
    <span className="min-w-0"><span className="block truncate text-[10px] font-extrabold uppercase tracking-[.14em] text-zinc-500">{label}</span><span className="mt-0.5 block truncate text-sm font-bold text-zinc-950 dark:text-white">{value}</span></span>
    <ChevronDown className={`h-4 w-4 shrink-0 transition ${active ? "rotate-180" : ""}`} />
  </button>;
}

function DropdownShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <motion.div initial={{ opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .98 }} transition={{ duration: .16 }} className={`absolute left-0 top-[60px] z-40 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900 ${wide ? "w-[min(460px,calc(100vw-2rem))]" : "w-full min-w-[260px]"}`}>{children}</motion.div>;
}

export function SearchFilters({ params, setParams, view, setView, total, suggestions = [], brands = [], models = [], availableOptions = {} }: {
  params: Params;
  setParams: (value: Params | ((prev: Params) => Params)) => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  total: number;
  suggestions?: string[];
  brands?: string[];
  models?: string[];
  availableOptions?: Record<string, string[]>;
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
    search: "الماركة، الموديل أو كلمة مفتاحية", filters: "الفلاتر", show: "عرض", cars: "مركبة", make: "الماركة", model: "الموديل", any: "الكل", price: "السعر (AED)", year: "السنة", engine: "سعة المحرك", regional: "المواصفات الإقليمية", reset: "إعادة ضبط", min: "الأدنى", max: "الأقصى", findMake: "ابحث عن ماركة", findModel: "ابحث عن موديل", advanced: "فلاتر متقدمة", mainFilters: "الفلاتر الأساسية", mileage: "الكيلومترات", fuel: "نوع الوقود", body: "نوع الهيكل", gearbox: "ناقل الحركة", drive: "نظام الدفع", exterior: "اللون الخارجي", interior: "اللون الداخلي", trim: "التجهيز", cylinders: "الأسطوانات", horsepower: "القوة بالحصان", steering: "جهة المقود", doors: "عدد الأبواب", seats: "عدد المقاعد", wheel: "حجم العجلات", location: "الموقع", exportStatus: "حالة التصدير", service: "سجل الصيانة", availability: "حالة الإعلان", safety: "ميزة سلامة", characteristics: "كل المواصفات", sort: "الترتيب", newest: "الأحدث", priceLow: "السعر: الأقل", priceHigh: "السعر: الأعلى", mostViewed: "الأكثر مشاهدة"
  } : {
    search: "Make, model, trim, or keyword", filters: "Filters", show: "Show", cars: "cars", make: "Make", model: "Model", any: "Any", price: "Price (AED)", year: "Year", engine: "Engine capacity", regional: "Regional specs", reset: "Reset", min: "Min", max: "Max", findMake: "Search make", findModel: "Search model", advanced: "Advanced filters", mainFilters: "Main filters", mileage: "Mileage", fuel: "Fuel type", body: "Body type", gearbox: "Gearbox", drive: "Drive type", exterior: "Exterior color", interior: "Interior color", trim: "Trim", cylinders: "Cylinders", horsepower: "Horsepower", steering: "Steering side", doors: "Doors", seats: "Seats", wheel: "Wheel size", location: "Location", exportStatus: "Export status", service: "Service history", availability: "Listing status", safety: "Safety feature", characteristics: "All characteristics", sort: "Sort results", newest: "Newest", priceLow: "Price: low to high", priceHigh: "Price: high to low", mostViewed: "Most viewed"
  };

  useEffect(() => setSearch(params.search || ""), [params.search]);
  useEffect(() => { const timer = window.setTimeout(() => setParams((prev: Params) => ({ ...prev, page: 1, search })), 300); return () => window.clearTimeout(timer); }, [search, setParams]);
  useEffect(() => { const close = (event: MouseEvent) => !filterRef.current?.contains(event.target as Node) && setPopover(null); document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  useEffect(() => { if (!drawerOpen) return; const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [drawerOpen]);

  const update = (key: string, value: string) => setParams((prev: Params) => ({ ...prev, page: 1, [key]: value }));
  const activeFilters = useMemo(() => FILTER_KEYS.filter((key) => params[key]).length, [params]);
  const filteredBrands = useMemo(() => brands.filter((item) => item.toLowerCase().includes(brandSearch.toLowerCase())), [brands, brandSearch]);
  const filteredModels = useMemo(() => models.filter((item) => item.toLowerCase().includes(modelSearch.toLowerCase())), [models, modelSearch]);
  const reset = () => { setSearch(""); setPopover(null); setParams((prev: Params) => ({ ...prev, page: 1, search: "", sort: "-createdAt", ...Object.fromEntries(FILTER_KEYS.map((key) => [key, ""])), category: "" })); };
  const toggle = (key: PopoverKey) => setPopover((current) => current === key ? null : key);
  const selectAndClose = (key: string, value: string) => { update(key, value); setPopover(null); };
  const valueRange = (min: string, max: string) => min || max ? `${min || copy.any} – ${max || copy.any}` : copy.any;

  const listDropdown = (kind: "brand" | "model", values: string[], value: string, searchValue: string, setSearchValue: (value: string) => void) => <DropdownShell><div className="p-3"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input autoFocus value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={kind === "brand" ? copy.findMake : copy.findModel} className="h-11 w-full rounded-xl border px-9 text-sm outline-none focus:border-brand dark:border-white/15 dark:bg-zinc-950" /></div></div><div className="max-h-72 overflow-y-auto border-t dark:border-white/10"><button onClick={() => selectAndClose(kind, "")} className="block w-full px-4 py-3 text-left text-sm font-bold hover:bg-zinc-50 dark:hover:bg-white/5">{copy.any}</button>{values.map((item) => <button key={item} onClick={() => selectAndClose(kind, item)} className={`block w-full border-t border-zinc-100 px-4 py-3 text-left text-sm hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5 ${item === value ? "font-extrabold text-brand" : ""}`}>{item}</button>)}</div></DropdownShell>;

  return <>
    <section ref={filterRef} className="relative rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.09)] dark:border-white/10 dark:bg-zinc-900">
      <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative col-span-2 lg:col-auto"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 rtl:left-auto rtl:right-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} list="catalogue-suggestions" className="h-[56px] w-full rounded-xl border border-zinc-300 bg-zinc-50 px-12 text-base font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-brand focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white" /><datalist id="catalogue-suggestions">{suggestions.map((item) => <option key={item} value={item} />)}</datalist></div>
        <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex h-[56px] min-w-0 items-center justify-center gap-2 rounded-xl border border-zinc-300 px-3 font-bold transition hover:border-brand hover:text-brand sm:px-6 dark:border-white/15"><SlidersHorizontal className="h-4 w-4 shrink-0" /><span className="truncate">{copy.filters}</span>{activeFilters ? <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-xs text-white">{activeFilters}</span> : null}</button>
        <button type="button" onClick={() => setPopover(null)} className="h-[56px] min-w-0 truncate rounded-xl bg-brand px-3 font-extrabold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark sm:px-7">{copy.show} {total.toLocaleString()} {copy.cars}</button>
      </div>

      <div className="hidden gap-2 border-t border-zinc-100 px-4 py-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.05fr_1.05fr_1.15fr_1fr_1.15fr_1.2fr_auto] dark:border-white/10">
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

    <AnimatePresence>{drawerOpen ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setDrawerOpen(false)}><motion.aside role="dialog" aria-modal="true" aria-label={copy.advanced} initial={{ x: isArabic ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: isArabic ? "-100%" : "100%" }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className={`absolute inset-y-0 w-full max-w-[560px] overflow-y-auto bg-white p-4 shadow-2xl sm:p-5 dark:bg-zinc-950 ${isArabic ? "left-0" : "right-0"}`}><div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white/95 pb-4 pt-1 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"><div className="min-w-0"><h2 className="truncate text-xl font-black sm:text-2xl">{copy.advanced}</h2><p className="mt-1 text-xs text-zinc-500 sm:text-sm">{isArabic ? "اختر المواصفات ثم اعرض المركبات المطابقة." : "Choose the right specifications, then show matching cars."}</p></div><button onClick={() => setDrawerOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border dark:border-white/10"><X /></button></div>
      <div className="space-y-7 py-6">
      <section><h3 className="font-extrabold">{copy.mainFilters}</h3><div className="mt-3 grid grid-cols-2 gap-3"><MobileSelect label={copy.make} value={params.brand || ""} onChange={(value) => update("brand", value)} options={brands} any={copy.any} /><MobileSelect label={copy.model} value={params.model || ""} onChange={(value) => update("model", value)} options={models} any={copy.any} /><div className="col-span-2"><p className="px-1 text-xs font-bold text-zinc-500">{copy.price}</p><RangeFields firstKey="minPrice" secondKey="maxPrice" params={params} update={update} copy={copy} compact /></div><div className="col-span-2"><p className="px-1 text-xs font-bold text-zinc-500">{copy.year}</p><div className="grid grid-cols-2 gap-3 pt-2">{["yearFrom", "yearTo"].map((key, index) => <label key={key} className="rounded-xl border p-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-500">{index ? copy.max : copy.min}</span><select value={params[key] || ""} onChange={(event) => update(key, event.target.value)} className="mt-1 w-full bg-transparent text-sm font-bold outline-none"><option value="">{copy.any}</option>{YEARS.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>)}</div></div><MobileSelect label={copy.engine} value={params.engineCapacity || ""} onChange={(value) => update("engineCapacity", value)} options={ENGINE_CAPACITY_OPTIONS.map(String)} optionLabel={(value) => `${Number(value).toFixed(1)} L`} any={copy.any} /><MobileSelect label={copy.regional} value={params.regionalSpecs || ""} onChange={(value) => update("regionalSpecs", value)} options={REGIONAL_SPECS_OPTIONS} any={copy.any} /></div></section>
      <section><h3 className="font-extrabold">{copy.mileage}</h3><RangeFields firstKey="minMileage" secondKey="maxMileage" params={params} update={update} copy={copy} compact /></section>
      <section><h3 className="font-extrabold">{copy.fuel}</h3><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{FUEL_FILTERS.map((fuel) => { const selected = params.fuelType === fuel.value; return <button key={fuel.value} onClick={() => update("fuelType", selected ? "" : fuel.value)} className={`relative min-h-14 rounded-xl border px-4 py-3 text-sm font-extrabold ${selected ? "border-brand bg-brand text-white ring-1 ring-brand" : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5"}`}>{selected ? <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-brand"><Check className="h-3 w-3" /></span> : null}{isArabic ? fuel.ar : fuel.label}</button>; })}</div></section>
      <section><h3 className="font-extrabold">{copy.body}</h3><div className="mt-3 flex flex-wrap gap-2">{BODY_TYPE_OPTIONS.map((bodyType) => <button key={bodyType} onClick={() => update("bodyType", params.bodyType === bodyType ? "" : bodyType)} className={`rounded-lg border px-3.5 py-2.5 text-sm font-semibold ${params.bodyType === bodyType ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-transparent bg-zinc-100 text-zinc-600 hover:border-zinc-300 dark:bg-white/5 dark:text-zinc-300"}`}>{translateVehicleValue(bodyType, language)}</button>)}</div></section>
      <section><h3 className="font-extrabold">{copy.characteristics}</h3><div className="mt-3 grid grid-cols-2 gap-3">
        <MobileSelect label={copy.trim} value={params.trim || ""} onChange={(value) => update("trim", value)} options={TRIM_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.gearbox} value={params.gearbox || ""} onChange={(value) => update("gearbox", value)} options={GEARBOX_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.drive} value={params.transmission || ""} onChange={(value) => update("transmission", value)} options={DRIVETRAIN_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.exterior} value={params.exteriorColor || ""} onChange={(value) => update("exteriorColor", value)} options={EXTERIOR_COLOR_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.interior} value={params.interiorColor || ""} onChange={(value) => update("interiorColor", value)} options={availableOptions.interiorColor || []} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.cylinders} value={params.cylinders || ""} onChange={(value) => update("cylinders", value)} options={Array.from({ length: 24 }, (_item, index) => String(index + 1))} any={copy.any} />
        <MobileSelect label={copy.steering} value={params.steeringSide || ""} onChange={(value) => update("steeringSide", value)} options={STEERING_SIDE_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.doors} value={params.doors || ""} onChange={(value) => update("doors", value)} options={Array.from({ length: 20 }, (_item, index) => String(index + 1))} any={copy.any} />
        <MobileSelect label={copy.seats} value={params.seats || ""} onChange={(value) => update("seats", value)} options={Array.from({ length: 100 }, (_item, index) => String(index + 1))} any={copy.any} />
        <MobileSelect label={copy.wheel} value={params.wheelSize || ""} onChange={(value) => update("wheelSize", value)} options={availableOptions.wheelSize || []} any={copy.any} />
        <MobileSelect label={copy.location} value={params.location || ""} onChange={(value) => update("location", value)} options={availableOptions.location || []} any={copy.any} />
        <MobileSelect label={copy.exportStatus} value={params.exportStatus || ""} onChange={(value) => update("exportStatus", value)} options={EXPORT_STATUS_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.service} value={params.serviceHistory || ""} onChange={(value) => update("serviceHistory", value)} options={SERVICE_HISTORY_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.availability} value={params.availability || ""} onChange={(value) => update("availability", value)} options={PRODUCT_STATUS_OPTIONS} optionLabel={(value) => translateVehicleValue(value, language)} any={copy.any} />
        <MobileSelect label={copy.safety} value={params.safety || ""} onChange={(value) => update("safety", value)} options={availableOptions.safety || []} any={copy.any} />
        <div className="col-span-2"><p className="px-1 text-xs font-bold text-zinc-500">{copy.horsepower}</p><RangeFields firstKey="minPowerHp" secondKey="maxPowerHp" params={params} update={update} copy={copy} compact /></div>
      </div></section>
      <section><h3 className="font-extrabold">{copy.sort}</h3><select value={params.sort || "-createdAt"} onChange={(e) => update("sort", e.target.value)} className="mt-3 h-12 w-full rounded-2xl border bg-transparent px-4 font-bold dark:border-white/10"><option value="-createdAt">{copy.newest}</option><option value="price">{copy.priceLow}</option><option value="-price">{copy.priceHigh}</option><option value="-views">{copy.mostViewed}</option></select></section></div>
      <div className="sticky bottom-0 flex gap-2 border-t bg-white/95 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"><button onClick={reset} className="inline-flex h-12 items-center gap-2 rounded-xl border px-3 text-sm font-bold sm:px-4 dark:border-white/10"><RotateCcw className="h-4 w-4" />{copy.reset}</button><button onClick={() => setDrawerOpen(false)} className="h-12 min-w-0 flex-1 truncate rounded-xl bg-brand px-3 font-extrabold text-white">{copy.show} {total.toLocaleString()} {copy.cars}</button></div></motion.aside></motion.div> : null}</AnimatePresence>
  </>;
}

function RangeFields({ firstKey, secondKey, params, update, copy, compact = false }: { firstKey: string; secondKey: string; params: Params; update: (key: string, value: string) => void; copy: Record<string, string>; compact?: boolean }) {
  return <div className={`grid grid-cols-2 gap-3 ${compact ? "pt-2" : "p-4"}`}><label className="min-w-0 rounded-xl border p-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-500">{copy.min}</span><input type="number" min="0" value={params[firstKey] || ""} onChange={(e) => update(firstKey, e.target.value)} placeholder={copy.any} className="mt-1 w-full min-w-0 bg-transparent font-bold outline-none" /></label><label className="min-w-0 rounded-xl border p-3 dark:border-white/10"><span className="text-[10px] font-bold text-zinc-500">{copy.max}</span><input type="number" min="0" value={params[secondKey] || ""} onChange={(e) => update(secondKey, e.target.value)} placeholder={copy.any} className="mt-1 w-full min-w-0 bg-transparent font-bold outline-none" /></label></div>;
}

function MobileSelect({ label, value, onChange, options, any, optionLabel }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; any: string; optionLabel?: (value: string) => string }) {
  return <label className="min-w-0 rounded-xl border p-3 dark:border-white/10"><span className="block truncate text-[10px] font-extrabold uppercase tracking-[.12em] text-zinc-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full min-w-0 bg-transparent text-sm font-bold outline-none"><option value="">{any}</option>{options.map((option) => <option key={option} value={option}>{optionLabel ? optionLabel(option) : option}</option>)}</select></label>;
}

function ApplyBar({ reset, apply, total, copy }: { reset: () => void; apply: () => void; total: number; copy: Record<string, string> }) {
  return <div className="flex gap-3 border-t p-4 dark:border-white/10"><button onClick={reset} className="h-11 rounded-xl bg-zinc-200 px-6 font-bold dark:bg-white/10">{copy.reset}</button><button onClick={apply} className="h-11 flex-1 rounded-xl bg-brand px-5 font-bold text-white">{copy.show} {total.toLocaleString()} {copy.cars}</button></div>;
}
