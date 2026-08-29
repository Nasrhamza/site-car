"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CarFront, CheckCircle2, Clock3, PlusCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/site-language";

export default function SellerDashboardPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/cars/manage", { params: { limit: 200 } }).then(({ data }) => setCars(data?.items || [])).finally(() => setLoading(false)); }, []);
  const stats = useMemo(() => ({ total: cars.length, pending: cars.filter((car) => car.moderationStatus === "Pending").length, approved: cars.filter((car) => !car.moderationStatus || car.moderationStatus === "Approved").length }), [cars]);
  const cards = [{ label: ar ? "مركباتي" : "My vehicles", value: stats.total, icon: CarFront }, { label: ar ? "في انتظار الموافقة" : "Pending approval", value: stats.pending, icon: Clock3 }, { label: ar ? "مقبولة" : "Approved", value: stats.approved, icon: CheckCircle2 }];
  return <section className="space-y-6"><div className="rounded-[28px] bg-zinc-950 p-7 text-white"><p className="text-sm font-black uppercase tracking-[.25em] text-emerald-400">{ar ? "لوحة البائع" : "Seller dashboard"}</p><h1 className="mt-3 text-4xl font-black">{ar ? "إدارة مخزونك" : "Manage your inventory"}</h1><p className="mt-3 max-w-2xl text-white/65">{ar ? "أضف تفاصيل المركبة كاملة. تحتاج الإعلانات الجديدة إلى موافقة الإدارة، أما التعديلات اللاحقة فتبقى منشورة ويصل بها تنبيه للإدارة." : "Add complete vehicle details. New listings require admin approval; later edits stay live and notify the administrator."}</p><Link href="/seller/cars/new" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-black"><PlusCircle className="h-5 w-5" />{ar ? "إضافة مركبة" : "Add vehicle"}</Link></div>
    <div className="grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-[24px] border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"><Icon className="h-6 w-6 text-brand" /><p className="mt-5 text-3xl font-black">{loading ? "—" : value}</p><p className="mt-1 text-sm text-zinc-500">{label}</p></div>)}</div>
  </section>;
}
