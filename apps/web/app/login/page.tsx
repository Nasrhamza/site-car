"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { COMPANY_NAME } from "@/lib/company";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="container-premium section-spacing">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-[32px] border border-zinc-200/70 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-8 text-white shadow-premium dark:border-white/10">
          <BrandLogo className="h-[84px] w-[270px]" priority />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Administration {COMPANY_NAME}
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
            Connexion simple et securisee pour gerer le catalogue.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Cet acces est reserve a l&apos;administrateur de la societe. Une fois connecte, vous pouvez piloter les
            vehicules, consulter les messages clients et gerer les annonces depuis un espace unique.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              Authentification geree par le backend Express avec mot de passe chiffre via bcrypt et JWT pour les appels admin.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              Le premier compte admin peut etre cree soit via le seed, soit avec les variables d&apos;environnement de bootstrap.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              Les pages <code>/admin</code> sont protegees et redirigent automatiquement vers cette page si la session est absente.
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-zinc-200/70 bg-white p-8 shadow-premium dark:border-white/10 dark:bg-zinc-900">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>

          <p className="mt-6 gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Espace admin</p>
          <h2 className="mt-3 text-3xl font-bold">Se connecter</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Entrez les identifiants du compte administrateur configure pour ce projet.
          </p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");

              try {
                const payload = {
                  email: state.email.trim().toLowerCase(),
                  password: state.password
                };
                const { data } = await api.post("/auth/admin/login", payload);
                setSession(data.accessToken, data.user);
                router.replace(redirectTo);
                router.refresh();
              } catch (err: any) {
                setError(
                  err?.response?.data?.message ||
                    "Connexion impossible. Verifiez votre API et vos identifiants admin."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            <label className="grid gap-2">
              <span className="text-sm font-medium">Email admin</span>
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand"
                placeholder="admin@votre-societe.com"
                autoComplete="username"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Mot de passe</span>
              <input
                type="password"
                value={state.password}
                onChange={(e) => setState({ ...state, password: e.target.value })}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none transition focus:border-brand"
                placeholder="Votre mot de passe admin"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Connexion..." : "Acceder au dashboard"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
