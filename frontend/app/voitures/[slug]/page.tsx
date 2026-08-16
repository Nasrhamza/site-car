"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Fuel,
  Gauge,
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
import { api } from "@/lib/api";
import { useGarageStore } from "@/store/favorites";
import { buildWhatsAppLink, currency, currencyTnd, resolveMediaUrl } from "@/lib/utils";
import {
  buildWhatsAppUrl,
  COMPANY_LOCATION,
  COMPANY_WHATSAPP_PHONE,
  getBadgeLabel,
  getCategoryLabel,
  getFuelTypeImage,
  getFuelTypeLabel,
  getPriceTypeLabel,
  getStatusLabel,
  getTransmissionLabel,
  localizeDescription,
  localizeEquipmentLabel,
  localizeFeatureLabel,
  localizeFeatureValue
} from "@/lib/company";
import { CarCard } from "@/components/car-card";
import { useAedToTndRate } from "@/hooks/use-exchange-rate";
import { translateVehicleValue, useLanguage } from "@/lib/site-language";

export default function CarDetailsPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const { favorites, toggleFavorite } = useGarageStore();
  const { rate: aedToTndRate } = useAedToTndRate();
  const { language } = useLanguage();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    api
      .get(`/cars/${slug}`)
      .then(({ data: payload }) => {
        setData(payload);
        setError("");
      })
      .catch((requestError: any) => {
        console.error("خطأ أثناء تحميل المركبة :", requestError);
        setData(null);
        setError(
          requestError?.response?.data?.message ||
            "هذه الصفحة غير متاحة مؤقتًا. حاول مرة أخرى بعد قليل."
        );
      });
  }, [slug]);

  useEffect(() => setActive(0), [data?.car?._id]);

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
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (shareError) {
      console.error("خطأ نسخ الرابط :", shareError);
    }
  };

  if (error && !data) {
    return (
      <div className="container-premium section-spacing">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-amber-300/60 bg-white p-8 shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Vehicle details</p>
          <h1 className="mt-3 font-serif text-4xl font-bold">Details are temporarily unavailable</h1>
          <p className="mt-4 text-zinc-500">{error}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalogue" className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">Back to inventory</Link>
            <button type="button" onClick={() => window.location.reload()} className="rounded-2xl border px-5 py-3 text-sm font-semibold">Try again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="container-premium py-20">Loading...</div>;

  const { car, similar } = data;
  const images = Array.isArray(car?.images) ? car.images : [];
  const activeImage = resolveMediaUrl(images[active]?.url) || "/guide-import.svg";
  const rawAvailability = car?.availability || car?.status || "Disponible";
  const availability = translateVehicleValue(rawAvailability, language) || getStatusLabel(rawAvailability);
  const safePrice = car?.price || null;
  const safeYear = car?.year || "-";
  const safeMileage = typeof car?.mileage === "number" ? `${car.mileage.toLocaleString("fr-FR")} km` : "-";
  const rawFuel = car?.fuelType || car?.fuel || "Autre";
  const safeFuel = translateVehicleValue(rawFuel, language) || getFuelTypeLabel(rawFuel);
  const fuelTypeImage = getFuelTypeImage(rawFuel);
  const rawTransmission = car?.gearbox || car?.transmission || "-";
  const safeTransmission = language === "en" ? rawTransmission : getTransmissionLabel(rawTransmission);
  const rawCategory = car?.category || "-";
  const safeCategory = translateVehicleValue(rawCategory, language) || getCategoryLabel(rawCategory) || "-";
  const safeDescription = localizeDescription(car?.description, car?.name);
  const safePriceType = language === "en"
    ? car?.priceType === "Sur demande" ? "Price on request" : car?.priceType || "Fixed price"
    : getPriceTypeLabel(car?.priceType || "Sur demande");
  const safeReference = car?.slug ? car.slug.toUpperCase() : "-";

  const copy = language === "ar"
    ? {
        inventory: "المعرض", verified: "إعلان موثّق وجاهز للمعاينة", highlights: "أبرز المعلومات",
        year: "السنة", mileage: "الكيلومترات", fuel: "الوقود", transmission: "علبة السرعة",
        category: "الفئة", location: "الموقع", overview: "نبذة عن المركبة",
        specifications: "المواصفات التفصيلية", equipment: "التجهيزات", shipping: "الشحن والمتابعة",
        shippingText: "نرافقك في المعاينة، الوثائق، التصدير والمتابعة إلى حين الاستلام.",
        documents: "وثائق واضحة وفاتورة رسمية", confidence: "شراء بثقة",
        confidenceText: "معلومات واضحة وتواصل مباشر قبل تأكيد العملية.",
        directContact: "تواصل مباشر مع فريقنا",
        directContactText: "رد سريع لتأكيد السعر، التوفر، المعاينة وخيارات الشحن.",
        whatsapp: safePrice ? "اسأل على واتساب" : "اطلب السعر على واتساب", call: "اتصل بنا",
        allIncluded: "السعر شامل كل شيء", reference: "المرجع", similar: "مركبات مشابهة",
        previousImage: "الصورة السابقة", nextImage: "الصورة التالية", openImage: "تكبير الصورة",
        closeImage: "إغلاق الصورة"
      }
    : {
        inventory: "Inventory", verified: "Verified and ready for inspection", highlights: "Highlights",
        year: "Model year", mileage: "Mileage", fuel: "Fuel", transmission: "Transmission",
        category: "Category", location: "Location", overview: "Vehicle overview",
        specifications: "Detailed specifications", equipment: "Equipment", shipping: "Shipping and follow-up",
        shippingText: "We assist with inspection, documents, export, and follow-up until delivery.",
        documents: "Clear documents and official invoice", confidence: "Buy with confidence",
        confidenceText: "Clear information and direct contact before confirming the purchase.",
        directContact: "Direct contact with our team",
        directContactText: "Fast answers about price, availability, inspection, and shipping options.",
        whatsapp: safePrice ? "Ask on WhatsApp" : "Ask for the price on WhatsApp", call: "Call us",
        allIncluded: "All costs included", reference: "Reference", similar: "Similar vehicles",
        previousImage: "Previous image", nextImage: "Next image", openImage: "Enlarge image",
        closeImage: "Close image"
      };

  const detailFeatures = car?.features?.length
    ? car.features.map((feature: any) => ({
        label: language === "en" ? feature?.label : localizeFeatureLabel(feature?.label),
        value: language === "en" ? translateVehicleValue(feature?.value, language) || feature?.value : localizeFeatureValue(feature?.value)
      }))
    : [
        { label: copy.year, value: safeYear }, { label: copy.mileage, value: safeMileage },
        { label: copy.fuel, value: safeFuel }, { label: copy.transmission, value: safeTransmission },
        { label: copy.category, value: safeCategory },
        { label: language === "ar" ? "الحالة" : "Status", value: availability }
      ];

  const detailEquipment = car?.equipment?.length
    ? car.equipment.map((item: string) => language === "en" ? item : localizeEquipmentLabel(item))
    : language === "ar"
      ? ["معاينة بصرية", "وثائق مؤكدة", "صور مفصلة", "إمكانية الشحن والمتابعة"]
      : ["Visual inspection", "Verified documents", "Detailed photos", "Shipping and follow-up"];

  const highlights = [
    { label: copy.year, value: safeYear, icon: CalendarDays, image: null },
    { label: copy.mileage, value: safeMileage, icon: Gauge, image: null },
    { label: copy.fuel, value: safeFuel, icon: Fuel, image: fuelTypeImage },
    { label: copy.transmission, value: safeTransmission, icon: Settings2, image: null },
    { label: copy.category, value: safeCategory, icon: CarFront, image: null },
    { label: copy.location, value: language === "ar" ? COMPANY_LOCATION : "Dubai, United Arab Emirates", icon: MapPin, image: null }
  ];

  const showPreviousImage = () => images.length && setActive((current) => (current - 1 + images.length) % images.length);
  const showNextImage = () => images.length && setActive((current) => (current + 1) % images.length);

  return (
    <>
      <div className="container-premium max-w-[1240px] pb-14 pt-4 sm:pt-5">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 sm:text-sm">
          <Link href="/catalogue" className="transition hover:text-brand">{copy.inventory}</Link>
          <ChevronRight className="h-4 w-4" /><span>{car?.brand || "Brand"}</span>
          <ChevronRight className="h-4 w-4" /><span className="text-zinc-950">{car?.name || "Vehicle"}</span>
        </nav>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <BadgeCheck className="h-4 w-4" />{copy.verified}
              </span>
              {car?.badges?.map((badge: string) => (
                <span key={badge} className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">{getBadgeLabel(badge)}</span>
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
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 sm:aspect-video">
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
                  <Image src={activeImage} alt={car?.name || "Vehicle"} fill priority className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 900px" />
                </motion.button>
              </AnimatePresence>
              {images.length > 1 ? <>
                <button type="button" onClick={showPreviousImage} aria-label={copy.previousImage} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-zinc-900 shadow-lg backdrop-blur transition hover:scale-105"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={showNextImage} aria-label={copy.nextImage} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-zinc-900 shadow-lg backdrop-blur transition hover:scale-105"><ChevronRight className="h-5 w-5" /></button>
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
                  <Image src={imageSrc} alt={image.alt || `${car?.name} ${index + 1}`} fill className="object-cover" sizes="112px" />
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
                  <p className="text-2xl font-black tracking-tight text-brand sm:text-3xl">{safePrice ? currency(safePrice) : language === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
                  {safePrice ? <p className="mt-1 text-base font-bold text-zinc-700">≈ {currencyTnd(safePrice, aedToTndRate)}</p> : null}
                  {safePrice ? <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{copy.allIncluded}</span> : null}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-2.5 text-xs text-zinc-500"><span>{copy.reference}</span><strong className="text-zinc-800">{safeReference}</strong></div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {highlights.slice(0, 4).map((item) => {
                    const Icon = item.icon;
                    return <div key={`summary-${item.label}`} className="min-w-0 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400">
                        {item.image ? (
                          <span className="relative h-7 w-10 shrink-0"><Image src={item.image} alt="" fill className="object-contain" sizes="40px" /></span>
                        ) : (
                          <Icon className="h-3.5 w-3.5 shrink-0 text-brand" />
                        )}
                        <span className="truncate">{item.label}</span>
                      </div>
                      <p className="mt-1 truncate text-xs font-bold text-zinc-800" title={String(item.value)}>{item.value}</p>
                    </div>;
                  })}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-base font-bold text-zinc-950">{copy.directContact}</h2>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"><MessageCircle className="h-5 w-5" />{copy.whatsapp}</a>
                  <a href={`tel:+${COMPANY_WHATSAPP_PHONE}`} aria-label={copy.call} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-800 transition hover:border-brand hover:text-brand"><Phone className="h-4 w-4" /></a>
                </div>
                <div className="mt-3 grid gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-600 xl:mt-auto">
                  <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" />{copy.documents}</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{copy.confidenceText}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-4 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-zinc-950 sm:text-xl">{copy.highlights}</h2><span className="hidden text-[11px] font-semibold uppercase tracking-[0.25em] text-brand sm:block">ALHADUNICARS</span></div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
            {highlights.map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-center">{item.image ? <span className="relative mx-auto block h-10 w-14"><Image src={item.image} alt="" fill className="object-contain" sizes="56px" /></span> : <Icon className="mx-auto h-4 w-4 text-brand" />}<p className="mt-2 text-[11px] font-semibold text-zinc-400">{item.label}</p><p className="mt-0.5 truncate text-sm font-bold text-zinc-900" title={String(item.value)}>{item.value}</p></div>; })}
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.7fr)]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold text-zinc-950">{copy.overview}</h2><p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-zinc-600">{safeDescription}</p></section>
            <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-zinc-950">{copy.specifications}</h2>
              <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">{detailFeatures.map((feature: any, index: number) => <div key={feature.label || index} className="flex items-center justify-between gap-4 border-b border-zinc-100 py-4"><dt className="text-sm text-zinc-500">{feature.label}</dt><dd className="text-sm font-bold text-zinc-900">{feature.value || "-"}</dd></div>)}</dl>
            </section>
            <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-zinc-950">{copy.equipment}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">{detailEquipment.map((item: string, index: number) => <div key={item + index} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 text-sm font-semibold text-zinc-800"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />{item}</div>)}</div>
            </section>
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

      <AnimatePresence>
        {lightboxOpen ? <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxOpen(false)}>
          <button type="button" onClick={() => setLightboxOpen(false)} aria-label={copy.closeImage} className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"><X className="h-5 w-5" /></button>
          {images.length > 1 ? <>
            <button type="button" onClick={(event) => { event.stopPropagation(); showPreviousImage(); }} aria-label={copy.previousImage} className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:left-8"><ChevronLeft className="h-6 w-6" /></button>
            <button type="button" onClick={(event) => { event.stopPropagation(); showNextImage(); }} aria-label={copy.nextImage} className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:right-8"><ChevronRight className="h-6 w-6" /></button>
          </> : null}
          <motion.div className="relative h-full w-full max-w-7xl" initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(event) => event.stopPropagation()}><Image src={activeImage} alt={car?.name || "Vehicle"} fill className="object-contain" sizes="100vw" /></motion.div>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{Math.min(active + 1, Math.max(images.length, 1))} / {Math.max(images.length, 1)}</span>
        </motion.div> : null}
      </AnimatePresence>
    </>
  );
}
