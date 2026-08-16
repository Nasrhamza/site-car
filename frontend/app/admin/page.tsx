"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpLeft,
  CarFront as CarIcon,
  Clock3,
  MessageSquareText,
  PlusCircle,
  Settings,
  TrendingUp,
  Users
} from "lucide-react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/site-language";

type DashboardStats = {
  cards: {
    totalCars: number;
    soldCars: number;
    reservedCars: number;
    totalUsers: number;
    inquiries: number;
    appointments: number;
  };
  topViewed: Array<{
    _id: string;
    name: string;
    brand: string;
    price?: number | null;
    views: number;
  }>;
};

const emptyStats: DashboardStats = {
  cards: {
    totalCars: 0,
    soldCars: 0,
    reservedCars: 0,
    totalUsers: 0,
    inquiries: 0,
    appointments: 0
  },
  topViewed: []
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const copy = language === "en"
    ? {
        loadError: "Unable to load dashboard statistics.", vehicles: "Vehicles", sold: "sold", reserved: "reserved",
        customerMessages: "Customer messages", messagesHint: "Requests that need a quick follow-up", activity: "Activity",
        appointments: "appointments recorded", performance: "Performance", performanceHint: "Total views of the most visited vehicles",
        addVehicle: "Add vehicle", manageVehicles: "Manage vehicles", changePassword: "Change password", daily: "Daily overview",
        heroTitle: "Everything you need to manage the showroom", heroText: "Track vehicles, customer messages, and views quickly from one clear workspace.",
        messages: "Messages", quickSummary: "Quick summary", carsInSystem: "vehicles in the system", customerMessage: "customer messages",
        quickActions: "Quick actions",
        quickActionsHint: "Your most frequently used tasks, ready to open."
      }
    : {
        loadError: "تعذر تحميل إحصائيات لوحة الإدارة.", vehicles: "المركبات", sold: "مباعة", reserved: "محجوزة",
        customerMessages: "رسائل العملاء", messagesHint: "استفسارات تحتاج متابعة سريعة", activity: "النشاط",
        appointments: "موعدا مسجلا", performance: "الأداء", performanceHint: "مجموع مشاهدات المركبات الأكثر زيارة",
        addVehicle: "إضافة مركبة", manageVehicles: "إدارة المركبات", changePassword: "تغيير كلمة المرور", daily: "لوحة متابعة يومية",
        heroTitle: "كل ما تحتاجه لإدارة المعرض في شاشة واحدة", heroText: "تابع المركبات، رسائل العملاء، والمشاهدات بسرعة. الواجهة مصممة لتكون واضحة وسهلة أثناء العمل اليومي.",
        messages: "الرسائل", quickSummary: "ملخص سريع", carsInSystem: "مركبة في النظام", customerMessage: "رسالة عميل",
        quickActions: "إجراءات سريعة",
        quickActionsHint: "أكثر المهام استعمالا قريبة منك."
      };

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message || copy.loadError);
      })
      .finally(() => setLoading(false));
  }, [language, copy.loadError]);

  const dashboardCards = [
      {
        label: copy.vehicles,
        value: stats.cards.totalCars,
        hint: `${stats.cards.soldCars} ${copy.sold} | ${stats.cards.reservedCars} ${copy.reserved}`,
        href: "/admin/cars",
        icon: CarIcon,
        accent: "bg-brand"
      },
      {
        label: copy.customerMessages,
        value: stats.cards.inquiries,
        hint: copy.messagesHint,
        href: "/admin/requests",
        icon: MessageSquareText,
        accent: "bg-emerald-500"
      },
      {
        label: copy.activity,
        value: stats.cards.totalUsers,
        hint: `${stats.cards.appointments} ${copy.appointments}`,
        href: "/admin",
        icon: Users,
        accent: "bg-zinc-950"
      },
      {
        label: copy.performance,
        value: stats.topViewed.reduce((total, car) => total + (car.views || 0), 0),
        hint: copy.performanceHint,
        href: "/admin/cars",
        icon: TrendingUp,
        accent: "bg-brand-gold"
      }
    ];

  const quickActions = [
    { label: copy.addVehicle, href: "/admin/cars/new", icon: PlusCircle, primary: true },
    { label: copy.manageVehicles, href: "/admin/cars", icon: CarIcon },
    { label: copy.customerMessages, href: "/admin/requests", icon: MessageSquareText },
    { label: copy.changePassword, href: "/admin/settings", icon: Settings }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.07 }}
      className="space-y-5"
    >
      <motion.section
        variants={fadeUp}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-[24px] border border-zinc-200/70 bg-white shadow-premium"
      >
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600">
              <Clock3 className="h-4 w-4 text-brand" />
              {copy.daily}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              {copy.heroTitle}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
              {copy.heroText}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/admin/cars/new"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5"
              >
                <PlusCircle className="h-4 w-4" />
                {copy.addVehicle}
              </Link>

              <Link
                href="/admin/requests"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:-translate-y-0.5 hover:bg-zinc-50"
              >
                <MessageSquareText className="h-4 w-4" />
                {copy.messages}
              </Link>
            </div>
          </div>

          <div className="border-t border-zinc-200/70 bg-zinc-950 p-5 text-white lg:border-r lg:border-t-0 sm:p-6 lg:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
              {copy.quickSummary}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-3xl font-bold">{loading ? "..." : stats.cards.totalCars}</p>
                <p className="mt-1 text-xs text-zinc-300">{copy.carsInSystem}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-3xl font-bold">{loading ? "..." : stats.cards.inquiries}</p>
                <p className="mt-1 text-xs text-zinc-300">{copy.customerMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {error && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </motion.div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.03 }}
              whileHover={{ y: -5 }}
            >
              <Link
                href={card.href}
                className="group block h-full rounded-[22px] border border-zinc-200/70 bg-white p-5 shadow-premium transition hover:border-brand/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-500">{card.label}</p>
                    <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950">
                      {loading ? "..." : card.value}
                    </p>
                  </div>

                  <div className={`rounded-2xl p-3 text-white ${card.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-500">{card.hint}</p>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <motion.section
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="rounded-[24px] border border-zinc-200/70 bg-white p-5 shadow-premium sm:p-6"
        >
          <h2 className="text-xl font-bold text-zinc-950 sm:text-2xl">{copy.quickActions}</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {copy.quickActionsHint}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    action.primary
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </span>
                  <ArrowUpLeft className="h-4 w-4 transition group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
              );
            })}
          </div>
      </motion.section>
    </motion.div>
  );
}
