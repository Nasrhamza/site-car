"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { currencyTnd, resolveMediaUrl } from "@/lib/utils";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import {
  DEFAULT_FUEL_TYPE,
  DEFAULT_VEHICLE_CATEGORY,
  DRIVETRAIN_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
  ENGINE_CAPACITY_OPTIONS,
  FUEL_TYPE_OPTIONS,
  GEARBOX_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  REGIONAL_SPECS_OPTIONS,
  VEHICLE_BRANDS,
  VEHICLE_CATEGORIES,
  VEHICLE_YEARS,
  getCategoryLabel,
  getFuelTypeLabel,
  getVehicleModelSuggestions,
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
  engineCapacity: string;
  regionalSpecs: string;
  price: string;
  priceType: string;
  status: string;
  shortDescription: string;
  description: string;
  badgesText: string;
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
  engineCapacity: "",
  regionalSpecs: "GCC",
  price: "",
  priceType: "Prix fixe",
  status: PRODUCT_STATUS_OPTIONS[0],
  shortDescription: "",
  description: "",
  badgesText: ""
};

export default function EditCarPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { rate: aedToTndRate, date: exchangeDate } = useAedToTndRate();

  const [form, setForm] = useState<CarForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState<CarImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const modelSuggestions = getVehicleModelSuggestions(form.brand);

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
          engineCapacity: data?.engineCapacity ? String(data.engineCapacity) : "",
          regionalSpecs: data?.regionalSpecs || "GCC",
          price: String(data?.price || ""),
          priceType: data?.priceType || "Prix fixe",
          status: data?.availability || data?.status || PRODUCT_STATUS_OPTIONS[0],
          shortDescription: data?.shortDescription || "",
          description: data?.description || "",
          badgesText: Array.isArray(data?.badges) ? data.badges.join(", ") : ""
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
            formData.append("engineCapacity", form.engineCapacity);
            formData.append("regionalSpecs", form.regionalSpecs);
            formData.append("price", form.price);
            formData.append("priceType", form.priceType);
            formData.append("status", form.status);
            formData.append("shortDescription", form.shortDescription);
            formData.append("description", form.description);
            formData.append("badges", form.badgesText);
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
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            الماركة
            <input name="brand" value={form.brand} onChange={handleChange} list="edit-vehicle-brands" className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" placeholder="اختر أو اكتب الماركة" />
            <datalist id="edit-vehicle-brands">{VEHICLE_BRANDS.map((brand) => <option key={brand} value={brand} />)}</datalist>
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            الموديل
            <input name="model" value={form.model} onChange={handleChange} list="edit-vehicle-models" className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" placeholder="اختر أو اكتب الموديل" />
            <datalist id="edit-vehicle-models">{modelSuggestions.map((model) => <option key={model} value={model} />)}</datalist>
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            الفئة
            <select name="category" value={form.category} onChange={handleChange} className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white">
              {VEHICLE_CATEGORIES.map((category) => (
                <option key={category} value={category}>{getCategoryLabel(category)}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            Engine capacity
            <select name="engineCapacity" value={form.engineCapacity} onChange={handleChange} className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" required>
              <option value="">Select engine capacity</option>
              {ENGINE_CAPACITY_OPTIONS.map((capacity) => <option key={capacity} value={capacity}>{capacity.toFixed(1)} L</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            Regional specifications
            <select name="regionalSpecs" value={form.regionalSpecs} onChange={handleChange} className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" required>
              {REGIONAL_SPECS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="grid min-w-0 gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            السعر بالدرهم AED
            <input name="price" type="number" min="0" step="100" value={form.price} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3 text-sm text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:disabled:bg-white/5" placeholder={form.priceType === "Sur demande" ? "السعر عند الطلب" : "95000"} required={form.priceType !== "Sur demande"} disabled={form.priceType === "Sur demande"} />
            {form.priceType !== "Sur demande" && Number(form.price) > 0 ? <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">≈ {currencyTnd(Number(form.price), aedToTndRate)}{exchangeDate ? ` · ${exchangeDate}` : ""}</p> : null}
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            السنة
            <select name="year" value={form.year} onChange={handleChange} className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white">
              <option value="">اختر السنة</option>
              {form.year && !VEHICLE_YEARS.includes(Number(form.year)) ? <option value={form.year}>{form.year}</option> : null}
              {VEHICLE_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            الكيلومترات
            <input name="mileage" type="number" min="0" step="1" value={form.mileage} onChange={handleChange} className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" placeholder="0 km" />
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            اللون الخارجي
            <input name="exteriorColor" value={form.exteriorColor} onChange={handleChange} list="edit-color-options" className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" placeholder="اختر أو اكتب اللون" />
            <datalist id="edit-color-options">{EXTERIOR_COLOR_OPTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            نوع الوقود
            <select name="fuelType" value={form.fuelType} onChange={handleChange} className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white">
              {FUEL_TYPE_OPTIONS.map((fuelType) => <option key={fuelType} value={fuelType}>{getFuelTypeLabel(fuelType)}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            علبة السرعة
            <input name="gearbox" value={form.gearbox} onChange={handleChange} list="edit-gearbox-options" className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" placeholder="أوتوماتيك، يدوي..." />
            <datalist id="edit-gearbox-options">{GEARBOX_OPTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300">
            نظام الدفع
            <input name="transmission" value={form.transmission} onChange={handleChange} list="edit-drivetrain-options" className="rounded-2xl border px-4 py-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-white" placeholder="4x2، 4x4، 6x4..." />
            <datalist id="edit-drivetrain-options">{DRIVETRAIN_OPTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <select name="priceType" value={form.priceType} onChange={(event) => setForm((prev) => ({ ...prev, priceType: event.target.value, price: event.target.value === "Sur demande" ? "" : prev.price }))} className="rounded-2xl border px-4 py-3 dark:border-white/10 dark:bg-transparent">
            <option value="Prix fixe">سعر ثابت</option>
            <option value="Negociable">قابل للتفاوض</option>
            <option value="Sur demande">السعر عند الطلب</option>
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
