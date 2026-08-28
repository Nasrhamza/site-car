"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { useLanguage } from "@/lib/site-language";
import { AdminCarFields, appendAdminCarFields, emptyAdminCarForm, type AdminCarFieldsSection } from "@/components/admin-car-fields";

const MAX_CAR_IMAGES = 12;

export default function AddCarPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { rate, date } = useAedToTndRate();
  const [form, setForm] = useState(emptyAdminCarForm);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const ar = language === "ar";
  const copy = ar ? {
    eyebrow: "معرض الإدارة", title: "إضافة مركبة", intro: "أضف السيارة في أربع خطوات قصيرة. أول صورة ستكون الصورة الرئيسية.", images: "صور المركبة", imageHelp: "يمكنك اختيار حتى 12 صورة. أول صورة ستكون الرئيسية.", selected: "صورة مختارة", remove: "حذف", submit: "إضافة المركبة", saving: "جارٍ الإضافة...", cancel: "إلغاء", back: "السابق", next: "التالي", step: "الخطوة", error: "تعذر إضافة المركبة. تأكد من المعلومات والصور ثم حاول مرة أخرى.", steps: ["المعلومات الأساسية", "المواصفات", "السعر والحالة", "الوصف والصور"]
  } : {
    eyebrow: "Admin inventory", title: "Add vehicle", intro: "Add the vehicle in four short steps. The first photo will be the cover image.", images: "Vehicle photos", imageHelp: "You can select up to 12 photos. The first photo will be the cover image.", selected: "photos selected", remove: "Remove", submit: "Add vehicle", saving: "Adding...", cancel: "Cancel", back: "Back", next: "Next", step: "Step", error: "Unable to add the vehicle. Check the information and photos, then try again.", steps: ["Basic information", "Specifications", "Price & status", "Description & photos"]
  };
  const sections: AdminCarFieldsSection[] = ["listing", "specs", "commercial", "description"];
  const isLastStep = activeStep === sections.length - 1;

  const goToNextStep = () => {
    if (!formRef.current?.reportValidity()) return;
    setErrorMessage("");
    setActiveStep((current) => Math.min(current + 1, sections.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousStep = () => {
    setErrorMessage("");
    setActiveStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files || []);
    setSelectedFiles((current) => {
      const unique = new Map<string, File>();
      [...current, ...incoming].forEach((file) => unique.set(`${file.name}-${file.size}-${file.lastModified}`, file));
      return Array.from(unique.values()).slice(0, MAX_CAR_IMAGES);
    });
    event.target.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const formData = new FormData();
      appendAdminCarFields(formData, form);
      selectedFiles.forEach((file) => formData.append("images", file, file.name));
      await api.post("/cars", formData);
      router.push("/admin/cars");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || copy.error);
    } finally {
      setLoading(false);
    }
  };

  return <section className="mx-auto w-full max-w-6xl px-1 py-4 sm:px-2 sm:py-6">
    <div className="mb-5"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">{copy.eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{copy.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{copy.intro}</p></div>

    <div className="mb-5 overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <ol className="flex min-w-[660px] items-center gap-1" aria-label={copy.step}>
        {copy.steps.map((stepLabel, index) => <li key={stepLabel} className="flex min-w-0 flex-1 items-center gap-2">
          <div className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 ${index === activeStep ? "bg-brand text-white" : index < activeStep ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "text-zinc-400"}`}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${index === activeStep ? "bg-white text-brand" : index < activeStep ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-white/10"}`}>{index < activeStep ? <Check className="h-4 w-4" /> : index + 1}</span>
            <span className="truncate text-xs font-extrabold sm:text-sm">{stepLabel}</span>
          </div>
        </li>)}
      </ol>
    </div>

    <form ref={formRef} onSubmit={handleSubmit} className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{copy.step} {activeStep + 1} / {sections.length}</p>
      <div className={isLastStep ? "grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,.72fr)]" : ""}>
        <AdminCarFields form={form} setForm={setForm} aedToTndRate={rate} exchangeDate={date} section={sections[activeStep]} />
        {isLastStep ? <section className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[.03] sm:p-5">
        <h2 className="text-base font-extrabold text-zinc-950 dark:text-white">{copy.images}</h2>
        <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-transparent" />
        <p className="mt-2 text-xs text-zinc-500">{copy.imageHelp}</p>
        {selectedFiles.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2"><p className="col-span-full text-sm font-bold">{selectedFiles.length} {copy.selected}</p>{selectedFiles.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm dark:bg-white/5"><span className="truncate">{index + 1}. {file.name}</span><button type="button" onClick={() => setSelectedFiles((current) => current.filter((_file, itemIndex) => itemIndex !== index))} aria-label={`${copy.remove} ${file.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><X className="h-4 w-4" /></button></div>)}</div> : null}
      </section> : null}
      </div>
      {errorMessage ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{errorMessage}</div> : null}
      <div className="sticky bottom-3 z-20 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-[0_12px_35px_rgba(15,23,42,.14)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/95">
        <div className="flex gap-2">
          {activeStep > 0 ? <button type="button" onClick={goToPreviousStep} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{copy.back}</button> : null}
          <button type="button" onClick={() => router.push("/admin/cars")} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold dark:border-white/10">{copy.cancel}</button>
        </div>
        {isLastStep ? <button type="submit" disabled={loading} className="rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60">{loading ? copy.saving : copy.submit}</button> : <button type="button" onClick={goToNextStep} className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white transition hover:bg-brand-dark">{copy.next}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></button>}
      </div>
    </form>
  </section>;
}
