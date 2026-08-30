"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

export default function SellerNotificationsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const syncUnread = (nextUnread: number) => {
    setUnread(nextUnread);
    window.dispatchEvent(new CustomEvent("seller-notifications-changed", { detail: { unread: nextUnread } }));
  };

  useEffect(() => {
    api.get("/seller/notifications")
      .then(({ data }) => { setItems(data?.items || []); syncUnread(Number(data?.unread) || 0); })
      .finally(() => setLoading(false));
  }, []);

  return <section className="space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-zinc-950 p-7 text-white">
      <div><p className="text-sm font-black uppercase tracking-[.25em] text-emerald-400">{ar ? "تحديثات المركبات" : "Vehicle updates"}</p><h1 className="mt-3 text-4xl font-black">{ar ? "الإشعارات" : "Notifications"} <span className="text-brand">{unread || ""}</span></h1></div>
      <div className="flex flex-wrap gap-2">
        {unread ? <button type="button" onClick={async () => { await api.patch("/seller/notifications/read-all"); setItems((current) => current.map((item) => ({ ...item, read: true }))); syncUnread(0); }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950"><CheckCheck className="h-4 w-4" />{ar ? "قراءة الكل" : "Mark all read"}</button> : null}
        {items.length ? <button type="button" onClick={async () => { if (!confirm(ar ? "هل تريد حذف كل الإشعارات؟" : "Delete all notifications?")) return; await api.delete("/seller/notifications"); setItems([]); syncUnread(0); }} className="inline-flex items-center gap-2 rounded-2xl border border-red-400/50 px-4 py-3 text-sm font-black text-red-300"><Trash2 className="h-4 w-4" />{ar ? "حذف الكل" : "Delete all"}</button> : null}
      </div>
    </header>

    <div className="grid gap-3">
      {loading ? <div className="rounded-2xl bg-white p-6 text-zinc-500">{ar ? "جار التحميل..." : "Loading..."}</div> : items.map((item) => {
        const approved = item.metadata?.moderationStatus === "Approved";
        const carName = item.car?.name || (ar ? "المركبة" : "Vehicle");
        const title = ar ? (approved ? "تم قبول مركبتك" : "تم رفض مركبتك") : (approved ? "Your vehicle was approved" : "Your vehicle was rejected");
        const note = item.metadata?.moderationNote || item.car?.moderationNote;
        return <article key={item._id} className={`rounded-[24px] border p-5 ${item.read ? "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900" : approved ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/5" : "border-red-200 bg-red-50/70 dark:border-red-500/20 dark:bg-red-500/5"}`}>
          <div className="flex items-start gap-3"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white ${approved ? "bg-emerald-600" : "bg-brand"}`}><Bell className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><div><h2 className="text-lg font-black">{title}</h2><p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{approved ? (ar ? `تم نشر ${carName} في الموقع.` : `${carName} is now published on the website.`) : (ar ? `لم تتم الموافقة على ${carName}.` : `${carName} was not approved.`)}</p></div><time className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString(ar ? "ar-TN" : "en-GB")}</time></div>
            {item.car?._id ? <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center"><Image src={resolveMediaUrl(item.car.images?.[0]?.url) || "/guide-import.svg"} alt={carName} width={120} height={80} className="h-24 w-full rounded-xl object-cover sm:w-32" /><div className="min-w-0 flex-1"><p className="font-black">{carName}</p><p className="mt-1 text-sm text-zinc-500">{item.car.brand} · {item.car.model} · {item.car.year}</p>{note ? <p className="mt-2 text-sm font-bold text-red-600">{ar ? "سبب الرفض" : "Rejection reason"}: {note}</p> : null}</div></div> : null}
            <div className="mt-4 flex flex-wrap gap-2">{item.car?._id ? <Link href={`/seller/cars/edit/${item.car._id}`} className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white">{ar ? "عرض المركبة" : "View vehicle"}</Link> : null}{!item.read ? <button type="button" onClick={async () => { await api.patch(`/seller/notifications/${item._id}/read`); setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, read: true } : entry)); syncUnread(Math.max(0, unread - 1)); }} className="rounded-xl border px-4 py-2 text-xs font-bold">{ar ? "تحديد كمقروء" : "Mark read"}</button> : null}<button type="button" onClick={async () => { if (!confirm(ar ? "حذف هذا الإشعار؟" : "Delete this notification?")) return; await api.delete(`/seller/notifications/${item._id}`); setItems((current) => current.filter((entry) => entry._id !== item._id)); syncUnread(Math.max(0, unread - (item.read ? 0 : 1))); }} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600"><Trash2 className="h-3.5 w-3.5" />{ar ? "حذف" : "Delete"}</button></div>
          </div></div>
        </article>;
      })}
      {!loading && !items.length ? <div className="rounded-[24px] border border-dashed p-10 text-center text-zinc-500">{ar ? "لا توجد إشعارات بعد." : "No notifications yet."}</div> : null}
    </div>
  </section>;
}
