"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/site-language";

export default function AdminNotificationsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const load = () => api.get("/admin/notifications").then(({ data }) => { setItems(data?.items || []); setUnread(data?.unread || 0); });
  useEffect(() => { load(); }, []);
  const localized = (item: any) => { if (!ar) return { title: item.title, message: item.message }; const actor = item.actor?.showroomName || item.actor?.name || item.actor?.email || "بائع"; const car = item.car?.name || "مركبة"; if (item.type === "SellerAccountRequested") return { title: "طلب حساب بائع جديد", message: `${actor} طلب حساب بائع` }; if (item.type === "SellerCarSubmitted") return { title: "مركبة جديدة للمراجعة", message: `${actor} أضاف ${car}` }; if (item.type === "SellerCarUpdated") return { title: "عدّل البائع مركبة", message: `${actor} عدّل ${car}` }; return { title: item.title, message: item.message }; };
  return <section className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-zinc-950 p-7 text-white"><div><p className="text-sm font-black uppercase tracking-[.25em] text-emerald-400">{ar ? "تنبيهات النشاط" : "Activity alerts"}</p><h1 className="mt-3 text-4xl font-black">{ar ? "الإشعارات" : "Notifications"} <span className="text-brand">{unread || ""}</span></h1></div><button type="button" onClick={async () => { await api.patch("/admin/notifications/read-all"); setItems((current) => current.map((item) => ({ ...item, read: true }))); setUnread(0); }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950"><CheckCheck className="h-4 w-4" />{ar ? "تحديد الكل كمقروء" : "Mark all read"}</button></div>
    <div className="grid gap-3">{items.map((item) => { const copy = localized(item); return <article key={item._id} className={`rounded-[22px] border p-5 ${item.read ? "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900" : "border-red-200 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/5"}`}><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white"><Bell className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-black">{copy.title}</h2><time className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString(ar ? "ar-TN" : "en-GB")}</time></div><p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{copy.message}</p><div className="mt-3 flex flex-wrap gap-2">{item.car?._id ? <Link href={`/admin/cars/edit/${item.car._id}`} className="rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white">{ar ? "فتح المركبة" : "Open vehicle"}</Link> : null}{item.type === "SellerAccountRequested" ? <Link href="/admin/sellers" className="rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white">{ar ? "فتح حسابات البائعين" : "Open seller accounts"}</Link> : null}{!item.read ? <button type="button" onClick={async () => { await api.patch(`/admin/notifications/${item._id}/read`); setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, read: true } : entry)); setUnread((current) => Math.max(0, current - 1)); }} className="rounded-xl border px-3 py-2 text-xs font-bold">{ar ? "تحديد كمقروء" : "Mark read"}</button> : null}</div></div></div></article>; })}{!items.length ? <div className="rounded-[24px] border border-dashed p-10 text-center text-zinc-500">{ar ? "لا توجد إشعارات بعد." : "No notifications yet."}</div> : null}</div>
  </section>;
}
