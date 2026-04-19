"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Securite</p>
        <h1 className="mt-2 text-3xl font-bold">Changer le mot de passe</h1>
        <p className="mt-2 max-w-2xl text-zinc-500 dark:text-zinc-400">
          Conservez un acces admin simple et robuste avec un mot de passe long, unique et mis a jour regulierement.
        </p>
      </section>

      <section className="max-w-2xl rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setMessage("");

            if (form.newPassword.length < 8) {
              setError("Le nouveau mot de passe doit contenir au moins 8 caracteres.");
              return;
            }

            if (form.newPassword !== form.confirmPassword) {
              setError("La confirmation du nouveau mot de passe ne correspond pas.");
              return;
            }

            setLoading(true);

            try {
              const { data } = await api.put("/auth/admin/change-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
              });
              setMessage(data?.message || "Mot de passe mis a jour.");
              setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
              });
            } catch (requestError: any) {
              setError(
                requestError?.response?.data?.message ||
                  "Impossible de changer le mot de passe pour le moment."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium">Mot de passe actuel</span>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand dark:border-white/10"
              autoComplete="current-password"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Nouveau mot de passe</span>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand dark:border-white/10"
              autoComplete="new-password"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Confirmer le nouveau mot de passe</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand dark:border-white/10"
              autoComplete="new-password"
              required
            />
          </label>

          {message ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Mise a jour..." : "Mettre a jour le mot de passe"}
          </button>
        </form>
      </section>
    </div>
  );
}
