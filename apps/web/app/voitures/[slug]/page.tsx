"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Share2,
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  ShieldCheck,
  Truck
} from "lucide-react";
import { api } from "@/lib/api";
import { useGarageStore } from "@/store/favorites";
import { buildWhatsAppLink, currency, resolveMediaUrl } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/company";
import { CarCard } from "@/components/car-card";

const tabs = ["Presentation", "Caracteristiques", "Equipements", "Importation"];

export default function CarDetailsPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const { favorites, toggleFavorite } = useGarageStore();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [watchers, setWatchers] = useState(0);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("Presentation");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let socket: ReturnType<typeof io> | undefined;

    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${slug}`);
        const payload = response.data;

        setData(payload);
        setError("");
        setWatchers(payload?.car?.liveWatchers || 0);

        if (payload?.car?._id && process.env.NEXT_PUBLIC_SOCKET_URL) {
          socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
          socket.emit("join_car_room", payload.car._id);

          socket.on("car_watchers", (watchersPayload: any) => {
            if (watchersPayload.carId === payload.car._id) {
              setWatchers(watchersPayload.watchers);
            }
          });
        }
      } catch (requestError: any) {
        console.error("Erreur chargement vehicule :", requestError);
        setData(null);
        setWatchers(0);
        setError(
          requestError?.response?.data?.message ||
            "Cette fiche est temporairement indisponible. Merci de reessayer dans quelques instants."
        );
      }
    };

    fetchCar();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [slug]);

  const whatsappHref = useMemo(() => {
    if (!data?.car) return "#";

    return buildWhatsAppLink({
      name: data.car.name || "Vehicule",
      slug: data.car.slug || "",
      price: data.car.price || 0,
      mileage: data.car.mileage || 0,
      year: typeof data.car.year === "number" ? data.car.year : undefined
    });
  }, [data]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (shareError) {
      console.error("Erreur copie lien :", shareError);
    }
  };

  if (error && !data) {
    return (
      <div className="container-premium section-spacing">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-amber-300/60 bg-white p-8 shadow-premium dark:border-amber-500/20 dark:bg-zinc-900">
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Fiche vehicule</p>
          <h1 className="mt-3 font-serif text-4xl font-bold">Detail temporairement indisponible</h1>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">{error}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
            >
              Retour au catalogue
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Reessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="container-premium py-20">Chargement...</div>;
  }

  const { car, similar } = data;
  const images = Array.isArray(car?.images) ? car.images : [];
  const activeImage = resolveMediaUrl(images[active]?.url) || "/guide-import.svg";
  const availability = car?.availability || car?.status || "Disponible";
  const safePrice = car?.price || null;
  const safeYear = car?.year || "-";
  const safeMileage =
    typeof car?.mileage === "number" ? `${car.mileage.toLocaleString("fr-FR")} km` : "-";
  const safeFuel = car?.fuelType || car?.fuel || "Autre";
  const safeTransmission = car?.transmission || car?.gearbox || "-";
  const safeViews = car?.views || 0;
  const safeDescription =
    car?.description || "Aucune description disponible pour ce vehicule.";
  const safePriceType = car?.priceType || "Prix a confirmer";
  const safeReference = car?.slug ? car.slug.toUpperCase() : "-";

  return (
    <div className="container-premium section-spacing pb-24 md:pb-12">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span>Catalogue</span>
        <ChevronRight className="h-4 w-4" />
        <span>{car?.brand || "Marque"}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-900 dark:text-white">
          {car?.name || "Vehicule"}
        </span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.35fr_.65fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[260px] overflow-hidden rounded-[28px] bg-zinc-100 sm:h-[420px] lg:h-[520px] dark:bg-zinc-800"
          >
            <Image
              src={activeImage}
              alt={car?.name || "Vehicule"}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 66vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {images.map((image: any, index: number) => {
                const imageSrc = resolveMediaUrl(image?.url);

                if (!imageSrc) {
                  return null;
                }

                return (
                  <button
                    key={(image?.url || "img") + index}
                    type="button"
                    className={`relative h-20 overflow-hidden rounded-2xl border sm:h-24 ${
                      active === index
                        ? "ring-2 ring-brand"
                        : "border-zinc-200 dark:border-white/10"
                    }`}
                    onClick={() => setActive(index)}
                  >
                    <Image
                      src={imageSrc}
                      alt={image.alt || `${car?.name || "Vehicule"}-${index}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 rounded-[28px] border bg-white p-4 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-6">
            <div className="flex flex-wrap gap-2 border-b pb-4 dark:border-white/10">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab === item
                      ? "bg-brand text-white"
                      : "bg-zinc-100 dark:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {tab === "Presentation" && (
              <div className="pt-6">
                <h2 className="text-2xl font-bold">Presentation</h2>
                <p className="mt-4 leading-7 text-zinc-500 dark:text-zinc-400">
                  {safeDescription}
                </p>
              </div>
            )}

            {tab === "Caracteristiques" && (
              <div className="grid gap-4 pt-6 md:grid-cols-2">
                {(car?.features?.length
                  ? car.features
                  : [
                      { label: "Annee", value: safeYear },
                      { label: "Kilometrage", value: safeMileage },
                      { label: "Carburant", value: safeFuel },
                      { label: "Boite", value: safeTransmission },
                      { label: "Categorie", value: car?.category || "-" },
                      { label: "Disponibilite", value: availability }
                    ]).map((feature: any, index: number) => (
                  <div
                    key={feature.label || index}
                    className="rounded-2xl border p-4 dark:border-white/10"
                  >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {feature.label}
                    </p>
                    <p className="font-semibold">
                      {feature.value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "Equipements" && (
              <div className="grid gap-3 pt-6 md:grid-cols-2">
                {(car?.equipment?.length
                  ? car.equipment
                  : ["Inspection visuelle", "Documents verifies", "Photos detaillees", "Suivi export possible"]).map(
                  (item: string, index: number) => (
                    <div
                      key={item + index}
                      className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {tab === "Importation" && (
              <div className="grid gap-4 pt-6 md:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-800">
                  <Truck className="h-6 w-6 text-brand" />
                  <h3 className="mt-3 text-lg font-bold">Preparation export</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    Nous pouvons vous accompagner pour la disponibilite, la preparation logistique et les confirmations avant expedition.
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-800">
                  <FileText className="h-6 w-6 text-brand" />
                  <h3 className="mt-3 text-lg font-bold">Documents & suivi</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    Facture, documents export et suivi jusqu&apos;a la livraison peuvent etre clarifies directement avec l&apos;equipe.
                  </p>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    `Bonjour, je souhaite en savoir plus sur l'importation de ${car?.name || "ce vehicule"}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 md:col-span-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Poser une question sur l&apos;importation
                </a>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[28px] border bg-white p-5 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {car?.badges?.map((badge: string) => (
                <span
                  key={badge}
                  className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              {car?.name || "Vehicule"}
            </h1>

            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              {safeYear} - {safeFuel} - {safeTransmission} - {safeMileage}
            </p>

            <p className="mt-5 text-3xl font-extrabold text-brand sm:text-4xl">
              {safePrice ? currency(safePrice) : "Prix non disponible"}
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {safePriceType} - Ref: {safeReference}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Annee
                </p>
                <p className="mt-2 font-semibold">{safeYear}</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Kilometrage
                </p>
                <p className="mt-2 font-semibold">{safeMileage}</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Categorie
                </p>
                <p className="mt-2 font-semibold">{car?.category || "-"}</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Disponibilite
                </p>
                <p className="mt-2 font-semibold">{availability}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {safeViews} vues
              </span>
              <span>
                {watchers} personne(s) consultent cette fiche en ce moment
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => toggleFavorite(car._id)}
                className="rounded-2xl border p-3 dark:border-white/10"
              >
                <Heart
                  className={`mx-auto h-5 w-5 ${
                    favorites.includes(car._id)
                      ? "fill-current text-brand"
                      : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="rounded-2xl border p-3 dark:border-white/10"
              >
                <Share2 className="mx-auto h-5 w-5" />
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-green-500/30 bg-green-500/10 p-3 text-green-700 dark:text-green-300"
              >
                <MessageCircle className="mx-auto h-5 w-5" />
              </a>
            </div>

            {copied && (
              <p className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">
                Lien copie
              </p>
            )}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              Demander sur WhatsApp
            </a>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Achat securise
              </div>
              Facture officielle, verification documentaire et echanges directs avant validation.
            </div>

            <form
              className="mt-6 grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();

                const form = new FormData(e.currentTarget as HTMLFormElement);

                try {
                  await api.post("/inquiries", {
                    car: car._id,
                    name: form.get("name"),
                    email: form.get("email"),
                    phone: form.get("phone"),
                    message: form.get("message")
                  });

                  alert("Demande envoyee");
                  (e.currentTarget as HTMLFormElement).reset();
                } catch (requestError: any) {
                  console.error("Erreur envoi demande :", requestError);
                  alert(
                    requestError?.response?.data?.message ||
                      "Impossible d'envoyer votre demande pour le moment."
                  );
                }
              }}
            >
              <h3 className="text-xl font-bold">Demander un renseignement</h3>

              <input
                name="name"
                placeholder="Nom"
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                required
              />

              <input
                name="email"
                placeholder="Email"
                type="email"
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                required
              />

              <input
                name="phone"
                placeholder="Telephone"
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                required
              />

              <textarea
                name="message"
                placeholder="Votre message"
                defaultValue={`Bonjour, je souhaite plus d’informations sur ${car?.name || "ce vehicule"}.`}
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                rows={4}
              />

              <button className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white">
                Envoyer
              </button>
            </form>
          </div>
        </aside>
      </div>

      {similar?.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Vehicules similaires
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similar.map((item: any) => (
              <CarCard key={item._id} car={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
