"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { api } from "@/lib/api";
import { currency } from "@/lib/utils";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { AdminCarFields, appendAdminCarFields, emptyAdminCarForm, type AdminCarFieldsSection } from "@/components/admin-car-fields";
import { useLanguage } from "@/lib/site-language";
import { reorderItems, SortablePhotoGrid } from "@/components/sortable-photo-grid";

const SERVICE_FEE = 17000;
const sections: AdminCarFieldsSection[] = ["listing", "specs", "commercial", "description"];

export default function SellerAddCarPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const ar = language === "ar";
  const { rate, date } = useAedToTndRate();
  const [form, setForm] = useState(emptyAdminCarForm);
  const [files, setFiles] = useState<File[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const isLast = activeStep === sections.length - 1;
  const steps = ar ? ["المعلومات الأساسية", "المواصفات", "السعر", "الوصف والصور"] : ["Basic information", "Specifications", "Your price", "Description & photos"];
  const sellerPrice = Number(form.price) || 0;
  const finalPrice = sellerPrice + SERVICE_FEE;

  const showStep = (index: number) => { setActiveStep(Math.max(0, Math.min(index, sections.length - 1))); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => { if (formRef.current?.reportValidity()) showStep(activeStep + 1); };
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => { const incoming = Array.from(event.target.files || []); setFiles((current) => { const unique = new Map<string, File>(); [...current, ...incoming].forEach((file) => unique.set(`${file.name}-${file.size}-${file.lastModified}`, file)); return Array.from(unique.values()); }); event.target.value = ""; };

  return <section className="mx-auto w-full max-w-[1500px] py-4"><div className="mb-5"><p className="text-sm font-black uppercase tracking-[.25em] text-brand">{ar ? "مخزون البائع" : "Seller inventory"}</p><h1 className="mt-2 text-4xl font-black">{ar ? "إضافة مركبة" : "Add a vehicle"}</h1><p className="mt-2 text-sm text-zinc-500">{ar ? "أكمل الإعلان ليصل إلى الإدارة للموافقة." : "Complete the listing. It will be sent to the administrator for approval."}</p></div>
    <div className="mb-5 overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-2 dark:border-white/10 dark:bg-zinc-900"><ol className="flex min-w-[660px] gap-1">{steps.map((label, index) => <li key={label} className="flex-1"><button type="button" onClick={() => showStep(index)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left ${index === activeStep ? "bg-brand text-white" : index < activeStep ? "bg-emerald-50 text-emerald-700" : "text-zinc-400"}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${index === activeStep ? "bg-white text-brand" : "bg-zinc-100 text-zinc-600"}`}>{index < activeStep ? <Check className="h-4 w-4" /> : index + 1}</span><span className="truncate text-sm font-black">{label}</span></button></li>)}</ol></div>
    <form ref={formRef} className="rounded-[28px] border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:p-6" onSubmit={async (event) => {
      event.preventDefault();
      if (saving) return;
      setSaving(true);
      setUploadProgress(0);
      setError("");

      try {
        const data = new FormData();
        appendAdminCarFields(data, form);
        files.forEach((file) => data.append("images", file, file.name));
        await api.post("/cars", data, {
          timeout: 10 * 60 * 1000,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(Math.min(100, Math.round((progressEvent.loaded * 100) / progressEvent.total)));
            }
          }
        });
        router.push("/seller/cars");
        router.refresh();
      } catch (requestError: any) {
        const timeout = requestError?.code === "ECONNABORTED";
        setError(requestError?.response?.data?.message || (timeout
          ? (ar ? "استغرق رفع الصور وقتاً طويلاً. قلّل حجم الصور ثم أعد المحاولة." : "The upload took too long. Reduce the photo sizes and try again.")
          : (ar ? "تعذر إضافة المركبة. أعد المحاولة." : "Unable to add vehicle. Please try again.")));
      } finally {
        setSaving(false);
        setUploadProgress(null);
      }
    }}>
      <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-zinc-400">{ar ? "الخطوة" : "Step"} {activeStep + 1} / 4</p><AdminCarFields form={form} setForm={setForm} aedToTndRate={rate} exchangeDate={date} section={sections[activeStep]} />
      {activeStep === 2 && form.priceType !== "Sur demande" ? <div className="mt-5 grid gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm sm:grid-cols-3"><div><p className="text-zinc-500">{ar ? "سعرك" : "Your price"}</p><p className="mt-1 text-xl font-black">{currency(sellerPrice)}</p></div><div><p className="text-zinc-500">{ar ? "مصاريف ALHADUNICARS الافتراضية" : "Default ALHADUNICARS fees"}</p><p className="mt-1 text-xl font-black">+ {currency(SERVICE_FEE)}</p></div><div><p className="text-zinc-500">{ar ? "سعر الموقع الأولي" : "Initial site price"}</p><p className="mt-1 text-xl font-black text-brand">{currency(finalPrice)}</p></div><p className="sm:col-span-3 text-xs text-zinc-500">{ar ? "يمكن للإدارة تعديل المصاريف قبل الموافقة أو بعدها." : "The administrator can adjust ALHADUNICARS fees before or after approval."}</p></div> : null}
      {isLast ? <section className="mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[.03]"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-black">{ar ? "صور المركبة" : "Vehicle photos"}</h2>{files.length ? <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-black text-brand">{files.length} {ar ? "صورة" : "photos"}</span> : null}</div><input type="file" accept="image/*" multiple onChange={handleFiles} className="mt-4 w-full rounded-2xl border bg-white px-4 py-3 dark:bg-transparent" /><p className="mt-2 text-xs text-zinc-500">{ar ? "يمكنك اختيار العدد الذي تحتاجه من الصور. رتّبها بالسحب أو الأسهم واضغط على النجمة لاختيار الغلاف." : "Select as many photos as needed. Drag or use the arrows to order them, and use the star to choose the cover."}</p><SortablePhotoGrid language={ar ? "ar" : "en"} items={files.map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}`, label: file.name, file }))} onReorder={(from, to) => setFiles((current) => reorderItems(current, from, to))} onRemove={(index) => setFiles((current) => current.filter((_file, itemIndex) => itemIndex !== index))} /></section> : null}
      {error ? <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}
      <div className="sticky bottom-3 z-20 mt-5 flex flex-wrap justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/95"><div className="flex gap-2">{activeStep > 0 ? <button type="button" disabled={saving} onClick={() => showStep(activeStep - 1)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold disabled:opacity-50"><ArrowLeft className="h-4 w-4" />{ar ? "السابق" : "Back"}</button> : null}<button type="button" disabled={saving} onClick={() => router.push("/seller/cars")} className="rounded-xl border px-4 py-3 text-sm font-bold disabled:opacity-50">{ar ? "إلغاء" : "Cancel"}</button></div>{isLast ? <button disabled={saving} className="min-w-40 rounded-xl bg-brand px-6 py-3 text-sm font-black text-white disabled:cursor-wait disabled:opacity-80">{saving ? `${ar ? "جار الإرسال" : "Submitting"}${uploadProgress !== null ? ` ${uploadProgress}%` : "..."}` : (ar ? "إرسال للموافقة" : "Submit for approval")}</button> : <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-black text-white">{ar ? "التالي" : "Next"}<ArrowRight className="h-4 w-4" /></button>}</div>
    </form>
  </section>;
}
