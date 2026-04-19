"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  DEFAULT_FUEL_TYPE,
  DEFAULT_VEHICLE_CATEGORY,
  FUEL_TYPE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  VEHICLE_CATEGORIES
} from "@/lib/company";

type CarForm = {
  name: string;
  brand: string;
  model: string;
  category: string;
  year: string;
  mileage: string;
  fuelType: string;
  gearbox: string;
  transmission: string;
  exteriorColor: string;
  price: string;
  priceType: string;
  status: string;
  shortDescription: string;
  description: string;
  badgesText: string;
  equipmentText: string;
  imageUrl: string;
};

const emptyForm: CarForm = {
  name: "",
  brand: "",
  model: "",
  category: DEFAULT_VEHICLE_CATEGORY,
  year: "",
  mileage: "",
  fuelType: DEFAULT_FUEL_TYPE,
  gearbox: "",
  transmission: "",
  exteriorColor: "",
  price: "",
  priceType: "Prix fixe",
  status: PRODUCT_STATUS_OPTIONS[0],
  shortDescription: "",
  description: "",
  badgesText: "",
  equipmentText: "",
  imageUrl: ""
};

export default function EditCarPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState<CarForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/cars/by-id/${id}`)
      .then(({ data }) => {
        setForm({
          name: data?.name || "",
          brand: data?.brand || "",
          model: data?.model || "",
          category: data?.category || DEFAULT_VEHICLE_CATEGORY,
          year: String(data?.year || ""),
          mileage: String(data?.mileage || ""),
          fuelType: data?.fuelType || DEFAULT_FUEL_TYPE,
          gearbox: data?.gearbox || "",
          transmission: data?.transmission || "",
          exteriorColor: data?.exteriorColor || "",
          price: String(data?.price || ""),
          priceType: data?.priceType || "Prix fixe",
          status: data?.availability || data?.status || PRODUCT_STATUS_OPTIONS[0],
          shortDescription: data?.shortDescription || "",
          description: data?.description || "",
          badgesText: Array.isArray(data?.badges) ? data.badges.join(", ") : "",
          equipmentText: Array.isArray(data?.equipment) ? data.equipment.join(", ") : "",
          imageUrl: data?.images?.[0]?.url || ""
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Impossible de charger le produit.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div className="rounded-[28px] border bg-white p-6 shadow-premium">Chargement...</div>;
  }

  if (error && !form.name) {
    return <div className="rounded-[28px] border bg-white p-6 text-red-600 shadow-premium">{error}</div>;
  }

  return (
    <div className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">
      <h1 className="text-3xl font-bold">Modifier le produit</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Mettez a jour rapidement les informations principales, l&apos;image et la presentation de l&apos;annonce.
      </p>

      <form
        className="mt-6 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setError("");

          try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("brand", form.brand);
            formData.append("model", form.model);
            formData.append("category", form.category);
            formData.append("year", form.year);
            formData.append("mileage", form.mileage);
            formData.append("fuelType", form.fuelType);
            formData.append("gearbox", form.gearbox);
            formData.append("transmission", form.transmission);
            formData.append("exteriorColor", form.exteriorColor);
            formData.append("price", form.price);
            formData.append("priceType", form.priceType);
            formData.append("status", form.status);
            formData.append("shortDescription", form.shortDescription);
            formData.append("description", form.description);
            formData.append("badges", form.badgesText);
            formData.append("equipment", form.equipmentText);
            formData.append("imageUrl", form.imageUrl);

            if (selectedFile) {
              formData.append("image", selectedFile);
            }

            await api.put(`/cars/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });

            router.push("/admin/cars");
            router.refresh();
          } catch (err: any) {
            setError(err?.response?.data?.message || "Erreur lors de la modification.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" value={form.name} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Nom" />
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Image URL" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent"
          />
          <div className="rounded-2xl border border-dashed px-4 py-3 text-sm text-zinc-500 dark:border-white/10">
            {selectedFile ? `Nouvelle image : ${selectedFile.name}` : "Conservez l'image actuelle ou chargez-en une nouvelle."}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input name="brand" value={form.brand} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Marque" />
          <input name="model" value={form.model} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Modele" />
          <select name="category" value={form.category} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            {VEHICLE_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <input name="price" type="number" value={form.price} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Prix" />
          <input name="year" type="number" value={form.year} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Annee" />
          <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Km" />
          <input name="exteriorColor" value={form.exteriorColor} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Couleur" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <select name="fuelType" value={form.fuelType} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            {FUEL_TYPE_OPTIONS.map((fuelType) => (
              <option key={fuelType} value={fuelType}>{fuelType}</option>
            ))}
          </select>
          <input name="gearbox" value={form.gearbox} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Boite" />
          <input name="transmission" value={form.transmission} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Transmission" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <select name="priceType" value={form.priceType} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            <option value="Prix fixe">Prix fixe</option>
            <option value="Negociable">Negociable</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            {PRODUCT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <input name="badgesText" value={form.badgesText} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Badges separes par des virgules" />
        <input name="equipmentText" value={form.equipmentText} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Equipements separes par des virgules" />
        <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Description courte" />
        <textarea name="description" value={form.description} onChange={handleChange} className="min-h-40 rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Description complete" />

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="rounded-2xl bg-brand px-6 py-4 font-semibold text-white disabled:opacity-70">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button type="button" onClick={() => router.push("/admin/cars")} className="rounded-2xl border px-6 py-4 font-semibold dark:border-white/10">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
