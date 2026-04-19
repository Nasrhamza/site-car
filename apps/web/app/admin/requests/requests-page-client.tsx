"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type InquiryItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
  car?: {
    name?: string;
  } | null;
};

export default function RequestsPageClient() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/inquiries")
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message || "Impossible de charger les notifications clients.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">CRM</p>
        <h1 className="mt-2 text-3xl font-bold">Notifications et messages</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Toutes les demandes, leads et messages recus depuis le site et les fiches vehicule.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="rounded-[28px] border bg-white p-6 shadow-premium">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed bg-white p-10 text-center text-zinc-500 shadow-premium dark:bg-zinc-900">
            Aucun message pour le moment.
          </div>
        ) : (
          items.map((item) => (
            <article key={item._id} className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {new Date(item.createdAt).toLocaleString("fr-FR")}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{item.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {[item.email, item.phone].filter(Boolean).join(" | ")}
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold dark:bg-white/5">
                  {item.car?.name || "Demande generale"}
                </div>
              </div>
              <p className="mt-4 rounded-2xl bg-zinc-50 px-4 py-4 leading-7 text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
                {item.message || "Aucun message."}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
