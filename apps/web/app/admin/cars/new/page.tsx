"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  DEFAULT_FUEL_TYPE,
  DEFAULT_VEHICLE_CATEGORY,
  FUEL_TYPE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  VEHICLE_CATEGORIES
} from "@/lib/company";

const initialForm = {
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
  status: PRODUCT_STATUS_OPTIONS[0],
  description: "",
  badges: "",
  equipment: ""
};

export default function AddCarPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name || "");
      formData.append("brand", form.brand || "");
      formData.append("model", form.model || "");
      formData.append("category", form.category || "");
      formData.append("year", String(form.year || ""));
      formData.append("mileage", String(form.mileage || ""));
      formData.append("fuelType", form.fuelType || "");
      formData.append("gearbox", form.gearbox || "");
      formData.append("transmission", form.transmission || "");
      formData.append("exteriorColor", form.exteriorColor || "");
      formData.append("price", String(form.price || ""));
      formData.append("status", form.status || "");
      formData.append("description", form.description || "");
      formData.append("badges", form.badges || "");
      formData.append("equipment", form.equipment || "");

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await api.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      router.push("/admin/cars");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du vehicule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          Catalogue admin
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Ajouter un vehicule
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
          Ajoutez un nouveau vehicule au catalogue avec ses informations principales et une image importee depuis votre appareil.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 md:p-8">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Nom</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Volvo FH 2023"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Marque</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Ex: Volvo"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Modele</label>
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Ex: FH"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Categorie</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              {VEHICLE_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Annee</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="2023"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Kilometrage</label>
            <input
              type="number"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              placeholder="150000"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Carburant</label>
            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              {FUEL_TYPE_OPTIONS.map((fuelType) => (
                <option key={fuelType} value={fuelType}>{fuelType}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Boite</label>
            <input
              type="text"
              name="gearbox"
              value={form.gearbox}
              onChange={handleChange}
              placeholder="Automatique / Manuelle"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Transmission</label>
            <input
              type="text"
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              placeholder="4x2 / 6x4 / Integrale"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Couleur exterieure</label>
            <input
              type="text"
              name="exteriorColor"
              value={form.exteriorColor}
              onChange={handleChange}
              placeholder="Blanc / Rouge / Gris"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Prix</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="95000"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Disponibilite</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              {PRODUCT_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Image principale</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            />
            {selectedFile && (
              <p className="text-sm text-slate-500">
                Fichier selectionne : {selectedFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Badges</label>
            <input
              type="text"
              name="badges"
              value={form.badges}
              onChange={handleChange}
              placeholder="Inspection, Export, Garantie"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Equipements</label>
            <input
              type="text"
              name="equipment"
              value={form.equipment}
              onChange={handleChange}
              placeholder="Retarder, GPS, Camera, Climatisation"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Decrivez le vehicule..."
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Ajout en cours..." : "Ajouter le vehicule"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/cars")}
              className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
