"use client";

import { useState } from "react";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { COMPANY_WHATSAPP_DISPLAY, buildWhatsAppUrl } from "@/lib/company";

export default function ContactPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="container-premium section-spacing">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Contact</p>
          <h1 className="mt-3 font-serif text-5xl font-bold">Parlons de votre prochain vehicule</h1>
          <p className="mt-4 text-zinc-500">
            Notre equipe repond rapidement pour la vente, l&apos;importation et le suivi des demandes commerciales.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border bg-white p-5 shadow-premium dark:bg-zinc-900">
              <Truck className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-xl font-bold">Vente & disponibilite</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                Dites-nous le type de vehicule recherche et nous vous orientons vers le bon stock.
              </p>
            </div>
            <div className="rounded-[28px] border bg-white p-5 shadow-premium dark:bg-zinc-900">
              <ShieldCheck className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-xl font-bold">Achat securise</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                Nous pouvons vous guider sur les documents, la facture et les etapes de verification.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(
                "Bonjour, je souhaite parler a un conseiller  ALHADOUNI CARS."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[28px] bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp {COMPANY_WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <form
          className="rounded-3xl border bg-white p-8 shadow-premium dark:bg-zinc-900"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget as HTMLFormElement);

            try {
              await api.post("/inquiries", {
                name: form.get("name"),
                email: form.get("email"),
                phone: form.get("phone"),
                message: form.get("message")
              });
              setFeedback("Message envoye. L'equipe pourra le relire dans l'espace admin.");
              (e.currentTarget as HTMLFormElement).reset();
            } catch (error: any) {
              setFeedback(
                error?.response?.data?.message ||
                  "Envoi impossible pour le moment. Utilisez WhatsApp en attendant."
              );
            }
          }}
        >
          <div className="grid gap-4">
            <input name="name" placeholder="Nom" className="rounded-2xl border bg-transparent px-4 py-3" required />
            <input name="email" type="email" placeholder="Email" className="rounded-2xl border bg-transparent px-4 py-3" required />
            <input name="phone" placeholder="Telephone" className="rounded-2xl border bg-transparent px-4 py-3" required />
            <textarea name="message" placeholder="Votre message" rows={5} className="rounded-2xl border bg-transparent px-4 py-3" required />
            <button className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white">Envoyer</button>
            {feedback ? <p className="text-sm text-zinc-500">{feedback}</p> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
