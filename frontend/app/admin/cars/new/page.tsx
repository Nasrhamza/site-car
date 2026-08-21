"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { currencyTnd } from "@/lib/utils";
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
  engineCapacity: "",
  regionalSpecs: "GCC",
  price: "",
  priceType: "Prix fixe",
  status: PRODUCT_STATUS_OPTIONS[0],
  description: "",
  badges: ""
};

const MAX_CAR_IMAGES = 12;

export default function AddCarPage() {
  const router = useRouter();
  const { rate: aedToTndRate, date: exchangeDate } = useAedToTndRate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const modelSuggestions = getVehicleModelSuggestions(form.brand);
  const suggestedName = [form.brand, form.model, form.year].filter(Boolean).join(" ");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files || []);

    setSelectedFiles((currentFiles) => {
      const uniqueFiles = new Map<string, File>();

      [...currentFiles, ...incomingFiles].forEach((file) => {
        uniqueFiles.set(`${file.name}-${file.size}-${file.lastModified}`, file);
      });

      return Array.from(uniqueFiles.values()).slice(0, MAX_CAR_IMAGES);
    });

    event.target.value = "";
  };

  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_file, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

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
      formData.append("engineCapacity", form.engineCapacity || "");
      formData.append("regionalSpecs", form.regionalSpecs || "");
      formData.append("price", String(form.price || ""));
      formData.append("priceType", form.priceType);
      formData.append("status", form.status || "");
      formData.append("description", form.description || "");
      formData.append("badges", form.badges || "");

      selectedFiles.forEach((file) => {
        formData.append("images", file, file.name);
      });

      await api.post("/cars", formData);

      router.push("/admin/cars");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "تعذر إضافة المركبة. تأكد من المعلومات والصور ثم حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          معرض الإدارة
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
          إضافة مركبة
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
          أضف مركبة جديدة مع عدة صور. أول صورة يتم اختيارها ستظهر كالصورة الرئيسية داخل صفحة التفاصيل.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 md:p-8">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">اسم الإعلان</label>
              {suggestedName ? <button type="button" onClick={() => setForm((prev) => ({ ...prev, name: suggestedName }))} className="text-xs font-bold text-brand transition hover:text-brand-dark">تعبئة آليًا</button> : null}
            </div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="مثال: Toyota Land Cruiser 2025"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الماركة</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              list="admin-vehicle-brands"
              placeholder="اختر أو اكتب الماركة"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
            <datalist id="admin-vehicle-brands">
              {VEHICLE_BRANDS.map((brand) => <option key={brand} value={brand} />)}
            </datalist>
            <p className="text-xs text-slate-500 dark:text-zinc-400">اختر من القائمة أو اكتب أي ماركة أخرى.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الموديل</label>
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              list="admin-vehicle-models"
              placeholder="اختر أو اكتب الموديل"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
            <datalist id="admin-vehicle-models">
              {modelSuggestions.map((model) => <option key={model} value={model} />)}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الفئة</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              {VEHICLE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">السنة</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            >
              <option value="">اختر السنة</option>
              {VEHICLE_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الكيلومترات</label>
            <input
              type="number"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              placeholder="150000"
              min="0"
              step="1"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">نوع الوقود</label>
            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              {FUEL_TYPE_OPTIONS.map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {getFuelTypeLabel(fuelType)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">علبة السرعة</label>
            <input
              type="text"
              name="gearbox"
              value={form.gearbox}
              onChange={handleChange}
              list="admin-gearbox-options"
              placeholder="اختر أو اكتب نوع علبة السرعة"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
            <datalist id="admin-gearbox-options">{GEARBOX_OPTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">نظام الدفع</label>
            <input
              type="text"
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              list="admin-drivetrain-options"
              placeholder="اختر 4x2، 4x4، 6x4..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
            <datalist id="admin-drivetrain-options">{DRIVETRAIN_OPTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">اللون الخارجي</label>
            <input
              type="text"
              name="exteriorColor"
              value={form.exteriorColor}
              onChange={handleChange}
              list="admin-color-options"
              placeholder="اختر أو اكتب اللون"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
            <datalist id="admin-color-options">{EXTERIOR_COLOR_OPTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Engine capacity</label>
            <select name="engineCapacity" value={form.engineCapacity} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent" required>
              <option value="">Select engine capacity</option>
              {ENGINE_CAPACITY_OPTIONS.map((capacity) => <option key={capacity} value={capacity}>{capacity.toFixed(1)} L</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">Regional specifications</label>
            <select name="regionalSpecs" value={form.regionalSpecs} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent" required>
              {REGIONAL_SPECS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">السعر بالدرهم الإماراتي (AED)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder={form.priceType === "Sur demande" ? "السعر عند الطلب" : "95000"}
              min="0"
              step="100"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-white/10 dark:bg-transparent dark:disabled:bg-white/5"
              required={form.priceType !== "Sur demande"}
              disabled={form.priceType === "Sur demande"}
            />
            {form.priceType !== "Sur demande" && Number(form.price) > 0 ? (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                ≈ {currencyTnd(Number(form.price), aedToTndRate)}{exchangeDate ? ` · ${exchangeDate}` : ""}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">طريقة عرض السعر</label>
            <select
              name="priceType"
              value={form.priceType}
              onChange={(event) => {
                const priceType = event.target.value;
                setForm((prev) => ({
                  ...prev,
                  priceType,
                  price: priceType === "Sur demande" ? "" : prev.price
                }));
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              <option value="Prix fixe">سعر ثابت</option>
              <option value="Negociable">قابل للتفاوض</option>
              <option value="Sur demande">السعر عند الطلب</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الحالة</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            >
              {PRODUCT_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">صور المركبة</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            />
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              {selectedFiles.length ? (
                <div className="space-y-2">
                  <p className="font-medium text-slate-700 dark:text-white">
                    تم اختيار {selectedFiles.length} من {MAX_CAR_IMAGES} صورة
                  </p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 dark:bg-white/5"
                      >
                        <span className="truncate">{index + 1}. {file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                          aria-label={`حذف ${file.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    الصورة الأولى ستكون الصورة الرئيسية، والبقية ستظهر في شريط الصور داخل صفحة السيارة.
                  </p>
                </div>
              ) : (
                `يمكنك اختيار حتى ${MAX_CAR_IMAGES} صورة، دفعة واحدة أو على عدة مرات.`
              )}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الشارات</label>
            <input
              type="text"
              name="badges"
              value={form.badges}
              onChange={handleChange}
              placeholder="فحص، تصدير، جاهز"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الوصف</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="اكتب وصف المركبة..."
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          {errorMessage ? (
            <div
              role="alert"
              className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "جارٍ الإضافة..." : "إضافة المركبة"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/cars")}
              className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
