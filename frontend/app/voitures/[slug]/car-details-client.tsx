"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gauge,
  Globe2,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  Share2,
  ShieldCheck,
  Truck,
  X
} from "lucide-react";
import { useGarageStore } from "@/store/favorites";
import { buildWhatsAppLink, currency, currencyTnd, resolveMediaUrl } from "@/lib/utils";
import {
  buildWhatsAppUrl,
  COMPANY_LOCATION,
  COMPANY_WHATSAPP_PHONE,
  getBadgeLabel,
  getCategoryLabel,
  getFuelTypeLabel,
  getPriceTypeLabel,
  getStatusLabel,
  getTransmissionLabel,
  localizeFeatureLabel,
  localizeFeatureValue
} from "@/lib/company";
import { CarCard } from "@/components/car-card";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

function hasDisplayValue(value: unknown) {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim();
  return Boolean(normalized && normalized !== "-" && normalized !== "—");
}

export default function CarDetailsClient({ initialData }: { initialData: any }) {
  const { favorites, toggleFavorite } = useGarageStore();
  const { rate: aedToTndRate } = useAedToTndRate();
  const { language } = useLanguage();

  const data = initialData;
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => { setActive(0); setDescriptionExpanded(false); }, [data?.car?._id]);

  const whatsappHref = useMemo(() => {
    if (!data?.car) return "#";
    return buildWhatsAppLink({
      name: data.car.name || "مركبة",
      slug: data.car.slug || "",
      price: data.car.price,
      mileage: data.car.mileage || 0,
      year: typeof data.car.year === "number" ? data.car.year : undefined
    });
  }, [data]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: data?.car?.name || "ALHADUNICARS", text: data?.car?.name || "Vehicle", url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (shareError) {
      console.error("خطأ نسخ الرابط :", shareError);
    }
  };

  const { car, similar } = data;
  const images = Array.isArray(car?.images) ? car.images : [];
  const activeImage = resolveMediaUrl(images[active]?.url) || "/guide-import.svg";
  const rawAvailability = car?.availability || car?.status || "Disponible";
  const availability = translateVehicleValue(rawAvailability, language) || getStatusLabel(rawAvailability);
  const safePrice = car?.price || null;
  const safeYear = car?.year != null ? String(car.year) : "";
  const safeMileage = typeof car?.mileage === "number" ? `${car.mileage.toLocaleString("fr-FR")} km` : "";
  const rawFuel = car?.fuelType || car?.fuel || "";
  const safeFuel = translateVehicleValue(rawFuel, language) || getFuelTypeLabel(rawFuel);
  const rawTransmission = car?.gearbox || "";
  const safeTransmission = language === "en" ? translateVehicleValue(rawTransmission, "en") : getTransmissionLabel(rawTransmission);
  const rawCategory = car?.category || "";
  const safeCategory = translateVehicleValue(rawCategory, language) || getCategoryLabel(rawCategory) || "";
  const safeDescription = String(car?.description || "").trim();
  const descriptionNeedsToggle = safeDescription.length > 360 || safeDescription.split(/\r?\n/).length > 6;
  const safePriceType = language === "en"
    ? car?.priceType === "Sur demande" ? "Price on request" : car?.priceType === "Negociable" ? "Negotiable" : "Fixed price"
    : getPriceTypeLabel(car?.priceType || "Sur demande");
  const safeReference = car?.slug ? car.slug.toUpperCase() : "-";

  const copy = language === "ar"
    ? {
        inventory: "المعرض", verified: "إعلان موثّق وجاهز للمعاينة", highlights: "أبرز المعلومات",
        year: "سنة الصنع", mileage: "الكيلومترات", fuel: "نوع الوقود", transmission: "ناقل الحركة", engine: "سعة المحرك", regional: "المواصفات",
        category: "الفئة", location: "الموقع", overview: "نبذة عن المركبة",
        specifications: "المواصفات والمزايا", shipping: "الشحن والمتابعة",
        shippingText: "نرافقك في المعاينة، الوثائق، التصدير والمتابعة إلى حين الاستلام.",
        documents: "وثائق واضحة وفاتورة رسمية", confidence: "شراء بثقة",
        confidenceText: "معلومات واضحة وتواصل مباشر قبل تأكيد العملية.",
        directContact: "تواصل مباشر مع فريقنا",
        directContactText: "رد سريع لتأكيد السعر، التوفر، المعاينة وخيارات الشحن.",
        includedSupport: "الخدمات المتوفرة",
        availabilityCheck: "تأكيد توفر المركبة قبل الشراء",
        extraMedia: "صور وفيديو إضافي عند الطلب",
        exportHelp: "مساعدة في وثائق وإجراءات التصدير",
        shippingQuote: "عرض شحن مخصص إلى بلدك",
        whatsapp: safePrice ? "اسأل على واتساب" : "اطلب السعر على واتساب", call: "اتصل بنا",
        allIncluded: "السعر شامل كل شيء", reference: "المرجع", similar: "مركبات مشابهة",
        previousImage: "الصورة السابقة", nextImage: "الصورة التالية", openImage: "تكبير الصورة",
        closeImage: "إغلاق الصورة", seeFull: "عرض الوصف الكامل", showLess: "عرض أقل"
      }
    : {
        inventory: "Inventory", verified: "Verified and ready for inspection", highlights: "Highlights",
        year: "Model year", mileage: "Kilométrage", fuel: "Fuel type", transmission: "Transmission", engine: "Engine capacity", regional: "Specs",
        category: "Category", location: "Location", overview: "Vehicle overview",
        specifications: "Specs & features", shipping: "Shipping and follow-up",
        shippingText: "We assist with inspection, documents, export, and follow-up until delivery.",
        documents: "Clear documents and official invoice", confidence: "Buy with confidence",
        confidenceText: "Clear information and direct contact before confirming the purchase.",
        directContact: "Direct contact with our team",
        directContactText: "Fast answers about price, availability, inspection, and shipping options.",
        includedSupport: "Support available",
        availabilityCheck: "Vehicle availability confirmation",
        extraMedia: "Extra photos and video on request",
        exportHelp: "Export document assistance",
        shippingQuote: "A shipping quote for your country",
        whatsapp: safePrice ? "Ask on WhatsApp" : "Ask for the price on WhatsApp", call: "Call us",
        allIncluded: "All costs included", reference: "Reference", similar: "Similar vehicles",
        previousImage: "Previous image", nextImage: "Next image", openImage: "Enlarge image",
        closeImage: "Close image", seeFull: "See full description", showLess: "Show less"
      };

  const text = (en: string, ar: string) => language === "ar" ? ar : en;
  const publishedDate = car?.createdAt
    ? new Intl.DateTimeFormat(language === "ar" ? "ar-TN" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(car.createdAt))
    : "";
  const location = String(car?.location || "").trim();
  const coreFeatures = [
    { label: text("Make", "الماركة"), value: car?.brand },
    { label: text("Model", "الموديل"), value: car?.model },
    { label: text("Trim", "التجهيز"), value: car?.trim, optional: true },
    { label: text("Color", "اللون الخارجي"), value: translateVehicleValue(car?.exteriorColor, language) || car?.exteriorColor },
    { label: text("Interior color", "اللون الداخلي"), value: translateVehicleValue(car?.interiorColor, language) || car?.interiorColor, optional: true },
    { label: copy.engine, value: car?.engineCapacity != null ? `${Number(car.engineCapacity).toFixed(1)} L` : "" },
    { label: text("Cylinders", "الأسطوانات"), value: car?.cylinders != null ? `${car.cylinders} ${text("Cylinders", "أسطوانات")}` : "" },
    { label: text("Horsepower", "قوة المحرك"), value: car?.powerHp != null ? `${car.powerHp} HP` : "" },
    { label: copy.transmission, value: safeTransmission },
    { label: text("Drive type", "نظام الدفع"), value: translateVehicleValue(car?.drivetrain || car?.transmission, language) || car?.drivetrain || car?.transmission || "" },
    { label: text("Steering side", "جهة المقود"), value: translateVehicleValue(car?.steeringSide, language) || "" },
    { label: text("Vehicle type", "نوع الهيكل"), value: car?.bodyType ? translateVehicleValue(car.bodyType, language) : safeCategory },
    { label: text("Number of doors", "عدد الأبواب"), value: car?.doors != null ? `${car.doors} ${text("Doors", "أبواب")}` : "" },
    { label: text("Seating capacity", "عدد المقاعد"), value: car?.seats != null ? `${car.seats} ${text("seats", "مقاعد")}` : "" },
    { label: text("Wheel size", "حجم العجلات"), value: car?.wheelSize || "" },
    { label: copy.fuel, value: safeFuel },
    { label: text("Export status", "حالة التصدير"), value: translateVehicleValue(car?.exportStatus, language) || "" },
    { label: text("Service history", "سجل الصيانة"), value: translateVehicleValue(car?.serviceHistory, language) || "" },
    { label: text("Published on", "تاريخ النشر"), value: publishedDate }
  ].filter((feature) => hasDisplayValue(feature.value));
  const customFeatures = Array.isArray(car?.features) ? car.features.map((feature: any) => ({
    label: language === "en" ? feature?.label : localizeFeatureLabel(feature?.label),
    value: language === "en" ? translateVehicleValue(feature?.value, language) || feature?.value : localizeFeatureValue(feature?.value)
  })).filter((feature: any) => feature.label && hasDisplayValue(feature.value) && !coreFeatures.some((item) => item.label.toLowerCase() === feature.label.toLowerCase())) : [];
  const detailFeatures = [...coreFeatures, ...customFeatures];

  const highlights = [
    { label: copy.location, value: location, icon: MapPin },
    { label: copy.year, value: safeYear, icon: CalendarDays },
    { label: copy.mileage, value: safeMileage, icon: Gauge },
    { label: text("Body type", "نوع الهيكل"), value: car?.bodyType ? translateVehicleValue(car.bodyType, language) : safeCategory, icon: Truck },
    { label: copy.transmission, value: safeTransmission, icon: Settings2 },
    { label: copy.fuel, value: safeFuel, icon: Settings2 },
    { label: copy.engine, value: car?.engineCapacity != null ? `${Number(car.engineCapacity).toFixed(1)} L` : "", icon: Settings2 },
    { label: copy.regional, value: car?.regionalSpecs || "", icon: Globe2 },
    { label: text("Make", "الماركة"), value: car?.brand, icon: BadgeCheck },
    { label: text("Model", "الموديل"), value: car?.model, icon: BadgeCheck }
  ].filter((item) => hasDisplayValue(item.value)).slice(0, 5);

  const sidebarSupport = [
    { text: copy.availabilityCheck, icon: CheckCircle2, color: "text-emerald-500" },
    { text: copy.extraMedia, icon: BadgeCheck, color: "text-sky-500" },
    { text: copy.exportHelp, icon: FileText, color: "text-brand" },
    { text: copy.shippingQuote, icon: Truck, color: "text-amber-500" }
  ];

  const showPreviousImage = () => images.length && setActive((current) => (current - 1 + images.length) % images.length);
  const showNextImage = () => images.length && setActive((current) => (current + 1) % images.length);
  const handleTouchStart = (event: React.TouchEvent) => setTouchStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart || !images.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    setTouchStart(null);
    if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
    dx < 0 ? showNextImage() : showPreviousImage();
  };

  return (
    <>
      <div className="container-premium max-w-[1240px] pb-28 pt-4 sm:pt-5 xl:pb-14">
        <nav className="flex min-w-0 items-center gap-2 overflow-hidden text-xs font-medium text-zinc-500 sm:text-sm">
          <Link href="/catalogue" className="transition hover:text-brand">{copy.inventory}</Link>
          <ChevronRight className="h-4 w-4" /><span>{car?.brand || "Brand"}</span>
          <ChevronRight className="h-4 w-4 shrink-0" /><span className="min-w-0 truncate text-zinc-950">{car?.name || "Vehicle"}</span>
        </nav>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <BadgeCheck className="h-4 w-4" />{copy.verified}
              </span>
              {car?.badges?.map((badge: string) => (
                <span key={badge} className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">{translateVehicleValue(getBadgeLabel(badge), language)}</span>
              ))}
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl lg:text-4xl">{car?.name || "Vehicle"}</h1>
            <p className="mt-1 text-sm text-zinc-500">{car?.brand} {car?.model ? `• ${car.model}` : ""} {safeYear !== "-" ? `• ${safeYear}` : ""}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => toggleFavorite(car._id)} className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 text-xs font-semibold shadow-sm transition hover:border-brand/40">
              <Heart className={`h-4 w-4 ${favorites.includes(car._id) ? "fill-current text-brand" : ""}`} />{language === "ar" ? "حفظ" : "Save"}
            </button>
            <button type="button" onClick={handleShare} className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 text-xs font-semibold shadow-sm transition hover:border-brand/40">
              <Share2 className="h-4 w-4" />{copied ? (language === "ar" ? "تم النسخ" : "Copied") : (language === "ar" ? "مشاركة" : "Share")}
            </button>
          </div>
        </div>

        <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,.08)]">
            <div className="relative aspect-[4/3] touch-pan-y overflow-hidden bg-zinc-100 sm:aspect-video" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <AnimatePresence initial={false} mode="sync">
                <motion.button
                  key={activeImage}
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  initial={{ opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  aria-label={copy.openImage}
                >
                  <Image src={activeImage} alt={car?.name || "Vehicle"} fill priority unoptimized className="object-cover object-center" sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 3rem), 884px" />
                </motion.button>
              </AnimatePresence>
              {images.length > 1 ? <>
                <button type="button" onClick={showPreviousImage} aria-label={copy.previousImage} className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-zinc-900 shadow-lg backdrop-blur transition hover:scale-105 sm:left-3 sm:h-10 sm:w-10"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={showNextImage} aria-label={copy.nextImage} className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-zinc-900 shadow-lg backdrop-blur transition hover:scale-105 sm:right-3 sm:h-10 sm:w-10"><ChevronRight className="h-5 w-5" /></button>
              </> : null}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950/85 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {Math.min(active + 1, Math.max(images.length, 1))} / {Math.max(images.length, 1)}
              </span>
            </div>
            {images.length ? <div className="border-t border-zinc-200 p-2.5 sm:p-3"><div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image: any, index: number) => {
                const imageSrc = resolveMediaUrl(image?.url);
                if (!imageSrc) return null;
                return <button key={(image?.url || "image") + index} type="button" onClick={() => setActive(index)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-zinc-100 transition duration-300 hover:-translate-y-0.5 hover:border-brand/50 sm:h-16 sm:w-24 ${active === index ? "border-brand shadow-sm" : "border-transparent"}`}>
                  <Image src={imageSrc} alt={image.alt || `${car?.name} ${index + 1}`} fill loading="lazy" unoptimized className="object-cover" sizes="(max-width: 639px) 80px, 96px" />
                </button>;
              })}
            </div></div> : null}
          </section>

          <aside className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,.1)]">
              <div className="border-b border-zinc-100 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />{availability}</span>
                  <span className="text-xs font-semibold text-zinc-400">{safePriceType}</span>
                </div>
                <div className="mt-3">
                  <p className="price-attention text-2xl font-black tracking-tight text-brand sm:text-3xl">{safePrice ? currency(safePrice) : language === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
                  {safePrice ? <p className="mt-1 text-base font-bold text-zinc-700">≈ {currencyTnd(safePrice, aedToTndRate)}</p> : null}
                  {safePrice ? <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{copy.allIncluded}</span> : null}
                </div>
                <div className="mt-3 flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-2.5 text-xs text-zinc-500"><span className="shrink-0">{copy.reference}</span><strong className="min-w-0 truncate text-zinc-800" title={safeReference}>{safeReference}</strong></div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-base font-bold text-zinc-950">{copy.directContact}</h2>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"><MessageCircle className="h-5 w-5" />{copy.whatsapp}</a>
                  <a href={`tel:+${COMPANY_WHATSAPP_PHONE}`} aria-label={copy.call} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-800 transition hover:border-brand hover:text-brand"><Phone className="h-4 w-4" /></a>
                </div>
                <div className="mt-5 border-t border-zinc-100 pt-4">
                  <p className="text-xs font-extrabold uppercase tracking-[.16em] text-zinc-400">{copy.includedSupport}</p>
                  <div className="mt-3 grid gap-2.5">
                    {sidebarSupport.map((item) => { const Icon = item.icon; return <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-3.5 py-3 text-xs font-semibold leading-5 text-zinc-700"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white shadow-sm"><Icon className={`h-4 w-4 ${item.color}`} /></span><span>{item.text}</span></div>; })}
                  </div>
                </div>
                <div className="mt-auto border-t border-zinc-100 pt-4 text-xs leading-5 text-zinc-500">
                  {copy.directContactText}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {highlights.length ? <section className="mt-4 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-zinc-950 sm:text-xl">{copy.highlights}</h2><span className="hidden text-[11px] font-semibold uppercase tracking-[0.25em] text-brand sm:block">ALHADUNICARS</span></div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-5">
            {highlights.map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center"><Icon className="mx-auto h-5 w-5 text-zinc-700" /><p className="mt-3 text-xs font-semibold text-zinc-500">{item.label}</p><p className="mt-1 truncate text-sm font-bold text-zinc-900" title={String(item.value)}>{item.value}</p></div>; })}
          </div>
        </section> : null}

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.7fr)]">
          <div className="space-y-6">
            {safeDescription ? <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-zinc-950">{copy.overview}</h2><div className={`relative mt-4 max-w-3xl ${descriptionNeedsToggle && !descriptionExpanded ? "max-h-44 overflow-hidden" : ""}`}><p className="whitespace-pre-line text-base leading-8 text-zinc-600">{safeDescription}</p>{descriptionNeedsToggle && !descriptionExpanded ? <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" /> : null}</div>{descriptionNeedsToggle ? <button type="button" onClick={() => setDescriptionExpanded((current) => !current)} className="mt-4 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold text-brand">{descriptionExpanded ? copy.showLess : copy.seeFull}</button> : null}</section> : null}
            {detailFeatures.length ? <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-zinc-950">{copy.specifications}</h2>
              <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">{detailFeatures.map((feature: any, index: number) => <div key={feature.label || index} className="flex min-w-0 items-center justify-between gap-4 border-b border-zinc-100 py-4"><dt className="text-sm text-zinc-500">{feature.label}</dt><dd className="min-w-0 break-words text-right text-sm font-bold text-zinc-900">{feature.value || "-"}</dd></div>)}</dl>
            </section> : null}
            {Array.isArray(car?.safety) && car.safety.length ? <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-zinc-950">{text("Safety", "السلامة")}</h2><div className="mt-5 flex flex-wrap gap-2">{car.safety.map((item: string) => <span key={item} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" />{item}</span>)}</div></section> : null}
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] bg-zinc-950 p-6 text-white shadow-xl sm:p-7">
              <Truck className="h-7 w-7 text-brand-gold" /><h2 className="mt-5 text-2xl font-extrabold">{copy.shipping}</h2><p className="mt-3 text-sm leading-7 text-zinc-300">{copy.shippingText}</p>
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm text-zinc-200"><p className="flex items-center gap-2"><FileText className="h-4 w-4 text-brand-gold" />{copy.documents}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-gold" />{language === "ar" ? COMPANY_LOCATION : "Dubai, United Arab Emirates"}</p></div>
              <a href={buildWhatsAppUrl(language === "ar" ? `مرحبًا، أريد معرفة المزيد عن شحن ${car?.name || "هذه المركبة"}.` : `Hello, I would like to know more about shipping the ${car?.name || "vehicle"}.`)} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-bold text-zinc-950 transition hover:bg-zinc-100"><MessageCircle className="h-4 w-4" />{language === "ar" ? "اسأل عن الشحن" : "Ask about shipping"}</a>
            </section>
            <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7"><BadgeCheck className="h-7 w-7 text-brand" /><h2 className="mt-4 text-xl font-extrabold text-zinc-950">{copy.confidence}</h2><p className="mt-2 text-sm leading-7 text-zinc-500">{copy.confidenceText}</p><div className="mt-5 space-y-3 text-sm font-semibold text-zinc-700"><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{copy.verified}</p><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{copy.documents}</p></div></section>
          </div>
        </div>

        {similar?.length > 0 ? <section className="mt-14 border-t border-zinc-200 pt-10">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">ALHADUNICARS</p><h2 className="mt-2 text-3xl font-extrabold text-zinc-950 sm:text-4xl">{copy.similar}</h2></div><Link href="/catalogue" className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold sm:inline-flex">{copy.inventory}</Link></div>
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{similar.map((item: any) => <CarCard key={item._id} car={item} />)}</div>
        </section> : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-zinc-200 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_35px_rgba(15,23,42,.14)] backdrop-blur-xl xl:hidden dark:border-white/10 dark:bg-zinc-950/95">
        <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
          <div className="min-w-0">
            <p className="price-attention max-w-full truncate text-sm font-black text-brand">{safePrice ? currency(safePrice) : language === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
            {safePrice ? <p className="truncate text-[11px] font-bold text-zinc-500">≈ {currencyTnd(safePrice, aedToTndRate)}</p> : null}
          </div>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20"><MessageCircle className="h-5 w-5" /><span className="hidden min-[360px]:inline">WhatsApp</span></a>
          <a href={`tel:+${COMPANY_WHATSAPP_PHONE}`} aria-label={copy.call} className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-white text-zinc-800 dark:border-white/10 dark:bg-zinc-900 dark:text-white"><Phone className="h-5 w-5" /></a>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen ? <motion.div className="fixed inset-0 z-[100] flex touch-pan-y items-center justify-center bg-black/95 p-4 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxOpen(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <button type="button" onClick={() => setLightboxOpen(false)} aria-label={copy.closeImage} className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"><X className="h-5 w-5" /></button>
          {images.length > 1 ? <>
            <button type="button" onClick={(event) => { event.stopPropagation(); showPreviousImage(); }} aria-label={copy.previousImage} className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:grid md:left-8"><ChevronLeft className="h-6 w-6" /></button>
            <button type="button" onClick={(event) => { event.stopPropagation(); showNextImage(); }} aria-label={copy.nextImage} className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:grid md:right-8"><ChevronRight className="h-6 w-6" /></button>
          </> : null}
          <motion.div className="relative h-full w-full max-w-7xl" initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(event) => event.stopPropagation()}><Image src={activeImage} alt={car?.name || "Vehicle"} fill unoptimized className="object-contain" sizes="100vw" /></motion.div>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{Math.min(active + 1, Math.max(images.length, 1))} / {Math.max(images.length, 1)}</span>
        </motion.div> : null}
      </AnimatePresence>
    </>
  );
}
