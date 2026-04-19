"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarRange, CarFront as CarIcon, MessageSquareText, Settings, Users } from "lucide-react";
import { api } from "@/lib/api";
import { currency } from "@/lib/utils";

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
    price: number;
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message || "Impossible de charger les statistiques admin.");
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Produits",
      value: stats.cards.totalCars,
      hint: `${stats.cards.soldCars} vendus | ${stats.cards.reservedCars} reserves`,
      href: "/admin/cars",
      icon: CarIcon
    },
    {
      label: "Notifications",
      value: stats.cards.inquiries,
      hint: "Messages et leads clients a traiter",
      href: "/admin/requests",
      icon: MessageSquareText
    },
    {
      label: "Activite",
      value: stats.cards.totalUsers,
      hint: `${stats.cards.appointments} rendez-vous enregistres`,
      href: "/admin",
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Dashboard</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Pilotage rapide de la plateforme</h1>
            <p className="mt-2 max-w-2xl text-zinc-500 dark:text-zinc-400">
              Gere les produits, surveille les messages clients et garde un oeil sur les annonces les plus consultees.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/cars/new"
              className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Ajouter un produit
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Mot de passe
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium transition hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
                  <p className="mt-3 text-4xl font-extrabold">{loading ? "..." : card.value}</p>
                </div>
                <div className="rounded-2xl bg-zinc-100 p-3 dark:bg-white/5">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{card.hint}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Top annonces</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Les vehicules les plus consultes par les visiteurs.
              </p>
            </div>
            <CalendarRange className="h-5 w-5 text-zinc-400" />
          </div>

          <div className="mt-6 space-y-3">
            {stats.topViewed.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                Aucune statistique disponible pour le moment.
              </div>
            ) : (
              stats.topViewed.map((car, index) => (
                <div
                  key={car._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-4 dark:bg-white/5"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">#{index + 1}</p>
                    <h3 className="mt-1 font-semibold">{car.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {car.brand} | {currency(car.price)}
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm dark:bg-zinc-800">
                    {car.views} vues
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-2xl font-bold">Actions rapides</h2>
          <div className="mt-6 grid gap-3">
            <Link href="/admin/cars" className="rounded-2xl bg-zinc-100 px-4 py-4 font-semibold transition hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10">
              Gerer les produits
            </Link>
            <Link href="/admin/requests" className="rounded-2xl bg-zinc-100 px-4 py-4 font-semibold transition hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10">
              Voir les notifications clients
            </Link>
            <Link href="/admin/settings" className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-4 font-semibold transition hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10">
              <Settings className="h-4 w-4" />
              Changer le mot de passe
            </Link>
            <Link href="/catalogue" className="rounded-2xl bg-zinc-100 px-4 py-4 font-semibold transition hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10">
              Ouvrir le catalogue public
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
