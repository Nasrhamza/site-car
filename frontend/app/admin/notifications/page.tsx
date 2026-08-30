"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bell, CarFront, CheckCheck, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/site-language";
import { currency, resolveMediaUrl } from "@/lib/utils";

export default function AdminNotificationsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const load = () => api.get("/admin/notifications").then(({ data }) => { setItems(data?.items || []); setUnread(data?.unread || 0); });
  useEffect(() => { load(); }, []);
  const syncUnread = (nextUnread: number) => {
    setUnread(nextUnread);
    window.dispatchEvent(new CustomEvent("admin-notifications-changed", { detail: { unread: nextUnread } }));
  };
  const removeNotification = async (item: any) => {
    if (!confirm(ar ? "هل تريد حذف هذا الإشعار؟" : "Delete this notification?")) return;
    await api.delete(`/admin/notifications/${item._id}`);
    setItems((current) => current.filter((entry) => entry._id !== item._id));
    syncUnread(Math.max(0, unread - (item.read ? 0 : 1)));
  };
  const removeSellerVehicle = async (item: any) => {
    if (!item.car?._id || !confirm(ar ? "هل تريد حذف مركبة البائع نهائياً؟" : "Permanently delete this seller vehicle?")) return;
    await api.delete(`/cars/${item.car._id}`);
    await api.delete(`/admin/notifications/${item._id}`);
    setItems((current) => current.filter((entry) => entry._id !== item._id));
    syncUnread(Math.max(0, unread - (item.read ? 0 : 1)));
  };
  const localized = (item: any) => { if (!ar) return { title: item.title, message: item.message }; const actor = item.actor?.showroomName || item.actor?.name || item.actor?.email || "بائع"; const car = item.car?.name || "مركبة"; if (item.type === "SellerAccountRequested") return { title: "طلب حساب بائع جديد", message: `${actor} طلب حساب بائع` }; if (item.type === "SellerCarSubmitted") return { title: "مركبة جديدة للمراجعة", message: `${actor} أضاف ${car}` }; if (item.type === "SellerCarUpdated") return { title: "عدّل البائع مركبة", message: `${actor} عدّل ${car}` }; return { title: item.title, message: item.message }; };
  return <section className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-zinc-950 p-7 text-white"><div><p className="text-sm font-black uppercase tracking-[.25em] text-emerald-400">{ar ? "تنبيهات النشاط" : "Activity alerts"}</p><h1 className="mt-3 text-4xl font-black">{ar ? "الإشعارات" : "Notifications"} <span className="text-brand">{unread || ""}</span></h1></div><div className="flex flex-wrap gap-2"><button type="button" onClick={async () => { await api.patch("/admin/notifications/read-all"); setItems((current) => current.map((item) => ({ ...item, read: true }))); syncUnread(0); }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950"><CheckCheck className="h-4 w-4" />{ar ? "تحديد الكل كمقروء" : "Mark all read"}</button>{items.length ? <button type="button" onClick={async () => { if (!confirm(ar ? "هل تريد حذف كل الإشعارات؟" : "Delete all notifications?")) return; await api.delete("/admin/notifications"); setItems([]); syncUnread(0); }} className="inline-flex items-center gap-2 rounded-2xl border border-red-400/50 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/10"><Trash2 className="h-4 w-4" />{ar ? "حذف الكل" : "Delete all"}</button> : null}</div></div>
    <div className="grid gap-3">{items.map((item) => { const copy = localized(item); const isSellerCar = item.type === "SellerCarSubmitted" || item.type === "SellerCarUpdated"; return <article key={item._id} className={`rounded-[22px] border p-5 ${item.read ? "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900" : "border-red-200 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/5"}`}><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white"><Bell className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-black">{copy.title}</h2><time className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString(ar ? "ar-TN" : "en-GB")}</time></div><p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{copy.message}</p>{isSellerCar && item.car?._id ? <Link href={`/admin/cars/edit/${item.car._id}`} className="mt-4 grid overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-white/5 sm:grid-cols-[150px_minmax(0,1fr)]"><Image src={resolveMediaUrl(item.car.images?.[0]?.url) || "/guide-import.svg"} alt={item.car.name || "Vehicle"} width={150} height={100} className="h-32 w-full object-cover sm:h-full" /><div className="min-w-0 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-lg font-black text-zinc-950 dark:text-white">{item.car.name}</p><p className="mt-1 text-sm text-zinc-500">{item.car.brand} {item.car.model ? `· ${item.car.model}` : ""} {item.car.year ? `· ${item.car.year}` : ""}</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${item.car.moderationStatus === "Approved" ? "bg-emerald-100 text-emerald-800" : item.car.moderationStatus === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>{item.car.moderationStatus || "Pending"}</span></div><p className="mt-3 font-black text-brand">{Number(item.car.price) > 0 ? currency(Number(item.car.price)) : (ar ? "السعر عند الطلب" : "Price on request")}</p><p className="mt-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">{ar ? "اضغط لمشاهدة كل التفاصيل والصور" : "Click to view all details and photos"}</p></div></Link> : null}<div className="mt-3 flex flex-wrap gap-2">{item.car?._id ? <Link href={`/admin/cars/edit/${item.car._id}`} className="rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white">{ar ? "عرض السيارة كاملة" : "View full vehicle"}</Link> : null}{item.type === "SellerAccountRequested" ? <Link href="/admin/sellers" className="rounded-xl bg-zinc-950 px-3 py-2 text-xs font-bold text-white">{ar ? "فتح حسابات البائعين" : "Open seller accounts"}</Link> : null}{!item.read ? <button type="button" onClick={async () => { await api.patch(`/admin/notifications/${item._id}/read`); setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, read: true } : entry)); syncUnread(Math.max(0, unread - 1)); }} className="rounded-xl border px-3 py-2 text-xs font-bold">{ar ? "تحديد كمقروء" : "Mark read"}</button> : null}{isSellerCar && item.car?._id ? <button type="button" onClick={() => removeSellerVehicle(item)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"><CarFront className="h-3.5 w-3.5" />{ar ? "حذف مركبة البائع" : "Delete seller vehicle"}</button> : null}<button type="button" onClick={() => removeNotification(item)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600"><Trash2 className="h-3.5 w-3.5" />{ar ? "حذف الإشعار" : "Delete notification"}</button></div></div></div></article>; })}{!items.length ? <div className="rounded-[24px] border border-dashed p-10 text-center text-zinc-500">{ar ? "لا توجد إشعارات بعد." : "No notifications yet."}</div> : null}</div>
  </section>;
}
