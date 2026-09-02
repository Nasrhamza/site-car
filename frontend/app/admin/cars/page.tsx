"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownAZ, CarFront, Check, ChevronLeft, ChevronRight, Clock3, Eye, EyeOff, RotateCcw, Search, SlidersHorizontal, Store, X } from "lucide-react";
import { api } from "@/lib/api";
import { getCategoryDisplayLabel, getStatusLabel } from "@/lib/company";
import { currency, resolveMediaUrl } from "@/lib/utils";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

const moderationStyle: Record<string, string> = { Pending: "bg-amber-100 text-amber-800", Approved: "bg-emerald-100 text-emerald-800", Rejected: "bg-red-100 text-red-700", Hidden: "bg-zinc-200 text-zinc-700" };
const initialFilters = { search: "", category: "", brand: "", source: "", owner: "", moderationStatus: "", availability: "", priceType: "", visibility: "", sort: "newest" };
type Filters = typeof initialFilters;
type SellerOption = { _id: string; name?: string; showroomName?: string; email?: string; accountStatus?: string };

export default function AdminCarsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const requestId = useRef(0);
  const [cars, setCars] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filterOptions, setFilterOptions] = useState<{ categories: string[]; brands: string[]; sellers: SellerOption[] }>({ categories: [], brands: [], sellers: [] });
  const [counts, setCounts] = useState({ total: 0, admin: 0, seller: 0, pending: 0, rejected: 0, hidden: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const copy = ar ? {
    eyebrow: "مخزون الإدارة", title: "إدارة المركبات", intro: "ابحث وفرز مركبات الإدارة والبائعين حسب كل التفاصيل.", add: "+ إضافة مركبة",
    all: "كل المركبات", admin: "مركبات الإدارة", sellers: "مركبات البائعين", pending: "بانتظار الموافقة", rejected: "مرفوضة", hidden: "مخفية",
    search: "ابحث بالاسم أو الماركة أو الموديل أو البائع...", category: "كل الفئات", brand: "كل الماركات", source: "كل المصادر", seller: "كل البائعين",
    moderation: "كل حالات الموافقة", availability: "كل حالات الإعلان", priceType: "كل أنواع السعر", visibility: "الظهور الكل", sort: "الترتيب", reset: "مسح الفلاتر",
    adminSource: "الإدارة فقط", sellerSource: "البائعون فقط", visible: "ظاهرة في الموقع", hiddenOnly: "مخفية فقط", newest: "الأحدث أولاً", oldest: "الأقدم أولاً",
    nameAsc: "الاسم أ–ي", nameDesc: "الاسم ي–أ", categoryAsc: "حسب الفئة", sellerAsc: "حسب البائع", yearDesc: "السنة: الأحدث", yearAsc: "السنة: الأقدم",
    priceDesc: "السعر: الأعلى", priceAsc: "السعر: الأقل", mostViewed: "الأكثر مشاهدة", results: "نتيجة", loading: "جار التحميل...", noCars: "لا توجد مركبات مطابقة للفلاتر.",
    vehicle: "المركبة", sellerColumn: "البائع", moderationColumn: "الموافقة", pricing: "التسعير", yearStatus: "السنة / الحالة", actions: "الإجراءات",
    approve: "قبول", reject: "رفض", hide: "إخفاء", show: "إظهار", edit: "تعديل", remove: "حذف", fees: "المصاريف", site: "الموقع", adminListing: "إعلان الإدارة",
    previous: "السابق", next: "التالي", page: "صفحة", loadError: "تعذر تحميل المركبات.", deleteConfirm: "هل تريد حذف هذه المركبة؟", rejectionNote: "سبب الرفض / ملاحظة للبائع"
  } : {
    eyebrow: "Admin inventory", title: "Vehicle management", intro: "Search and sort admin and seller vehicles using every useful detail.", add: "+ Add vehicle",
    all: "All vehicles", admin: "Admin vehicles", sellers: "Seller vehicles", pending: "Pending approval", rejected: "Rejected", hidden: "Hidden",
    search: "Search name, make, model, or seller...", category: "All categories", brand: "All makes", source: "All sources", seller: "All sellers",
    moderation: "All moderation states", availability: "All listing statuses", priceType: "All price types", visibility: "All visibility", sort: "Sort", reset: "Reset filters",
    adminSource: "Admin only", sellerSource: "Sellers only", visible: "Visible on site", hiddenOnly: "Hidden only", newest: "Newest first", oldest: "Oldest first",
    nameAsc: "Name A–Z", nameDesc: "Name Z–A", categoryAsc: "By category", sellerAsc: "By seller", yearDesc: "Year: newest", yearAsc: "Year: oldest",
    priceDesc: "Price: high to low", priceAsc: "Price: low to high", mostViewed: "Most viewed", results: "results", loading: "Loading...", noCars: "No vehicles match these filters.",
    vehicle: "Vehicle", sellerColumn: "Seller", moderationColumn: "Moderation", pricing: "Pricing", yearStatus: "Year / status", actions: "Actions",
    approve: "Approve", reject: "Reject", hide: "Hide", show: "Show", edit: "Edit", remove: "Delete", fees: "Fees", site: "Site", adminListing: "Admin listing",
    previous: "Previous", next: "Next", page: "Page", loadError: "Unable to load vehicles.", deleteConfirm: "Delete this vehicle?", rejectionNote: "Rejection reason / note for seller"
  };

  const fetchCars = useCallback(async () => {
    const currentRequest = ++requestId.current;
    try {
      setLoading(true);
      const { data } = await api.get("/cars/manage", { params: { page, limit: 25, ...filters } });
      if (currentRequest !== requestId.current) return;
      setCars(data?.items || []);
      setTotal(Number(data?.total) || 0);
      setPages(Math.max(1, Number(data?.pages) || 1));
      if (data?.filters) setFilterOptions(data.filters);
      if (data?.counts) setCounts(data.counts);
      setError("");
    } catch (requestError: any) {
      if (currentRequest === requestId.current) setError(requestError?.response?.data?.message || copy.loadError);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [copy.loadError, filters, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCars(), filters.search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [fetchCars, filters.search]);

  const updateFilter = (key: keyof Filters, value: string) => { setPage(1); setFilters((current) => ({ ...current, [key]: value })); };
  const applyQuickFilter = (values: Partial<Filters>) => { setPage(1); setFilters({ ...initialFilters, sort: filters.sort, ...values }); };

  const moderate = async (car: any, moderationStatus: string) => {
    const moderationNote = moderationStatus === "Rejected" ? (prompt(copy.rejectionNote) || "") : "";
    try { await api.patch(`/cars/${car._id}/moderation`, { moderationStatus, moderationNote }); await fetchCars(); }
    catch (requestError: any) { setError(requestError?.response?.data?.message || copy.loadError); }
  };

  const updatePricing = async (car: any) => {
    const sellerPriceRaw = prompt(ar ? "سعر البائع (AED)" : "Seller price (AED)", String(car.sellerPrice ?? car.price ?? 0));
    if (sellerPriceRaw === null) return;
    const feeRaw = prompt(ar ? "مصاريف ALHADUNICARS (AED)" : "ALHADUNICARS fees (AED)", String(car.serviceFee ?? 17000));
    if (feeRaw === null) return;
    try { await api.patch(`/cars/${car._id}/pricing`, { sellerPrice: Number(sellerPriceRaw), serviceFee: Number(feeRaw) }); await fetchCars(); }
    catch (requestError: any) { setError(requestError?.response?.data?.message || copy.loadError); }
  };

  const removeCar = async (car: any) => {
    if (!confirm(copy.deleteConfirm)) return;
    try {
      await api.delete(`/cars/${car._id}`);
      if (cars.length === 1 && page > 1) setPage((current) => current - 1); else await fetchCars();
    } catch (requestError: any) { setError(requestError?.response?.data?.message || copy.loadError); }
  };

  const moderationLabel = (value: string) => ar ? ({ Pending: "قيد المراجعة", Approved: "مقبولة", Rejected: "مرفوضة", Hidden: "مخفية" } as Record<string, string>)[value] || value : value;
  const sellerLabel = (seller: SellerOption) => seller.showroomName || seller.name || seller.email || "Seller";
  const hasFilters = Object.entries(filters).some(([key, value]) => key === "sort" ? value !== "newest" : Boolean(value));
  const hasDataFilters = Object.entries(filters).some(([key, value]) => key !== "sort" && Boolean(value));
  const summaryCards = [
    { label: copy.all, value: counts.total, icon: CarFront, active: !hasDataFilters, action: () => applyQuickFilter({}) },
    { label: copy.admin, value: counts.admin, icon: CarFront, active: filters.source === "admin", action: () => applyQuickFilter({ source: "admin" }) },
    { label: copy.sellers, value: counts.seller, icon: Store, active: filters.source === "seller" && !filters.owner, action: () => applyQuickFilter({ source: "seller" }) },
    { label: copy.pending, value: counts.pending, icon: Clock3, active: filters.moderationStatus === "Pending", action: () => applyQuickFilter({ moderationStatus: "Pending" }) },
    { label: copy.rejected, value: counts.rejected, icon: X, active: filters.moderationStatus === "Rejected", action: () => applyQuickFilter({ moderationStatus: "Rejected" }) },
    { label: copy.hidden, value: counts.hidden, icon: EyeOff, active: filters.visibility === "hidden", action: () => applyQuickFilter({ visibility: "hidden" }) }
  ];

  return <div className="space-y-5">
    <header className="flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-black uppercase tracking-[.25em] text-brand">{copy.eyebrow}</p><h1 className="mt-2 text-3xl font-black">{copy.title}</h1><p className="mt-2 text-zinc-500">{copy.intro}</p></div><Link href="/admin/cars/new" className="shrink-0 rounded-2xl bg-brand px-5 py-3 text-center font-black text-white">{copy.add}</Link></header>

    <section className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">{summaryCards.map(({ label, value, icon: Icon, active, action }) => <button key={label} type="button" onClick={action} className={`rounded-2xl border p-4 text-left transition ${active ? "border-brand bg-brand text-white shadow-lg shadow-brand/15" : "border-zinc-200 bg-white hover:border-brand/40 dark:border-white/10 dark:bg-zinc-900"}`}><Icon className="h-5 w-5" /><p className="mt-4 text-2xl font-black">{value}</p><p className={`mt-1 text-xs font-bold ${active ? "text-white/80" : "text-zinc-500"}`}>{label}</p></button>)}</section>

    <section className="rounded-[26px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative md:col-span-2"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 rtl:left-auto rtl:right-4" /><input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder={copy.search} className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none transition focus:border-brand dark:border-white/10 dark:bg-white/5 rtl:pl-4 rtl:pr-11" /></label>
        <FilterSelect value={filters.category} onChange={(value) => updateFilter("category", value)} label={copy.category} options={filterOptions.categories.map((value) => ({ value, label: getCategoryDisplayLabel(value, language) }))} />
        <FilterSelect value={filters.brand} onChange={(value) => updateFilter("brand", value)} label={copy.brand} options={filterOptions.brands.map((value) => ({ value, label: value }))} />
        <FilterSelect value={filters.source} onChange={(value) => { setPage(1); setFilters((current) => ({ ...current, source: value, owner: value === "admin" ? "" : current.owner })); }} label={copy.source} options={[{ value: "admin", label: copy.adminSource }, { value: "seller", label: copy.sellerSource }]} />
        <FilterSelect value={filters.owner} onChange={(value) => { setPage(1); setFilters((current) => ({ ...current, owner: value, source: value ? "seller" : current.source })); }} label={copy.seller} options={filterOptions.sellers.map((seller) => ({ value: seller._id, label: `${sellerLabel(seller)}${seller.email ? ` · ${seller.email}` : ""}` }))} disabled={filters.source === "admin"} />
        <FilterSelect value={filters.moderationStatus} onChange={(value) => updateFilter("moderationStatus", value)} label={copy.moderation} options={["Pending", "Approved", "Rejected", "Hidden"].map((value) => ({ value, label: moderationLabel(value) }))} />
        <FilterSelect value={filters.availability} onChange={(value) => updateFilter("availability", value)} label={copy.availability} options={["Disponible", "Reserve", "Vendu", "Masque"].map((value) => ({ value, label: ar ? getStatusLabel(value) : translateVehicleValue(value, "en") }))} />
        <FilterSelect value={filters.priceType} onChange={(value) => updateFilter("priceType", value)} label={copy.priceType} options={[{ value: "Prix fixe", label: ar ? "سعر ثابت" : "Fixed price" }, { value: "Negociable", label: ar ? "قابل للتفاوض" : "Negotiable" }, { value: "Sur demande", label: ar ? "عند الطلب" : "On request" }]} />
        <FilterSelect value={filters.visibility} onChange={(value) => updateFilter("visibility", value)} label={copy.visibility} options={[{ value: "visible", label: copy.visible }, { value: "hidden", label: copy.hiddenOnly }]} />
        <FilterSelect value={filters.sort} onChange={(value) => updateFilter("sort", value)} label={copy.sort} options={[["newest", copy.newest], ["oldest", copy.oldest], ["nameAsc", copy.nameAsc], ["nameDesc", copy.nameDesc], ["categoryAsc", copy.categoryAsc], ["sellerAsc", copy.sellerAsc], ["yearDesc", copy.yearDesc], ["yearAsc", copy.yearAsc], ["priceDesc", copy.priceDesc], ["priceAsc", copy.priceAsc], ["mostViewed", copy.mostViewed]].map(([value, label]) => ({ value, label }))} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-white/10"><p className="inline-flex items-center gap-2 text-sm font-bold"><ArrowDownAZ className="h-4 w-4 text-brand" /><span className="text-brand">{total}</span> {copy.results}</p>{hasFilters ? <button type="button" onClick={() => { setFilters(initialFilters); setPage(1); }} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold transition hover:border-brand hover:text-brand dark:border-white/10"><RotateCcw className="h-4 w-4" />{copy.reset}</button> : null}</div>
    </section>

    {error ? <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
    <div className="admin-table-scroll relative max-w-full overflow-x-auto rounded-[28px] border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
      <table className="w-full min-w-[1000px] table-fixed text-sm"><colgroup><col className="w-[28%]" /><col className="w-[16%]" /><col className="w-[12%]" /><col className="w-[16%]" /><col className="w-[10%]" /><col className="w-[18%]" /></colgroup>
        <thead className="bg-zinc-100 text-left dark:bg-zinc-800"><tr><th className="p-3">{copy.vehicle}</th><th className="p-3">{copy.sellerColumn}</th><th className="p-3">{copy.moderationColumn}</th><th className="p-3">{copy.pricing}</th><th className="p-3">{copy.yearStatus}</th><th className="sticky right-0 z-20 border-l border-zinc-200 bg-zinc-100 p-3 shadow-[-8px_0_18px_-14px_rgba(0,0,0,.5)] dark:border-white/10 dark:bg-zinc-800">{copy.actions}</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={6} className="p-10 text-center text-zinc-500">{copy.loading}</td></tr> : cars.map((car) => <tr key={car._id} className="border-t border-zinc-200 align-top transition hover:bg-zinc-50/70 dark:border-white/10 dark:hover:bg-white/[.03]">
          <td className="p-3"><div className="flex min-w-0 gap-3"><Image src={resolveMediaUrl(car.images?.[0]?.url) || "/guide-import.svg"} alt={car.name} width={88} height={64} className="h-16 w-[88px] shrink-0 rounded-xl object-cover" /><div className="min-w-0"><p className="break-words font-black leading-5">{car.name}</p><p className="mt-0.5 break-words text-xs text-zinc-500">{car.brand} · {car.model}</p><p className="mt-1 text-xs font-bold text-brand">{getCategoryDisplayLabel(car.category, language)}</p></div></div></td>
          <td className="p-3"><p className="break-words font-bold">{car.owner?.showroomName || car.owner?.name || "ALHADUNICARS"}</p><p className="mt-1 break-all text-xs text-zinc-500">{car.owner?.email || copy.adminListing}</p></td>
          <td className="p-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${moderationStyle[car.moderationStatus || "Approved"]}`}>{moderationLabel(car.moderationStatus || "Approved")}</span>{car.moderationNote ? <p className="mt-2 break-words text-xs text-red-600">{car.moderationNote}</p> : null}</td>
          <td className="p-3"><div className="space-y-1 text-xs"><p>{copy.sellerColumn}: <b>{car.owner ? currency(Number(car.sellerPrice ?? 0)) : "—"}</b></p><p>{copy.fees}: <b>{car.owner ? currency(Number(car.serviceFee ?? 17000)) : "—"}</b></p><p>{copy.site}: <b className="text-brand">{Number(car.price) > 0 ? currency(Number(car.price)) : (ar ? "عند الطلب" : "On request")}</b></p></div></td>
          <td className="p-3"><p className="font-bold">{car.year}</p><p className="mt-1 break-words text-xs text-zinc-500">{ar ? getStatusLabel(car.availability || car.status || "Disponible") : translateVehicleValue(car.availability || car.status || "Disponible", "en")}</p></td>
          <td className="sticky right-0 z-10 border-l border-zinc-200 bg-white p-3 shadow-[-8px_0_18px_-14px_rgba(0,0,0,.5)] dark:border-white/10 dark:bg-zinc-900"><div className="grid grid-cols-2 gap-1.5">{car.moderationStatus === "Pending" || car.moderationStatus === "Rejected" ? <button onClick={() => moderate(car, "Approved")} className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-xs font-bold text-white"><Check className="h-3.5 w-3.5" />{copy.approve}</button> : null}{car.moderationStatus === "Pending" ? <button onClick={() => moderate(car, "Rejected")} className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-2 text-xs font-bold text-white"><X className="h-3.5 w-3.5" />{copy.reject}</button> : null}{car.moderationStatus === "Approved" || !car.moderationStatus ? <button onClick={() => moderate(car, "Hidden")} className="inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-bold"><EyeOff className="h-3.5 w-3.5" />{copy.hide}</button> : null}{car.moderationStatus === "Hidden" ? <button onClick={() => moderate(car, "Approved")} className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-xs font-bold text-white"><Eye className="h-3.5 w-3.5" />{copy.show}</button> : null}{car.owner ? <button onClick={() => updatePricing(car)} className="inline-flex items-center justify-center gap-1 rounded-lg bg-amber-400 px-2 py-2 text-xs font-bold text-zinc-950"><SlidersHorizontal className="h-3.5 w-3.5" />{copy.pricing}</button> : null}<Link href={`/admin/cars/edit/${car._id}`} className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-2 py-2 text-xs font-bold text-white dark:bg-white dark:text-zinc-950">{copy.edit}</Link><button onClick={() => removeCar(car)} className="rounded-lg border border-red-200 px-2 py-2 text-xs font-bold text-red-600">{copy.remove}</button></div></td>
        </tr>)}{!loading && !cars.length ? <tr><td colSpan={6} className="p-10 text-center text-zinc-500">{copy.noCars}</td></tr> : null}</tbody>
      </table>
    </div>
    <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900" aria-label={copy.page}><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-40"><ChevronLeft className="h-4 w-4 rtl:rotate-180" />{copy.previous}</button><p className="text-sm font-black">{copy.page} {page} / {pages}</p><button type="button" disabled={page >= pages || loading} onClick={() => setPage((current) => Math.min(pages, current + 1))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-40">{copy.next}<ChevronRight className="h-4 w-4 rtl:rotate-180" /></button></nav>
  </div>;
}

function FilterSelect({ value, onChange, label, options, disabled = false }: { value: string; onChange: (value: string) => void; label: string; options: Array<{ value: string; label: string }>; disabled?: boolean }) {
  return <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/5"><option value="">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>;
}
