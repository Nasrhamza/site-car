"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  BODY_TYPE_OPTIONS,
  DEFAULT_FUEL_TYPE,
  DEFAULT_VEHICLE_CATEGORY,
  DRIVETRAIN_OPTIONS,
  ENGINE_CAPACITY_OPTIONS,
  EXPORT_STATUS_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
  FUEL_TYPE_OPTIONS,
  GEARBOX_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  REGIONAL_SPECS_OPTIONS,
  SEATING_CAPACITY_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  STEERING_SIDE_OPTIONS,
  TRIM_OPTIONS,
  VEHICLE_BRANDS,
  VEHICLE_CATEGORIES,
  VEHICLE_YEARS,
  getCategoryDisplayLabel,
  getFuelTypeLabel,
  getStatusLabel,
  getVehicleModelSuggestions
} from "@/lib/company";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";
import { currencyTnd } from "@/lib/utils";

export type AdminCarFormValues = {
  name: string; brand: string; model: string; category: string; bodyType: string; trim: string;
  year: string; mileage: string; fuelType: string; gearbox: string; transmission: string;
  exteriorColor: string; interiorColor: string; engineCapacity: string; regionalSpecs: string;
  cylinders: string; powerHp: string; steeringSide: string; doors: string; seats: string;
  wheelSize: string; location: string; exportStatus: string; serviceHistory: string; safetyText: string;
  price: string; priceType: string; status: string; badgesText: string; shortDescription: string; description: string;
};

export type AdminCarFieldsSection = "all" | "listing" | "specs" | "commercial" | "description";

export const emptyAdminCarForm: AdminCarFormValues = {
  name: "", brand: "", model: "", category: DEFAULT_VEHICLE_CATEGORY, bodyType: "", trim: "",
  year: "", mileage: "", fuelType: DEFAULT_FUEL_TYPE, gearbox: "", transmission: "",
  exteriorColor: "", interiorColor: "", engineCapacity: "", regionalSpecs: "GCC",
  cylinders: "", powerHp: "", steeringSide: "Left hand", doors: "", seats: "",
  wheelSize: "", location: "Dubai, United Arab Emirates", exportStatus: "Can be exported", serviceHistory: "", safetyText: "",
  price: "", priceType: "Prix fixe", status: PRODUCT_STATUS_OPTIONS[0], badgesText: "", shortDescription: "", description: ""
};

export const adminCarPayloadFields: Array<keyof AdminCarFormValues> = [
  "name", "brand", "model", "category", "bodyType", "trim", "year", "mileage", "fuelType", "gearbox", "transmission",
  "exteriorColor", "interiorColor", "engineCapacity", "regionalSpecs", "cylinders", "powerHp", "steeringSide", "doors", "seats",
  "wheelSize", "location", "exportStatus", "serviceHistory", "price", "priceType", "status", "shortDescription", "description"
];

export function appendAdminCarFields(formData: FormData, form: AdminCarFormValues) {
  adminCarPayloadFields.forEach((key) => formData.append(key, form[key] || ""));
  formData.append("badges", form.badgesText || "");
  formData.append("safety", form.safetyText || "");
}

const fieldClass = "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-brand dark:border-white/10 dark:bg-transparent dark:text-white";
const labelClass = "grid min-w-0 gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-300";

export function AdminCarFields({ form, setForm, aedToTndRate, exchangeDate, section = "all" }: { form: AdminCarFormValues; setForm: Dispatch<SetStateAction<AdminCarFormValues>>; aedToTndRate: number; exchangeDate?: string | null; section?: AdminCarFieldsSection }) {
  const { language } = useLanguage();
  const ar = language === "ar";
  const modelSuggestions = getVehicleModelSuggestions(form.brand);
  const c = ar ? {
    listing: "معلومات الإعلان", specs: "المواصفات والمزايا", commercial: "السعر والحالة", descriptionSection: "الوصف والمحتوى",
    name: "اسم الإعلان", brand: "الماركة", model: "الموديل", category: "الفئة الرئيسية", bodyType: "نوع الهيكل", trim: "التجهيز (اختياري)",
    year: "سنة الصنع", mileage: "الكيلومترات", fuel: "نوع الوقود", transmission: "ناقل الحركة", drive: "نظام الدفع", exterior: "اللون الخارجي", interior: "اللون الداخلي",
    engine: "سعة المحرك", regional: "المواصفات الإقليمية", cylinders: "عدد الأسطوانات", horsepower: "القوة بالحصان", steering: "جهة المقود", doors: "عدد الأبواب", seats: "عدد المقاعد (1–100)", wheel: "حجم العجلات", location: "الموقع",
    exportStatus: "حالة التصدير", service: "سجل الصيانة", safety: "مزايا السلامة (مفصولة بفواصل)", price: "السعر بالدرهم الإماراتي", priceType: "طريقة عرض السعر", status: "حالة الإعلان", badges: "الشارات (مفصولة بفواصل)", short: "وصف مختصر", description: "الوصف الكامل", choose: "اختر", optional: "اختياري"
  } : {
    listing: "Listing information", specs: "Specs & features", commercial: "Price & status", descriptionSection: "Description & content",
    name: "Listing title", brand: "Make", model: "Model", category: "Main category", bodyType: "Body type", trim: "Trim (optional)",
    year: "Model year", mileage: "Kilométrage", fuel: "Fuel type", transmission: "Transmission", drive: "Drive type", exterior: "Exterior color", interior: "Interior color",
    engine: "Engine capacity", regional: "Regional specs", cylinders: "Cylinders", horsepower: "Horsepower", steering: "Steering side", doors: "Number of doors", seats: "Seating capacity (1–100)", wheel: "Wheel size", location: "Location",
    exportStatus: "Export status", service: "Service history", safety: "Safety features (comma separated)", price: "Price in AED", priceType: "Price display", status: "Listing status", badges: "Badges (comma separated)", short: "Short description", description: "Full description", choose: "Select", optional: "Optional"
  };
  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const bodyArabic: Record<string, string> = { "SUV/Crossover": "دفع رباعي / كروس أوفر", Sedan: "سيدان", "Pick Up Truck": "بيك آب", Coupe: "كوبيه", Van: "فان", Hatchback: "هاتشباك", Convertible: "مكشوفة", Truck: "شاحنة", Bus: "حافلة", "Station Wagon": "ستيشن واغن", Other: "أخرى", Bike: "دراجة", Sportback: "سبورتباك", Limousine: "ليموزين", Buggy: "باغي" };
  const simpleArabic: Record<string, string> = { "Basic Option": "تجهيز أساسي", "Mid Option": "تجهيز متوسط", "Full Option": "كاملة التجهيز", "Left hand": "مقود يسار", "Right hand": "مقود يمين", "Can be exported": "قابلة للتصدير", "Local sale only": "بيع محلي فقط", Yes: "نعم", Partial: "جزئي", No: "لا" };
  const simpleEnglish: Record<string, string> = { Automatique: "Automatic", Manuelle: "Manual", "Séquentielle": "Sequential", Autre: "Other", Noir: "Black", Blanc: "White", Gris: "Grey", Argent: "Silver", Bleu: "Blue", Rouge: "Red", Vert: "Green", Beige: "Beige", Marron: "Brown", Or: "Gold", Orange: "Orange", Jaune: "Yellow", Violet: "Purple" };
  const optionLabel = (value: string) => ar ? (bodyArabic[value] || simpleArabic[value] || value) : (simpleEnglish[value] || translateVehicleValue(value, "en") || value);

  return <div className="grid gap-5">
    {section === "all" || section === "listing" ? <FieldGroup title={c.listing}>
      <label className={labelClass}>{c.name}<input name="name" value={form.name} onChange={update} className={fieldClass} placeholder={ar ? "مثال: Toyota Land Cruiser 2026" : "Example: Toyota Land Cruiser 2026"} required /></label>
      <label className={labelClass}>{c.brand}<input name="brand" value={form.brand} onChange={update} list="admin-car-brands" className={fieldClass} placeholder={ar ? "اختر أو اكتب الماركة" : "Select or enter make"} required /><datalist id="admin-car-brands">{VEHICLE_BRANDS.map((item) => <option key={item} value={item} />)}</datalist></label>
      <label className={labelClass}>{c.model}<input name="model" value={form.model} onChange={update} list="admin-car-models" className={fieldClass} placeholder={ar ? "اختر أو اكتب الموديل" : "Select or enter model"} required /><datalist id="admin-car-models">{modelSuggestions.map((item) => <option key={item} value={item} />)}</datalist></label>
      <SelectField label={c.category} name="category" value={form.category} onChange={update} options={VEHICLE_CATEGORIES} renderLabel={(value) => getCategoryDisplayLabel(value, language)} />
      <SelectField label={c.bodyType} name="bodyType" value={form.bodyType} onChange={update} options={BODY_TYPE_OPTIONS} emptyLabel={c.choose} renderLabel={optionLabel} required />
      <SelectField label={c.trim} name="trim" value={form.trim} onChange={update} options={TRIM_OPTIONS} emptyLabel={c.optional} renderLabel={optionLabel} />
      <SelectField label={c.year} name="year" value={form.year} onChange={update} options={VEHICLE_YEARS.map(String)} emptyLabel={c.choose} required />
      <label className={labelClass}>{c.mileage}<input name="mileage" type="number" min="0" step="1" value={form.mileage} onChange={update} className={fieldClass} placeholder="0" required /></label>
    </FieldGroup> : null}

    {section === "all" || section === "specs" ? <FieldGroup title={c.specs} columns={3}>
      <SelectField label={c.fuel} name="fuelType" value={form.fuelType} onChange={update} options={FUEL_TYPE_OPTIONS} renderLabel={(value) => ar ? getFuelTypeLabel(value) : optionLabel(value)} />
      <SelectField label={c.transmission} name="gearbox" value={form.gearbox} onChange={update} options={GEARBOX_OPTIONS} emptyLabel={c.choose} renderLabel={optionLabel} required />
      <SelectField label={c.drive} name="transmission" value={form.transmission} onChange={update} options={DRIVETRAIN_OPTIONS} emptyLabel={c.choose} required />
      <SelectField label={c.exterior} name="exteriorColor" value={form.exteriorColor} onChange={update} options={EXTERIOR_COLOR_OPTIONS} emptyLabel={c.choose} renderLabel={optionLabel} required />
      <label className={labelClass}>{c.interior}<input name="interiorColor" value={form.interiorColor} onChange={update} className={fieldClass} placeholder={c.optional} /></label>
      <SelectField label={c.engine} name="engineCapacity" value={form.engineCapacity} onChange={update} options={ENGINE_CAPACITY_OPTIONS.map(String)} emptyLabel={c.choose} renderLabel={(value) => `${Number(value).toFixed(1)} L`} required />
      <SelectField label={c.regional} name="regionalSpecs" value={form.regionalSpecs} onChange={update} options={REGIONAL_SPECS_OPTIONS} />
      <label className={labelClass}>{c.cylinders}<input name="cylinders" type="number" min="1" max="24" value={form.cylinders} onChange={update} className={fieldClass} placeholder={c.optional} /></label>
      <label className={labelClass}>{c.horsepower}<input name="powerHp" type="number" min="1" value={form.powerHp} onChange={update} className={fieldClass} placeholder="130" /></label>
      <SelectField label={c.steering} name="steeringSide" value={form.steeringSide} onChange={update} options={STEERING_SIDE_OPTIONS} renderLabel={optionLabel} />
      <label className={labelClass}>{c.doors}<input name="doors" type="number" min="1" max="20" value={form.doors} onChange={update} className={fieldClass} placeholder={c.optional} /></label>
      <SelectField label={c.seats} name="seats" value={form.seats} onChange={update} options={SEATING_CAPACITY_OPTIONS.map(String)} emptyLabel={c.choose} />
      <label className={labelClass}>{c.wheel}<input name="wheelSize" value={form.wheelSize} onChange={update} className={fieldClass} placeholder={'17"'} /></label>
      <label className={labelClass}>{c.location}<input name="location" value={form.location} onChange={update} className={fieldClass} placeholder="Dubai, United Arab Emirates" /></label>
      <SelectField label={c.exportStatus} name="exportStatus" value={form.exportStatus} onChange={update} options={EXPORT_STATUS_OPTIONS} renderLabel={optionLabel} />
      <SelectField label={c.service} name="serviceHistory" value={form.serviceHistory} onChange={update} options={SERVICE_HISTORY_OPTIONS} emptyLabel={c.choose} renderLabel={optionLabel} />
      <label className={`${labelClass} md:col-span-2 lg:col-span-3`}>{c.safety}<input name="safetyText" value={form.safetyText} onChange={update} className={fieldClass} placeholder={ar ? "ABS، وسائد هوائية، تحذير مغادرة المسار" : "ABS, airbags, lane departure warning"} /></label>
    </FieldGroup> : null}

    {section === "all" || section === "commercial" ? <FieldGroup title={c.commercial}>
      <label className={labelClass}>{c.price}<input name="price" type="number" min="0" step="100" value={form.price} onChange={update} className={fieldClass} placeholder={form.priceType === "Sur demande" ? (ar ? "السعر عند الطلب" : "Price on request") : "95000"} required={form.priceType !== "Sur demande"} disabled={form.priceType === "Sur demande"} />{form.priceType !== "Sur demande" && Number(form.price) > 0 ? <span className="text-xs font-medium text-emerald-700">≈ {currencyTnd(Number(form.price), aedToTndRate)}{exchangeDate ? ` · ${exchangeDate}` : ""}</span> : null}</label>
      <SelectField label={c.priceType} name="priceType" value={form.priceType} onChange={(event) => setForm((current) => ({ ...current, priceType: event.target.value, price: event.target.value === "Sur demande" ? "" : current.price }))} options={["Prix fixe", "Negociable", "Sur demande"]} renderLabel={(value) => ar ? ({ "Prix fixe": "سعر ثابت", Negociable: "قابل للتفاوض", "Sur demande": "السعر عند الطلب" }[value] || value) : ({ "Prix fixe": "Fixed price", Negociable: "Negotiable", "Sur demande": "Price on request" }[value] || value)} />
      <SelectField label={c.status} name="status" value={form.status} onChange={update} options={PRODUCT_STATUS_OPTIONS} renderLabel={(value) => ar ? getStatusLabel(value) : optionLabel(value)} />
      <label className={labelClass}>{c.badges}<input name="badgesText" value={form.badgesText} onChange={update} className={fieldClass} placeholder={ar ? "موثقة، جاهزة للتصدير" : "Verified, export ready"} /></label>
    </FieldGroup> : null}

    {section === "all" || section === "description" ? <FieldGroup title={c.descriptionSection}>
      <label className={`${labelClass} md:col-span-2`}>{c.short}<textarea name="shortDescription" value={form.shortDescription} onChange={update} rows={2} className={fieldClass} /></label>
      <label className={`${labelClass} md:col-span-2`}>{c.description}<textarea name="description" value={form.description} onChange={update} rows={6} className={fieldClass} required /></label>
    </FieldGroup> : null}
  </div>;
}

function FieldGroup({ title, children, columns = 2 }: { title: string; children: React.ReactNode; columns?: 2 | 3 }) {
  return <fieldset className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/[.03] sm:p-5"><legend className="px-2 text-base font-extrabold text-zinc-950 dark:text-white">{title}</legend><div className={`grid gap-4 md:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>{children}</div></fieldset>;
}

function SelectField({ label, name, value, onChange, options, emptyLabel, renderLabel, required = false }: { label: string; name: string; value: string; onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; options: readonly string[]; emptyLabel?: string; renderLabel?: (value: string) => string; required?: boolean }) {
  return <label className={labelClass}>{label}<select name={name} value={value} onChange={onChange} className={fieldClass} required={required}>{emptyLabel !== undefined ? <option value="">{emptyLabel}</option> : null}{options.map((option) => <option key={option} value={option}>{renderLabel ? renderLabel(option) : option}</option>)}</select></label>;
}
