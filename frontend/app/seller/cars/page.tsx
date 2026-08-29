"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { currency, resolveMediaUrl } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

const moderationStyle: Record<string, string> = { Pending: "bg-amber-100 text-amber-800", Approved: "bg-emerald-100 text-emerald-800", Rejected: "bg-red-100 text-red-700", Hidden: "bg-zinc-200 text-zinc-700" };

export default function SellerCarsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => api.get("/cars/manage", { params: { limit: 200 } }).then(({ data }) => { setCars(data?.items || []); setError(""); }).catch((requestError) => setError(requestError?.response?.data?.message || (ar ? "تعذر تحميل المركبات" : "Unable to load vehicles"))).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  return <section className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"><div><p className="text-sm font-black uppercase tracking-[.2em] text-brand">{ar ? "مخزون البائع" : "Seller inventory"}</p><h1 className="mt-2 text-3xl font-black">{ar ? "مركباتي" : "My vehicles"}</h1></div><Link href="/seller/cars/new" className="rounded-2xl bg-brand px-5 py-3 font-black text-white">{ar ? "+ إضافة مركبة" : "+ Add vehicle"}</Link></div>
    {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}
    <div className="grid gap-4">{loading ? <div className="rounded-2xl bg-white p-6">{ar ? "جار التحميل..." : "Loading..."}</div> : cars.map((car) => <article key={car._id} className="grid gap-4 rounded-[24px] border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-center">
      <div className="relative h-28 overflow-hidden rounded-2xl"><Image src={resolveMediaUrl(car.images?.[0]?.url) || "/guide-import.svg"} alt={car.name} fill className="object-cover" sizes="150px" /></div>
      <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-black">{car.name}</h2><span className={`rounded-full px-3 py-1 text-xs font-black ${moderationStyle[car.moderationStatus || "Approved"]}`}>{ar ? ({ Pending: "قيد المراجعة", Approved: "مقبولة", Rejected: "مرفوضة", Hidden: "مخفية" } as any)[car.moderationStatus || "Approved"] : car.moderationStatus || "Approved"}</span></div><p className="mt-1 text-sm text-zinc-500">{car.brand} · {car.model} · {car.year}</p><div className="mt-3 flex flex-wrap gap-4 text-xs"><span>{ar ? "سعرك" : "Your price"}: <b>{Number(car.sellerPrice) >= 0 ? currency(Number(car.sellerPrice)) : "—"}</b></span><span>{ar ? "مصاريف ALHADUNICARS" : "ALHADUNICARS fees"}: <b>{currency(Number(car.serviceFee ?? 17000))}</b></span><span>{ar ? "سعر الموقع" : "Site price"}: <b className="text-brand">{Number(car.price) > 0 ? currency(Number(car.price)) : (ar ? "عند الطلب" : "On request")}</b></span></div>{car.moderationNote ? <p className="mt-2 text-xs font-bold text-red-600">{ar ? "ملاحظة الإدارة" : "Admin note"}: {car.moderationNote}</p> : null}</div>
      <div className="flex gap-2 md:flex-col"><Link href={`/seller/cars/edit/${car._id}`} className="rounded-xl bg-zinc-950 px-4 py-2 text-center text-sm font-bold text-white">{ar ? "تعديل" : "Edit"}</Link><button type="button" onClick={async () => { if (!confirm(ar ? "هل تريد حذف هذه المركبة؟" : "Delete this vehicle?")) return; await api.delete(`/cars/${car._id}`); setCars((current) => current.filter((item) => item._id !== car._id)); }} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600">{ar ? "حذف" : "Delete"}</button></div>
    </article>)}{!loading && !cars.length ? <div className="rounded-[24px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">{ar ? "لا توجد مركبات بعد." : "No vehicles yet."}</div> : null}</div>
  </section>;
}
