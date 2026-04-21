"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      router.push("/admin/cars");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إضافة المركبة");
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
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الاسم</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="مثال: Volvo FH 2023"
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
              placeholder="مثال: Volvo"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الموديل</label>
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="مثال: FH"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
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
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الكيلومترات</label>
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
              placeholder="أوتوماتيك / يدوي"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">الدفع / النقل</label>
            <input
              type="text"
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              placeholder="4x2 / 6x4 / دفع رباعي"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">اللون الخارجي</label>
            <input
              type="text"
              name="exteriorColor"
              value={form.exteriorColor}
              onChange={handleChange}
              placeholder="أبيض / أحمر / رمادي"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">السعر</label>
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
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-rose-400 dark:border-white/10 dark:bg-transparent"
            />
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              {selectedFiles.length ? (
                <div className="space-y-2">
                  <p className="font-medium text-slate-700 dark:text-white">
                    تم اختيار {selectedFiles.length} صورة
                  </p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {selectedFiles.map((file, index) => (
                      <li key={`${file.name}-${index}`}>
                        {index + 1}. {file.name}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    الصورة الأولى ستكون الصورة الرئيسية، والبقية ستظهر في شريط الصور داخل صفحة السيارة.
                  </p>
                </div>
              ) : (
                "يمكنك اختيار صورة واحدة أو عدة صور لنفس المركبة."
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
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">التجهيزات</label>
            <input
              type="text"
              name="equipment"
              value={form.equipment}
              onChange={handleChange}
              placeholder="GPS، كاميرا، تكييف..."
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
