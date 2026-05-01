"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Share2,
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  ShieldCheck,
  Truck
} from "lucide-react";
import { api } from "@/lib/api";
import { useGarageStore } from "@/store/favorites";
import { buildWhatsAppLink, currency, resolveMediaUrl } from "@/lib/utils";
import {
  buildWhatsAppUrl,
  getBadgeLabel,
  getCategoryLabel,
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

const tabs = ["نبذة", "المواصفات", "التجهيزات", "الشحن"];

export default function CarDetailsPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const { favorites, toggleFavorite } = useGarageStore();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [watchers, setWatchers] = useState(0);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("نبذة");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let socket: ReturnType<typeof io> | undefined;

    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${slug}`);
        const payload = response.data;

        setData(payload);
        setError("");
        setWatchers(payload?.car?.liveWatchers || 0);

        if (payload?.car?._id && process.env.NEXT_PUBLIC_SOCKET_URL) {
          socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
          socket.emit("join_car_room", payload.car._id);

          socket.on("car_watchers", (watchersPayload: any) => {
            if (watchersPayload.carId === payload.car._id) {
              setWatchers(watchersPayload.watchers);
            }
          });
        }
      } catch (requestError: any) {
        console.error("خطأ أثناء تحميل المركبة :", requestError);
        setData(null);
        setWatchers(0);
        setError(
          requestError?.response?.data?.message ||
            "هذه الصفحة غير متاحة مؤقتًا. حاول مرة أخرى بعد قليل."
        );
      }
    };

    fetchCar();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [slug]);

  useEffect(() => {
    setActive(0);
  }, [data?.car?._id]);

  const whatsappHref = useMemo(() => {
    if (!data?.car) return "#";

    return buildWhatsAppLink({
      name: data.car.name || "مركبة",
      slug: data.car.slug || "",
      price: data.car.price || 0,
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
        <div className="mx-auto max-w-3xl rounded-[28px] border border-amber-300/60 bg-white p-8 shadow-premium dark:border-amber-500/20 dark:bg-zinc-900">
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">تفاصيل المركبة</p>
          <h1 className="mt-3 font-serif text-4xl font-bold">التفاصيل غير متاحة مؤقتًا</h1>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">{error}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
            >
              العودة إلى المعرض
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="container-premium py-20">جارٍ التحميل...</div>;
  }

  const { car, similar } = data;
  const images = Array.isArray(car?.images) ? car.images : [];
  const activeImage = resolveMediaUrl(images[active]?.url) || "/guide-import.svg";
  const availability = getStatusLabel(car?.availability || car?.status || "Disponible");
  const safePrice = car?.price || null;
  const safeYear = car?.year || "-";
  const safeMileage =
    typeof car?.mileage === "number" ? `${car.mileage.toLocaleString("ar-TN")} km` : "-";
  const safeFuel = getFuelTypeLabel(car?.fuelType || car?.fuel || "Autre");
  const safeTransmission = getTransmissionLabel(car?.transmission || car?.gearbox || "-");
  const safeViews = car?.views || 0;
  const safeDescription = localizeDescription(car?.description, car?.name);
  const safePriceType = getPriceTypeLabel(car?.priceType || "Sur demande");
  const safeReference = car?.slug ? car.slug.toUpperCase() : "-";
  const detailFeatures = car?.features?.length
    ? car.features.map((feature: any) => ({
        label: localizeFeatureLabel(feature?.label),
        value: localizeFeatureValue(feature?.value)
      }))
    : [
        { label: "السنة", value: safeYear },
        { label: "الكيلومترات", value: safeMileage },
        { label: "الوقود", value: safeFuel },
        { label: "علبة السرعة", value: safeTransmission },
        { label: "الفئة", value: getCategoryLabel(car?.category || "-") || "-" },
        { label: "الحالة", value: availability }
      ];
  const detailEquipment = car?.equipment?.length
    ? car.equipment.map((item: string) => localizeEquipmentLabel(item))
    : ["معاينة بصرية", "وثائق مؤكدة", "صور مفصلة", "إمكانية الشحن والمتابعة"];

  return (
    <div className="container-premium section-spacing pb-24 md:pb-12">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span>المعرض</span>
        <ChevronRight className="h-4 w-4" />
        <span>{car?.brand || "الماركة"}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-900 dark:text-white">
          {car?.name || "مركبة"}
        </span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[260px] w-full overflow-hidden rounded-[28px] bg-zinc-100 sm:h-[420px] lg:h-[520px] dark:bg-zinc-800"
          >
            <Image
              src={activeImage}
              alt={car?.name || "مركبة"}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 66vw"
            />

          </motion.div>

          {images.length > 0 && (
            <div className="mt-4 max-w-full overflow-x-auto pb-2">
              <div className="flex min-w-full gap-3">
                {images.map((image: any, index: number) => {
                const imageSrc = resolveMediaUrl(image?.url);

                if (!imageSrc) {
                  return null;
                }

                return (
                  <button
                    key={(image?.url || "img") + index}
                    type="button"
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border sm:h-24 sm:w-32 ${
                      active === index
                        ? "ring-2 ring-brand"
                        : "border-zinc-200 dark:border-white/10"
                    }`}
                    onClick={() => setActive(index)}
                  >
                    <Image
                      src={imageSrc}
                      alt={image.alt || `${car?.name || "مركبة"}-${index}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-[28px] border bg-white p-4 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-6">
            <div className="flex flex-wrap gap-2 border-b pb-4 dark:border-white/10">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab === item
                      ? "bg-brand text-white"
                      : "bg-zinc-100 dark:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {tab === "نبذة" && (
              <div className="pt-6">
                <h2 className="text-2xl font-bold">نبذة</h2>
                <p className="mt-4 leading-7 text-zinc-500 dark:text-zinc-400">
                  {safeDescription}
                </p>
              </div>
            )}

            {tab === "المواصفات" && (
              <div className="grid gap-4 pt-6 md:grid-cols-2">
                {detailFeatures.map((feature: any, index: number) => (
                  <div
                    key={feature.label || index}
                    className="rounded-2xl border p-4 dark:border-white/10"
                  >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {feature.label}
                    </p>
                    <p className="font-semibold">
                      {feature.value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "التجهيزات" && (
              <div className="grid gap-3 pt-6 md:grid-cols-2">
                {detailEquipment.map((item: string, index: number) => (
                    <div
                      key={item + index}
                      className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            )}

            {tab === "الشحن" && (
              <div className="grid gap-4 pt-6 md:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-800">
                  <Truck className="h-6 w-6 text-brand" />
                  <h3 className="mt-3 text-lg font-bold">التحضير قبل الشحن</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    نرافقك في التثبت من التوفر، الجاهزية اللوجستية والتأكيدات اللازمة قبل الإرسال.
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-800">
                  <FileText className="h-6 w-6 text-brand" />
                  <h3 className="mt-3 text-lg font-bold">الوثائق والمتابعة</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    الفاتورة، وثائق التصدير وتتبع الملف إلى حين الاستلام يتم توضيحهم مباشرة مع الفريق.
                  </p>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    `مرحبًا، أريد معرفة المزيد عن شحن ${car?.name || "هذه المركبة"}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 md:col-span-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  اسأل عن الشحن
                </a>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[28px] border bg-white p-5 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {car?.badges?.map((badge: string) => (
                <span
                  key={badge}
                  className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white"
                >
                  {getBadgeLabel(badge)}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              {car?.name || "مركبة"}
            </h1>

            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              {safeYear} - {safeFuel} - {safeTransmission} - {safeMileage}
            </p>

            <p className="mt-5 text-3xl font-extrabold text-brand sm:text-4xl">
              {safePrice ? currency(safePrice) : "السعر غير متوفر"}
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {safePriceType} - المرجع: {safeReference}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  السنة
                </p>
                <p className="mt-2 font-semibold">{safeYear}</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  الكيلومترات
                </p>
                <p className="mt-2 font-semibold">{safeMileage}</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  الفئة
                </p>
                <p className="mt-2 font-semibold">{getCategoryLabel(car?.category || "-") || "-"}</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  الحالة
                </p>
                <p className="mt-2 font-semibold">{availability}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {safeViews} مشاهدة
              </span>
              <span>
                {watchers} شخص يشاهد هذه الصفحة الآن
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => toggleFavorite(car._id)}
                className="rounded-2xl border p-3 dark:border-white/10"
              >
                <Heart
                  className={`mx-auto h-5 w-5 ${
                    favorites.includes(car._id)
                      ? "fill-current text-brand"
                      : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="rounded-2xl border p-3 dark:border-white/10"
              >
                <Share2 className="mx-auto h-5 w-5" />
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-green-500/30 bg-green-500/10 p-3 text-green-700 dark:text-green-300"
              >
                <MessageCircle className="mx-auto h-5 w-5" />
              </a>
            </div>

            {copied && (
              <p className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">
                تم نسخ الرابط
              </p>
            )}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              اسأل على واتساب
            </a>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-brand" />
                شراء آمن
              </div>
              فاتورة رسمية، توثيق واضح وتواصل مباشر قبل تأكيد العملية.
            </div>

            <form
              className="mt-6 grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();

                const form = new FormData(e.currentTarget as HTMLFormElement);

                try {
                  await api.post("/inquiries", {
                    car: car._id,
                    name: form.get("name"),
                    email: form.get("email"),
                    phone: form.get("phone"),
                    message: form.get("message")
                  });

                  alert("تم إرسال الطلب");
                  (e.currentTarget as HTMLFormElement).reset();
                } catch (requestError: any) {
                  console.error("خطأ أثناء إرسال الطلب :", requestError);
                  alert(
                    requestError?.response?.data?.message ||
                      "تعذر إرسال طلبك في الوقت الحالي."
                  );
                }
              }}
            >
              <h3 className="text-xl font-bold">اطلب معلومات إضافية</h3>

              <input
                name="name"
                placeholder="الاسم"
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                required
              />

              <input
                name="email"
                placeholder="البريد الإلكتروني"
                type="email"
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                required
              />

              <input
                name="phone"
                placeholder="رقم الهاتف"
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                required
              />

              <textarea
                name="message"
                placeholder="اكتب رسالتك"
                defaultValue={`مرحبًا، أريد معلومات أكثر عن ${car?.name || "هذه المركبة"}.`}
                className="rounded-2xl border bg-transparent px-4 py-3 dark:border-white/10"
                rows={4}
              />

              <button className="rounded-2xl bg-brand px-5 py-4 font-semibold text-white">
                إرسال
              </button>
            </form>
          </div>
        </aside>
      </div>

      {similar?.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            مركبات مشابهة
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similar.map((item: any) => (
              <CarCard key={item._id} car={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
