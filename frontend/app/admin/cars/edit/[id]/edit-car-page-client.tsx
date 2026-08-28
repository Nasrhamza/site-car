"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { useLanguage } from "@/lib/site-language";
import { AdminCarFields, appendAdminCarFields, emptyAdminCarForm, type AdminCarFormValues } from "@/components/admin-car-fields";

type CarImage = { url: string; alt: string };

export default function EditCarPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { language } = useLanguage();
  const { rate, date } = useAedToTndRate();
  const [form, setForm] = useState<AdminCarFormValues>(emptyAdminCarForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState<CarImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const ar = language === "ar";
  const copy = ar ? {
    title: "تعديل المركبة", intro: "حدّث المعلومات والمواصفات والصور. الحقول الجديدة اختيارية ما لم يذكر غير ذلك.", loading: "جارٍ التحميل...", loadError: "تعذر تحميل المركبة.", images: "الصور الحالية", imageHint: "احذف أي صورة لا تريد إبقاءها.", noImages: "لا توجد صور حالية لهذا الإعلان.", remove: "حذف الصورة", addImages: "إضافة صور جديدة", newImageHint: "يمكنك اختيار صورة واحدة أو عدة صور جديدة.", save: "حفظ التعديلات", saving: "جارٍ الحفظ...", cancel: "إلغاء", saveError: "حدث خطأ أثناء حفظ التعديلات."
  } : {
    title: "Edit vehicle", intro: "Update the information, specifications, and photos. New fields are optional unless marked otherwise.", loading: "Loading...", loadError: "Unable to load the vehicle.", images: "Current photos", imageHint: "Remove any photo you no longer want to keep.", noImages: "This listing has no current photos.", remove: "Remove photo", addImages: "Add new photos", newImageHint: "You can select one or several new photos.", save: "Save changes", saving: "Saving...", cancel: "Cancel", saveError: "An error occurred while saving the changes."
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
        price: stringValue(data?.price), priceType: data?.priceType || "Prix fixe", status: data?.availability || data?.status || emptyAdminCarForm.status,
        badgesText: Array.isArray(data?.badges) ? data.badges.join(", ") : "", shortDescription: data?.shortDescription || "", description: data?.description || ""
      });
      setExistingImages(Array.isArray(data?.images) ? data.images.map((image: any) => ({ url: String(image?.url || "").trim(), alt: String(image?.alt || data?.name || "Vehicle").trim() || "Vehicle" })).filter((image: CarImage) => image.url) : []);
    }).catch((requestError) => setError(requestError?.response?.data?.message || copy.loadError)).finally(() => setLoading(false));
  }, [id, copy.loadError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      appendAdminCarFields(formData, form);
      formData.append("existingImages", JSON.stringify(existingImages));
      selectedFiles.forEach((file) => formData.append("images", file));
      await api.put(`/cars/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      router.push("/admin/cars");
      router.refresh();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || copy.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-[28px] border bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900">{copy.loading}</div>;
  if (error && !form.name) return <div className="rounded-[28px] border bg-white p-6 text-red-600 shadow-premium dark:border-white/10 dark:bg-zinc-900">{error}</div>;

  return <section className="w-full max-w-6xl">
    <div className="mb-6"><h1 className="text-3xl font-black text-zinc-950 dark:text-white sm:text-4xl">{copy.title}</h1><p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-500">{copy.intro}</p></div>
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-7">
      <AdminCarFields form={form} setForm={setForm} aedToTndRate={rate} exchangeDate={date} />

      <section className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[.03] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-extrabold">{copy.images}</h2><p className="text-xs text-zinc-500">{copy.imageHint}</p></div>
        {existingImages.length ? <div className="mt-4 flex gap-3 overflow-x-auto pb-2">{existingImages.map((image, index) => <div key={`${image.url}-${index}`} className="w-[180px] shrink-0 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900"><div className="relative h-28 overflow-hidden rounded-xl"><Image src={resolveMediaUrl(image.url) || image.url} alt={image.alt} fill className="object-cover" sizes="180px" /></div><button type="button" onClick={() => setExistingImages((current) => current.filter((_image, itemIndex) => itemIndex !== index))} className="mt-3 w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">{copy.remove}</button></div>)}</div> : <p className="mt-4 text-sm text-zinc-500">{copy.noImages}</p>}
      </section>

      <section className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[.03] sm:p-5"><h2 className="text-base font-extrabold">{copy.addImages}</h2><input type="file" accept="image/*" multiple onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-transparent" /><p className="mt-2 text-xs text-zinc-500">{selectedFiles.length ? `${selectedFiles.length} ${ar ? "صورة جديدة" : "new photos"}` : copy.newImageHint}</p></section>

      {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
      <div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-2xl bg-brand px-6 py-3.5 text-sm font-extrabold text-white disabled:opacity-70">{saving ? copy.saving : copy.save}</button><button type="button" onClick={() => router.push("/admin/cars")} className="rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-bold dark:border-white/10">{copy.cancel}</button></div>
    </form>
  </section>;
}
