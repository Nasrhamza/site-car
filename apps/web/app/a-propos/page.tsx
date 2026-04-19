import type { Metadata } from "next";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { COMPANY_NAME, COMPANY_SUBTITLE, buildWhatsAppUrl } from "@/lib/company";

export const metadata: Metadata = {
  title: `A propos | ${COMPANY_NAME}`,
  description:
    "Presentation de HAROU HEDWANI, specialiste de la vente et de l'importation de vehicules utilitaires et camions."
};

export default function AboutPage() {
  return (
    <div className="container-premium section-spacing">
      <div className="mx-auto max-w-4xl">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">A propos</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">{COMPANY_NAME}, {COMPANY_SUBTITLE}</h1>
        <p className="mt-6 text-lg text-zinc-500">
          Nous aidons les acheteurs et professionnels a identifier, verifier et importer des camions, tracteurs,
          semi-remorques, utilitaires et engins avec un parcours simple, clair et oriente resultat.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="rounded-[28px] border bg-white p-6 shadow-premium dark:bg-zinc-900">
          <Truck className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">Catalogue cible</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Une offre concentree sur les vehicules professionnels avec une attention particuliere aux besoins terrain.
          </p>
        </article>
        <article className="rounded-[28px] border bg-white p-6 shadow-premium dark:bg-zinc-900">
          <ShieldCheck className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">Methodologie claire</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Verification des documents, inspection, facture officielle et accompagnement pour limiter les risques.
          </p>
        </article>
        <article className="rounded-[28px] border bg-white p-6 shadow-premium dark:bg-zinc-900">
          <MessageCircle className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">Relation directe</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            WhatsApp reste le canal principal pour accelerer les echanges, les confirmations et le suivi export.
          </p>
        </article>
      </div>

      <a
        href={buildWhatsAppUrl(
          "Bonjour, je souhaite discuter de mon besoin en trucks and vehicles."
        )}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5"
      >
        <MessageCircle className="h-4 w-4" />
        Contacter notre equipe
      </a>
    </div>
  );
}
