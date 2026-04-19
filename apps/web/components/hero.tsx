"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";

const quickLinks = ["Tracteurs", "Camions", "Utilitaires", "Export", "Disponible"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 flex items-center justify-end px-4 sm:px-8 lg:px-12">
        <div className="relative h-[72%] w-full max-w-[1100px] opacity-[0.16] sm:opacity-[0.2]">
          <Image
            src="/alhaduni-logo.jpg"
            alt="ALHADUNI CARS"
            fill
            priority
            className="object-contain object-center"
            sizes="100vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.3),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.2),transparent_30%)]" />

      <div className="container-premium relative z-10 flex h-[78vh] items-center py-8 sm:h-[82vh] sm:py-12">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur"
          >
            Vente & importation - Reponse rapide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Trouvez votre prochain{" "}
            <span className="text-brand-gold">camion ou vehicule utilitaire</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 max-w-xl text-sm text-zinc-200 sm:text-base"
          >
            Catalogue simple, verifications claires et contact direct sur WhatsApp pour accelerer chaque vente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-lg sm:p-4"
          >
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative md:col-span-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <input
                  placeholder="Categorie, marque, modele..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-white placeholder:text-white/60 outline-none"
                />
              </div>

              <Link
                href="/catalogue"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:scale-105"
              >
                Voir
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={buildWhatsAppUrl(
                  "Bonjour, je cherche un camion ou un vehicule disponible."
                )}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {quickLinks.map((item) => (
                <Link
                  key={item}
                  href={`/catalogue?search=${encodeURIComponent(item)}`}
                  className="whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-xs text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 grid gap-3 sm:grid-cols-3"
          >
            <div className="glass rounded-xl p-3 text-white">
              <p className="text-xl font-bold">Stock actif</p>
              <p className="text-xs text-white/70">Vehicules disponibles et sur demande</p>
            </div>

            <div className="glass rounded-xl p-3 text-white">
              <ShieldCheck className="h-5 w-5 text-brand-gold" />
              <p className="mt-1 text-xs text-white/70">Verification documentaire</p>
            </div>

            <div className="glass rounded-xl p-3 text-white">
              <p className="text-xl font-bold">WhatsApp</p>
              <p className="text-xs text-white/70">Contact commercial direct</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
