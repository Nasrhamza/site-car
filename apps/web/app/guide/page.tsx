import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { GuidePreview } from "@/components/guide-preview";
import {
  COMPANY_NAME,
  COMPANY_SUBTITLE,
  GUIDE_PAGES,
  buildWhatsAppUrl
} from "@/lib/company";

export const metadata: Metadata = {
  title: `Guide | ${COMPANY_NAME}`,
  description:
    "Guides pratiques pour acheter et importer des camions, tracteurs et vehicules utilitaires en toute securite."
};

export default function GuidePage() {
  return (
    <div className="container-premium section-spacing">
      <section className="rounded-[34px] border border-zinc-200/70 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-8 text-white shadow-premium sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/65">Guide</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold sm:text-5xl">
          Conseils clairs pour acheter, exporter et livrer vos vehicules avec methode.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
          {COMPANY_NAME} accompagne les professionnels et acheteurs internationaux sur les verifications
          essentielles, les documents et le suivi logistique.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={buildWhatsAppUrl(
              "Bonjour, je souhaite etre conseille sur un projet d'achat ou d'importation de vehicule."
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Parler sur WhatsApp
          </a>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Voir le catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">
              {COMPANY_SUBTITLE}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
              Deux guides essentiels pour aller vite et rester serein
            </h2>
          </div>
        </div>
        <GuidePreview />
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        {GUIDE_PAGES.map((guide) => (
          <div
            key={guide.slug}
            className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900"
          >
            <h3 className="text-2xl font-bold">{guide.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {guide.description}
            </p>
            <Link
              href={`/guide/${guide.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Ouvrir le guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
