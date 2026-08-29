"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, EyeOff, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import { getCategoryDisplayLabel, getStatusLabel } from "@/lib/company";
import { currency, resolveMediaUrl } from "@/lib/utils";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

const moderationStyle: Record<string, string> = { Pending: "bg-amber-100 text-amber-800", Approved: "bg-emerald-100 text-emerald-800", Rejected: "bg-red-100 text-red-700", Hidden: "bg-zinc-200 text-zinc-700" };

export default function AdminCarsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchCars = async () => { try { setLoading(true); const { data } = await api.get("/cars/manage", { params: { page: 1, limit: 200 } }); setCars(data?.items || []); setError(""); } catch (requestError: any) { setError(requestError?.response?.data?.message || (ar ? "تعذر تحميل المركبات." : "Unable to load vehicles.")); } finally { setLoading(false); } };
  useEffect(() => { fetchCars(); }, []);

  const moderate = async (car: any, moderationStatus: string) => {
    const moderationNote = moderationStatus === "Rejected" ? (prompt(ar ? "سبب الرفض / ملاحظة للبائع" : "Rejection reason / note for seller") || "") : "";
    const { data } = await api.patch(`/cars/${car._id}/moderation`, { moderationStatus, moderationNote });
    setCars((current) => current.map((item) => item._id === car._id ? data.item : item));
  };

  const updatePricing = async (car: any) => {
    const sellerPriceRaw = prompt(ar ? "سعر البائع (AED)" : "Seller price (AED)", String(car.sellerPrice ?? car.price ?? 0));
    if (sellerPriceRaw === null) return;
    const feeRaw = prompt(ar ? "مصاريف ALHADUNICARS (AED)" : "ALHADUNICARS fees (AED)", String(car.serviceFee ?? 17000));
    if (feeRaw === null) return;
    const { data } = await api.patch(`/cars/${car._id}/pricing`, { sellerPrice: Number(sellerPriceRaw), serviceFee: Number(feeRaw) });
    setCars((current) => current.map((item) => item._id === car._id ? data.item : item));
  };

  const moderationLabel = (value: string) => ar ? ({ Pending: "قيد المراجعة", Approved: "مقبولة", Rejected: "مرفوضة", Hidden: "مخفية" } as Record<string, string>)[value] || value : value;
  return <div className="space-y-6"><div className="flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-black uppercase tracking-[.25em] text-brand">{ar ? "مخزون الإدارة" : "Admin inventory"}</p><h1 className="mt-2 text-3xl font-black">{ar ? "إدارة المركبات" : "Vehicle management"}</h1><p className="mt-2 text-zinc-500">{ar ? "مركبات الإدارة والبائعين، الموافقة، التسعير والحالة." : "Admin and seller vehicles, moderation, pricing, and status."}</p></div><Link href="/admin/cars/new" className="rounded-2xl bg-brand px-5 py-3 text-center font-black text-white">{ar ? "+ إضافة مركبة" : "+ Add vehicle"}</Link></div>
    {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}
    <div className="overflow-x-auto rounded-[28px] border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900"><table className="min-w-[1180px] w-full text-sm"><thead className="bg-zinc-100 text-left dark:bg-white/5"><tr><th className="p-4">{ar ? "المركبة" : "Vehicle"}</th><th className="p-4">{ar ? "البائع" : "Seller"}</th><th className="p-4">{ar ? "الموافقة" : "Moderation"}</th><th className="p-4">{ar ? "التسعير" : "Pricing"}</th><th className="p-4">{ar ? "السنة / الحالة" : "Year / status"}</th><th className="p-4">{ar ? "الإجراءات" : "Actions"}</th></tr></thead><tbody>{loading ? <tr><td colSpan={6} className="p-8 text-center text-zinc-500">{ar ? "جار التحميل..." : "Loading..."}</td></tr> : cars.map((car) => <tr key={car._id} className="border-t border-zinc-200 align-top dark:border-white/10"><td className="p-4"><div className="flex min-w-[250px] gap-3"><Image src={resolveMediaUrl(car.images?.[0]?.url) || "/guide-import.svg"} alt={car.name} width={96} height={64} className="h-16 w-24 rounded-xl object-cover" /><div><p className="font-black">{car.name}</p><p className="text-xs text-zinc-500">{car.brand} · {car.model}</p><p className="mt-1 text-xs">{getCategoryDisplayLabel(car.category, language)}</p></div></div></td><td className="p-4"><p className="font-bold">{car.owner?.showroomName || car.owner?.name || "ALHADUNICARS"}</p><p className="mt-1 text-xs text-zinc-500">{car.owner?.email || (ar ? "إعلان الإدارة" : "Admin listing")}</p></td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${moderationStyle[car.moderationStatus || "Approved"]}`}>{moderationLabel(car.moderationStatus || "Approved")}</span>{car.moderationNote ? <p className="mt-2 max-w-[180px] text-xs text-red-600">{car.moderationNote}</p> : null}</td><td className="p-4"><div className="min-w-[180px] space-y-1 text-xs"><p>{ar ? "البائع" : "Seller"}: <b>{car.owner ? currency(Number(car.sellerPrice ?? 0)) : "—"}</b></p><p>{ar ? "المصاريف" : "Fees"}: <b>{car.owner ? currency(Number(car.serviceFee ?? 17000)) : "—"}</b></p><p>{ar ? "الموقع" : "Site"}: <b className="text-brand">{Number(car.price) > 0 ? currency(Number(car.price)) : (ar ? "عند الطلب" : "On request")}</b></p></div></td><td className="p-4"><p className="font-bold">{car.year}</p><p className="mt-1 text-xs text-zinc-500">{ar ? getStatusLabel(car.availability || car.status || "Disponible") : translateVehicleValue(car.availability || car.status || "Disponible", "en")}</p></td><td className="p-4"><div className="flex min-w-[250px] flex-wrap gap-2">{car.moderationStatus === "Pending" || car.moderationStatus === "Rejected" ? <button onClick={() => moderate(car, "Approved")} className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><Check className="h-3.5 w-3.5" />{ar ? "قبول" : "Approve"}</button> : null}{car.moderationStatus === "Pending" ? <button onClick={() => moderate(car, "Rejected")} className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white"><X className="h-3.5 w-3.5" />{ar ? "رفض" : "Reject"}</button> : null}{car.moderationStatus === "Approved" || !car.moderationStatus ? <button onClick={() => moderate(car, "Hidden")} className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold"><EyeOff className="h-3.5 w-3.5" />{ar ? "إخفاء" : "Hide"}</button> : null}{car.owner ? <button onClick={() => updatePricing(car)} className="inline-flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-zinc-950"><SlidersHorizontal className="h-3.5 w-3.5" />{ar ? "التسعير" : "Pricing"}</button> : null}<Link href={`/admin/cars/edit/${car._id}`} className="rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white">{ar ? "تعديل" : "Edit"}</Link><button onClick={async () => { if (!confirm(ar ? "هل تريد حذف هذه المركبة؟" : "Delete this vehicle?")) return; await api.delete(`/cars/${car._id}`); setCars((current) => current.filter((item) => item._id !== car._id)); }} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600">{ar ? "حذف" : "Delete"}</button></div></td></tr>)}{!loading && !cars.length ? <tr><td colSpan={6} className="p-8 text-center text-zinc-500">{ar ? "لا توجد مركبات" : "No vehicles"}</td></tr> : null}</tbody></table></div>
  </div>;
}
