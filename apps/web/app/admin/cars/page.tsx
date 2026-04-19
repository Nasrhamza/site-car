"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { currency, resolveMediaUrl } from "@/lib/utils";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/cars", {
        params: { page: 1, limit: 100, sort: "-createdAt" }
      });
      setCars(data?.items || []);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Impossible de charger les vehicules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Supprimer ce vehicule ?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((car) => car._id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Catalogue admin</p>
          <h1 className="mt-2 text-3xl font-bold">Gestion des vehicules</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Liste complete des produits disponibles, reserves ou vendus.</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5"
        >
          + Ajouter un produit
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white shadow-premium dark:border-white/10 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-100/80 text-left dark:bg-white/5">
              <tr>
                <th className="p-4">Produit</th>
                <th className="p-4">Categorie</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Annee</th>
                <th className="p-4">Disponibilite</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">Chargement...</td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">Aucun vehicule trouve</td>
                </tr>
              ) : (
                cars.map((car) => {
                  const imageSrc = resolveMediaUrl(car.images?.[0]?.url) || "/guide-import.svg";
                  const availability = car.availability || car.status || "Disponible";

                  return (
                    <tr key={car._id} className="border-t border-zinc-200/70 dark:border-white/10">
                      <td className="p-4">
                        <div className="flex min-w-[260px] items-center gap-3">
                          <Image
                            src={imageSrc}
                            alt={car.name}
                            width={96}
                            height={64}
                            className="h-16 w-24 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold">{car.name}</p>
                            <p className="text-xs text-zinc-500">{car.brand} - {car.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{car.category}</td>
                      <td className="p-4">{currency(car.price || 0)}</td>
                      <td className="p-4">{car.year}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold dark:bg-white/5">
                          {availability}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/cars/edit/${car._id}`}
                            className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-zinc-950"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(car._id)}
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
