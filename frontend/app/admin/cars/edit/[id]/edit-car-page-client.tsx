"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import {
  DEFAULT_FUEL_TYPE,
  DEFAULT_VEHICLE_CATEGORY,
  FUEL_TYPE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  VEHICLE_CATEGORIES,
  getCategoryLabel,
  getFuelTypeLabel,
  getStatusLabel
} from "@/lib/company";

type CarImage = {
  url: string;
  alt: string;
};

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
  equipmentText: ""
};

export default function EditCarPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState<CarForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState<CarImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
          equipmentText: Array.isArray(data?.equipment) ? data.equipment.join(", ") : ""
        });
        setExistingImages(
          Array.isArray(data?.images)
            ? data.images
                .map((image: any) => ({
                  url: String(image?.url || "").trim(),
                  alt: String(image?.alt || data?.name || "Vehicule").trim() || "Vehicule"
                }))
                .filter((image: CarImage) => image.url)
            : []
        );
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "تعذر تحميل المركبة.");
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
    return <div className="rounded-[28px] border bg-white p-6 shadow-premium">جارٍ التحميل...</div>;
  }

  if (error && !form.name) {
    return <div className="rounded-[28px] border bg-white p-6 text-red-600 shadow-premium">{error}</div>;
  }

  return (
    <div className="admin-car-form w-full max-w-full overflow-hidden rounded-[24px] border border-zinc-200/70 bg-white p-4 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-5 lg:p-6">
      <h1 className="text-3xl font-bold">تعديل المركبة</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        حدّث المعلومات والصور بسهولة. يمكنك الاحتفاظ بالصور الحالية أو حذف بعضها ثم إضافة صور جديدة.
      </p>

      <form
        className="mt-5 grid min-w-0 gap-4"
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
            formData.append("existingImages", JSON.stringify(existingImages));

            selectedFiles.forEach((file) => {
              formData.append("images", file);
            });

            await api.put(`/cars/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });

            router.push("/admin/cars");
            router.refresh();
          } catch (err: any) {
            setError(err?.response?.data?.message || "حدث خطأ أثناء التعديل.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent"
            placeholder="اسم المركبة"
          />
          <div className="min-w-0 rounded-2xl border border-dashed px-4 py-3 text-sm text-zinc-500 dark:border-white/10">
            {existingImages.length
              ? `${existingImages.length} صورة حالية محفوظة للمركبة`
              : "لا توجد صور حالية. أضف صورًا جديدة في الحقل التالي."}
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="min-w-0 rounded-3xl border border-zinc-200/70 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">الصور الحالية</h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                احذف أي صورة لا تريد إبقاءها.
              </span>
            </div>

            {existingImages.length ? (
              <div className="max-w-full overflow-x-auto pb-2">
                <div className="flex w-max gap-3">
                {existingImages.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className="min-w-[180px] rounded-2xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900"
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-xl">
                      <Image
                        src={resolveMediaUrl(image.url) || image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setExistingImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
                      }}
                      className="mt-3 w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      حذف الصورة
                    </button>
                  </div>
                ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">لا توجد صور حالية لهذا الإعلان.</p>
            )}
          </div>

          <div className="min-w-0 rounded-3xl border border-zinc-200/70 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">إضافة صور جديدة</h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                أول صورة جديدة تضاف بعد الصور الحالية ستظهر ضمن الشريط المصغّر.
              </span>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              className="w-full rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent"
            />

            <div className="mt-3 rounded-2xl border border-dashed px-4 py-3 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-300">
              {selectedFiles.length ? (
                <ul className="grid gap-1 sm:grid-cols-2">
                  {selectedFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="min-w-0 truncate">
                      {index + 1}. {file.name}
                    </li>
                  ))}
                </ul>
              ) : (
                "يمكنك اختيار صورة واحدة أو عدة صور جديدة."
              )}
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          <input name="brand" value={form.brand} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="الماركة" />
          <input name="model" value={form.model} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="الموديل" />
          <select name="category" value={form.category} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            {VEHICLE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <input name="price" type="number" value={form.price} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="السعر" />
          <input name="year" type="number" value={form.year} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="السنة" />
          <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="Km" />
          <input name="exteriorColor" value={form.exteriorColor} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="اللون" />
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          <select name="fuelType" value={form.fuelType} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            {FUEL_TYPE_OPTIONS.map((fuelType) => (
              <option key={fuelType} value={fuelType}>
                {getFuelTypeLabel(fuelType)}
              </option>
            ))}
          </select>
          <input name="gearbox" value={form.gearbox} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="علبة السرعة" />
          <input name="transmission" value={form.transmission} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="الدفع / النقل" />
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <select name="priceType" value={form.priceType} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            <option value="Prix fixe">سعر ثابت</option>
            <option value="Negociable">قابل للتفاوض</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            {PRODUCT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <input name="badgesText" value={form.badgesText} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="الشارات مفصولة بفواصل" />
        <input name="equipmentText" value={form.equipmentText} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="التجهيزات مفصولة بفواصل" />
        <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="وصف مختصر" />
        <textarea name="description" value={form.description} onChange={handleChange} className="min-h-40 rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent" placeholder="وصف كامل" />

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="rounded-2xl bg-brand px-6 py-4 font-semibold text-white disabled:opacity-70">
            {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
          <button type="button" onClick={() => router.push("/admin/cars")} className="rounded-2xl border px-6 py-4 font-semibold dark:border-white/10">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
