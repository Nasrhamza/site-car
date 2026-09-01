"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import { currency } from "@/lib/utils";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { useLanguage } from "@/lib/site-language";
import {
  AdminCarFields,
  appendAdminCarFields,
  emptyAdminCarForm,
  type AdminCarFieldsSection,
  type AdminCarFormValues
} from "@/components/admin-car-fields";

type CarImage = { url: string; alt: string };

const MAX_SELLER_CAR_IMAGES = 12;
const sections: AdminCarFieldsSection[] = ["listing", "specs", "commercial", "description"];

export default function EditCarPageClient({ mode = "admin" }: { mode?: "admin" | "seller" }) {
  const params = useParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { language } = useLanguage();
  const { rate, date } = useAedToTndRate();
  const [form, setForm] = useState<AdminCarFormValues>(emptyAdminCarForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState<CarImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [serviceFee, setServiceFee] = useState(17000);
  const ar = language === "ar";
  const sellerMode = mode === "seller";
  const carsPath = sellerMode ? "/seller/cars" : "/admin/cars";
  const isLastStep = activeStep === sections.length - 1;
  const copy = ar ? {
    eyebrow: sellerMode ? "مساحة البائع" : "معرض الإدارة", title: "تعديل المركبة", intro: sellerMode ? "عدّل معلومات سيارتك. التعديل يبقى منشوراً ويصل إشعار للمسؤول." : "تحكّم في كل معلومات المركبة ومواصفاتها وصورها من أربع خطوات واضحة.", loading: "جارٍ التحميل...", loadError: "تعذر تحميل المركبة.",
    images: "الصور الحالية", imageHint: "احذف أي صورة لا تريد إبقاءها.", noImages: "لا توجد صور حالية لهذا الإعلان.", remove: "حذف الصورة", addImages: "إضافة صور جديدة", newImageHint: sellerMode ? "يمكنك اختيار صور جديدة (حتى 12 صورة إجمالاً)." : "يمكنك إضافة العدد الذي تحتاجه من الصور.",
    save: "حفظ التعديلات", saving: "جارٍ الحفظ...", cancel: "إلغاء", back: "السابق", next: "التالي", step: "الخطوة", saveError: "حدث خطأ أثناء حفظ التعديلات.",
    steps: ["المعلومات الأساسية", "المواصفات", "السعر والحالة", "الوصف والصور"]
  } : {
    eyebrow: sellerMode ? "Seller inventory" : "Admin inventory", title: "Edit vehicle", intro: sellerMode ? "Update your vehicle. Approved listings stay live and the administrator receives a change notification." : "Control every vehicle detail, specification, status, and photo in four clear steps.", loading: "Loading...", loadError: "Unable to load the vehicle.",
    images: "Current photos", imageHint: "Remove any photo you no longer want to keep.", noImages: "This listing has no current photos.", remove: "Remove photo", addImages: "Add new photos", newImageHint: sellerMode ? "Select new photos (up to 12 photos in total)." : "Add as many new photos as needed.",
    save: "Save changes", saving: "Saving...", cancel: "Cancel", back: "Back", next: "Next", step: "Step", saveError: "An error occurred while saving the changes.",
    steps: ["Basic information", "Specifications", "Price & status", "Description & photos"]
  };

  useEffect(() => {
    if (!id) return;
    api.get(`/cars/by-id/${id}`).then(({ data }) => {
      const stringValue = (value: unknown) => value === undefined || value === null ? "" : String(value);
      setForm({
        ...emptyAdminCarForm,
        name: data?.name || "", brand: data?.brand || "", model: data?.model || "", category: data?.category || emptyAdminCarForm.category,
        bodyType: data?.bodyType || "", trim: data?.trim || "", year: stringValue(data?.year), mileage: stringValue(data?.mileage), fuelType: data?.fuelType || emptyAdminCarForm.fuelType,
        gearbox: data?.gearbox || "", transmission: data?.transmission || data?.drivetrain || "", exteriorColor: data?.exteriorColor || "", interiorColor: data?.interiorColor || "",
        engineCapacity: stringValue(data?.engineCapacity), regionalSpecs: data?.regionalSpecs || "GCC", cylinders: stringValue(data?.cylinders), powerHp: stringValue(data?.powerHp),
        steeringSide: data?.steeringSide || "Left hand", doors: stringValue(data?.doors), seats: stringValue(data?.seats), wheelSize: data?.wheelSize || "", location: data?.location || emptyAdminCarForm.location,
        exportStatus: data?.exportStatus || "Can be exported", serviceHistory: data?.serviceHistory || "", safetyText: Array.isArray(data?.safety) ? data.safety.join(", ") : "",
        price: stringValue(sellerMode ? (data?.sellerPrice ?? data?.price) : data?.price), priceType: data?.priceType || "Prix fixe", status: data?.availability || data?.status || emptyAdminCarForm.status,
        badgesText: Array.isArray(data?.badges) ? data.badges.join(", ") : "", description: data?.description || ""
      });
      setServiceFee(Number(data?.serviceFee ?? 17000));
      setExistingImages(Array.isArray(data?.images) ? data.images.map((image: any) => ({
        url: String(image?.url || "").trim(),
        alt: String(image?.alt || data?.name || "Vehicle").trim() || "Vehicle"
      })).filter((image: CarImage) => image.url) : []);
    }).catch((requestError) => setError(requestError?.response?.data?.message || copy.loadError)).finally(() => setLoading(false));
  }, [id, copy.loadError, sellerMode]);

  const showStep = (index: number) => {
    setError("");
    setActiveStep(Math.max(0, Math.min(index, sections.length - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextStep = () => {
    if (!formRef.current?.reportValidity()) return;
    showStep(activeStep + 1);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files || []);
    const availableSlots = sellerMode ? Math.max(0, MAX_SELLER_CAR_IMAGES - existingImages.length) : Number.POSITIVE_INFINITY;
    setSelectedFiles((current) => {
      const unique = new Map<string, File>();
      [...current, ...incoming].forEach((file) => unique.set(`${file.name}-${file.size}-${file.lastModified}`, file));
      return Array.from(unique.values()).slice(0, availableSlots);
    });
    event.target.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setUploadProgress(0);
    setError("");
    try {
      const formData = new FormData();
      appendAdminCarFields(formData, form);
      formData.append("existingImages", JSON.stringify(existingImages));
      selectedFiles.forEach((file) => formData.append("images", file, file.name));
      await api.put(`/cars/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10 * 60 * 1000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.min(100, Math.round((progressEvent.loaded * 100) / progressEvent.total)));
          }
        }
      });
      router.push(carsPath);
      router.refresh();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || copy.saveError);
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  if (loading) return <div className="rounded-[28px] border bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">{copy.loading}</div>;
  if (error && !form.name) return <div className="rounded-[28px] border bg-white p-6 text-red-600 shadow-premium dark:border-white/10 dark:bg-zinc-900">{error}</div>;

  return <section className="mx-auto w-full max-w-6xl px-1 py-4 sm:px-2 sm:py-6">
    <div className="mb-5">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">{copy.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{copy.title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">{copy.intro}</p>
    </div>

    <div className="mb-5 overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <ol className="flex min-w-[660px] items-center gap-1" aria-label={copy.step}>
        {copy.steps.map((stepLabel, index) => <li key={stepLabel} className="flex min-w-0 flex-1 items-center gap-2">
          <button type="button" onClick={() => showStep(index)} className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-left transition ${index === activeStep ? "bg-brand text-white" : index < activeStep ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5"}`}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${index === activeStep ? "bg-white text-brand" : index < activeStep ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-white/10"}`}>{index < activeStep ? <Check className="h-4 w-4" /> : index + 1}</span>
            <span className="truncate text-xs font-extrabold sm:text-sm">{stepLabel}</span>
          </button>
        </li>)}
      </ol>
    </div>

    <form ref={formRef} onSubmit={handleSubmit} className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{copy.step} {activeStep + 1} / {sections.length}</p>
      <div className={isLastStep ? "grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.85fr)]" : ""}>
        <AdminCarFields form={form} setForm={setForm} aedToTndRate={rate} exchangeDate={date} section={sections[activeStep]} />
        {sellerMode && activeStep === 2 && form.priceType !== "Sur demande" ? <div className="mt-5 grid gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm sm:grid-cols-3 xl:col-span-2"><div><p className="text-zinc-500">Your price</p><p className="mt-1 text-xl font-black">{currency(Number(form.price) || 0)}</p></div><div><p className="text-zinc-500">ALHADUNICARS fees</p><p className="mt-1 text-xl font-black">+ {currency(serviceFee)}</p></div><div><p className="text-zinc-500">Site price</p><p className="mt-1 text-xl font-black text-brand">{currency((Number(form.price) || 0) + serviceFee)}</p></div></div> : null}

        {isLastStep ? <div className="grid gap-5">
          <section className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[.03] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-extrabold">{copy.images}</h2><p className="text-xs text-zinc-500">{copy.imageHint}</p></div>
            {existingImages.length ? <div className="mt-4 grid grid-cols-2 gap-3">{existingImages.map((image, index) => <div key={`${image.url}-${index}`} className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-white/10 dark:bg-zinc-900">
              <div className="relative h-28 overflow-hidden rounded-xl"><Image src={resolveMediaUrl(image.url) || image.url} alt={image.alt} fill className="object-cover" sizes="180px" /></div>
              <button type="button" onClick={() => setExistingImages((current) => current.filter((_image, itemIndex) => itemIndex !== index))} className="mt-2 w-full rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">{copy.remove}</button>
            </div>)}</div> : <p className="mt-4 text-sm text-zinc-500">{copy.noImages}</p>}
          </section>

          <section className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[.03] sm:p-5">
            <h2 className="text-base font-extrabold">{copy.addImages}</h2>
            <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-transparent" />
            <p className="mt-2 text-xs text-zinc-500">{selectedFiles.length ? `${selectedFiles.length} ${ar ? "صورة جديدة" : "new photos"}` : copy.newImageHint}</p>
            {selectedFiles.length ? <div className="mt-3 grid gap-2">{selectedFiles.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm dark:bg-white/5"><span className="truncate">{index + 1}. {file.name}</span><button type="button" onClick={() => setSelectedFiles((current) => current.filter((_file, itemIndex) => itemIndex !== index))} aria-label={`${copy.remove} ${file.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><X className="h-4 w-4" /></button></div>)}</div> : null}
          </section>
        </div> : null}
      </div>

      {error ? <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}

      <div className="sticky bottom-3 z-20 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-[0_12px_35px_rgba(15,23,42,.14)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/95">
        <div className="flex gap-2">
          {activeStep > 0 ? <button type="button" onClick={() => showStep(activeStep - 1)} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{copy.back}</button> : null}
          <button type="button" onClick={() => router.push(carsPath)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold dark:border-white/10">{copy.cancel}</button>
        </div>
        <div className="flex gap-2">
          {!isLastStep ? <button type="button" onClick={goToNextStep} className="inline-flex items-center gap-2 rounded-xl border border-brand px-4 py-3 text-sm font-extrabold text-brand transition hover:bg-red-50 dark:hover:bg-red-500/10">{copy.next}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></button> : null}
          <button type="submit" disabled={saving} className="min-w-40 rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60">{saving ? `${copy.saving}${uploadProgress !== null ? ` ${uploadProgress}%` : ""}` : copy.save}</button>
        </div>
      </div>
    </form>
  </section>;
}
