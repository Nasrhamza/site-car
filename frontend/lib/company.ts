export const COMPANY_NAME = "ALHADUNI CARS";
export const COMPANY_SHORT_NAME = "ALHADUNI";
export const COMPANY_SECONDARY_NAME = "ALHADUNI";
export const COMPANY_SUBTITLE = "الحادوني للسيارات";
export const COMPANY_DESCRIPTION =
  "منصة احترافية لبيع السيارات والمركبات التجارية مع المعاينة الميدانية، التوثيق، الشحن والمتابعة حتى الاستلام.";
export const COMPANY_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "971563543177";
export const COMPANY_WHATSAPP_DISPLAY = "\u2066+971 56 354 3177\u2069";
export const COMPANY_LOCATION = "دبي، الإمارات العربية المتحدة";

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/catalogue", label: "المعرض" },
  { href: "/guide", label: "الدليل" },
  { href: "/a-propos", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" }
];

export const VEHICLE_CATEGORIES = [
  "Tracteurs",
  "Semi-remorques",
  "Camions",
  "Utilitaires",
  "Engins TP",
  "Bus / Minibus",
  "Véhicules légers"
] as const;

export const DEFAULT_VEHICLE_CATEGORY = "Utilitaires";
export const FUEL_TYPE_OPTIONS = [
  "Diesel",
  "Essence",
  "Hybride",
  "PHEV",
  "Électrique",
  "GPL",
  "Autre"
] as const;
export const DEFAULT_FUEL_TYPE = "Autre";
export const PRODUCT_STATUS_OPTIONS = ["Disponible", "Reserve", "Vendu", "Masque"] as const;

export const CATEGORY_SLUGS: Record<string, (typeof VEHICLE_CATEGORIES)[number]> = {
  tracteurs: "Tracteurs",
  "semi-remorques": "Semi-remorques",
  camions: "Camions",
  utilitaires: "Utilitaires",
  "engins-tp": "Engins TP",
  "bus-minibus": "Bus / Minibus",
  "vehicules-legers": "Véhicules légers"
};

const CATEGORY_TO_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([slug, category]) => [category, slug])
) as Record<string, string>;

function normalizeLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildNormalizedMap(source: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(source).map(([key, label]) => [normalizeLookupKey(key), label])
  ) as Record<string, string>;
}

export function getCategorySlug(category: string) {
  return (
    CATEGORY_TO_SLUG[category] ||
    category
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export const CATEGORY_LABELS: Record<(typeof VEHICLE_CATEGORIES)[number], string> = {
  Tracteurs: "جرارات",
  "Semi-remorques": "شبه مقطورات",
  Camions: "شاحنات",
  Utilitaires: "مركبات نفعية",
  "Engins TP": "آليات أشغال",
  "Bus / Minibus": "حافلات / ميني باص",
  "Véhicules légers": "سيارات خفيفة"
};

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  "Citadines / Compactes": "سيارات خفيفة",
  "SUV & 4x4": "سيارات رباعية الدفع",
  "Berlines & Limousines": "سيارات سيدان",
  "Électriques & Hybrides": "سيارات كهربائية وهجينة",
  "Electriques & Hybrides": "سيارات كهربائية وهجينة",
  "Pick-up & Camions légers": "بيك أب / شاحنات خفيفة",
  "Pick-up & Camions legers": "بيك أب / شاحنات خفيفة",
  "Coupés & Cabriolets": "كوبيه / مكشوفة",
  "Utilitaires & Fourgons": "مركبات نفعية / فان",
  "Voitures de luxe & Sport": "سيارات فاخرة / رياضية",
  "Voitures récentes (moins de 2 ans)": "سيارات حديثة",
  "Voitures recentes (moins de 2 ans)": "سيارات حديثة"
};
const NORMALIZED_CATEGORY_LABELS = buildNormalizedMap(CATEGORY_LABELS);
const NORMALIZED_LEGACY_CATEGORY_LABELS = buildNormalizedMap(LEGACY_CATEGORY_LABELS);

export const FUEL_TYPE_LABELS: Record<(typeof FUEL_TYPE_OPTIONS)[number], string> = {
  Diesel: "ديزل",
  Essence: "بنزين",
  Hybride: "هجين",
  PHEV: "هجين قابل للشحن",
  Électrique: "كهربائي",
  GPL: "غاز",
  Autre: "أخرى"
};

export const STATUS_LABELS: Record<(typeof PRODUCT_STATUS_OPTIONS)[number], string> = {
  Disponible: "متوفر",
  Reserve: "محجوز",
  Vendu: "مباع",
  Masque: "مخفي"
};

const BADGE_LABELS: Record<string, string> = {
  Nouveau: "جديد",
  Promo: "عرض",
  Luxe: "فاخر",
  Occasion: "مستعمل",
  "Occasion certifiée": "مستعمل معتمد",
  "Occasion certifiee": "مستعمل معتمد",
  Électrique: "كهربائي",
  Electrique: "كهربائي",
  Hybride: "هجين",
  PHEV: "هجين قابل للشحن",
  Diesel: "ديزل",
  Essence: "بنزين"
};
const NORMALIZED_BADGE_LABELS = buildNormalizedMap(BADGE_LABELS);

const TRANSMISSION_LABELS: Record<string, string> = {
  Automatique: "أوتوماتيك",
  Manuelle: "يدوي",
  Automatic: "أوتوماتيك",
  Manual: "يدوي"
};
const NORMALIZED_TRANSMISSION_LABELS = buildNormalizedMap(TRANSMISSION_LABELS);

const PRICE_TYPE_LABELS: Record<string, string> = {
  "Prix fixe": "سعر ثابت",
  "Négociable": "قابل للتفاوض",
  Negociable: "قابل للتفاوض",
  "Sur demande": "السعر عند الطلب"
};
const NORMALIZED_PRICE_TYPE_LABELS = buildNormalizedMap(PRICE_TYPE_LABELS);

const FEATURE_LABELS: Record<string, string> = {
  Garantie: "الضمان",
  Origine: "المنشأ",
  Carnet: "السجل",
  Transmission: "ناقل الحركة",
  Carburant: "الوقود",
  Disponibilite: "التوفر",
  Disponibilité: "التوفر"
};
const NORMALIZED_FEATURE_LABELS = buildNormalizedMap(FEATURE_LABELS);

const FEATURE_VALUE_LABELS: Record<string, string> = {
  Disponible: "متوفر",
  "Import officiel": "استيراد رسمي",
  "12 mois": "12 شهرًا"
};
const NORMALIZED_FEATURE_VALUE_LABELS = buildNormalizedMap(FEATURE_VALUE_LABELS);

const EQUIPMENT_LABELS: Record<string, string> = {
  Climatisation: "تكييف",
  GPS: "نظام ملاحة",
  "Caméra de recul": "كاميرا خلفية",
  "Camera de recul": "كاميرا خلفية",
  "Radar avant/arrière": "حساسات أمامية / خلفية",
  "Radar avant / arrière": "حساسات أمامية / خلفية",
  Bluetooth: "بلوتوث",
  "Jantes alliage": "جنوط ألمنيوم"
};
const NORMALIZED_EQUIPMENT_LABELS = buildNormalizedMap(EQUIPMENT_LABELS);
const NORMALIZED_FUEL_TYPE_LABELS = buildNormalizedMap(FUEL_TYPE_LABELS);
const NORMALIZED_STATUS_LABELS = buildNormalizedMap(STATUS_LABELS);

export function getCategoryLabel(category?: string | null) {
  if (!category) return "";

  const normalized = normalizeLookupKey(category);

  return (
    CATEGORY_LABELS[category as (typeof VEHICLE_CATEGORIES)[number]] ||
    LEGACY_CATEGORY_LABELS[category] ||
    NORMALIZED_CATEGORY_LABELS[normalized] ||
    NORMALIZED_LEGACY_CATEGORY_LABELS[normalized] ||
    category
  );
}

export function getFuelTypeLabel(fuelType?: string | null) {
  if (!fuelType) return "";

  const normalized = normalizeLookupKey(fuelType);

  return (
    FUEL_TYPE_LABELS[fuelType as (typeof FUEL_TYPE_OPTIONS)[number]] ||
    NORMALIZED_FUEL_TYPE_LABELS[normalized] ||
    fuelType
  );
}

export function getStatusLabel(status?: string | null) {
  if (!status) return "";

  const normalized = normalizeLookupKey(status);

  return (
    STATUS_LABELS[status as (typeof PRODUCT_STATUS_OPTIONS)[number]] ||
    NORMALIZED_STATUS_LABELS[normalized] ||
    status
  );
}

export function getBadgeLabel(badge?: string | null) {
  if (!badge) return "";

  const normalized = normalizeLookupKey(badge);
  const statusLabel =
    STATUS_LABELS[badge as (typeof PRODUCT_STATUS_OPTIONS)[number]] ||
    NORMALIZED_STATUS_LABELS[normalized];
  const fuelLabel =
    FUEL_TYPE_LABELS[badge as (typeof FUEL_TYPE_OPTIONS)[number]] ||
    NORMALIZED_FUEL_TYPE_LABELS[normalized];

  return BADGE_LABELS[badge] || NORMALIZED_BADGE_LABELS[normalized] || statusLabel || fuelLabel || badge;
}

export function getTransmissionLabel(transmission?: string | null) {
  if (!transmission) return "";

  const normalized = normalizeLookupKey(transmission);

  return TRANSMISSION_LABELS[transmission] || NORMALIZED_TRANSMISSION_LABELS[normalized] || transmission;
}

export function getPriceTypeLabel(priceType?: string | null) {
  if (!priceType) return "";

  const normalized = normalizeLookupKey(priceType);

  return PRICE_TYPE_LABELS[priceType] || NORMALIZED_PRICE_TYPE_LABELS[normalized] || priceType;
}

export function localizeFeatureLabel(label?: string | null) {
  if (!label) return "";

  const normalized = normalizeLookupKey(label);

  return FEATURE_LABELS[label] || NORMALIZED_FEATURE_LABELS[normalized] || label;
}

export function localizeFeatureValue(value?: string | null) {
  if (!value) return "";

  const normalized = normalizeLookupKey(value);
  const statusLabel =
    STATUS_LABELS[value as (typeof PRODUCT_STATUS_OPTIONS)[number]] ||
    NORMALIZED_STATUS_LABELS[normalized];

  return (
    FEATURE_VALUE_LABELS[value] ||
    NORMALIZED_FEATURE_VALUE_LABELS[normalized] ||
    TRANSMISSION_LABELS[value] ||
    NORMALIZED_TRANSMISSION_LABELS[normalized] ||
    FUEL_TYPE_LABELS[value as (typeof FUEL_TYPE_OPTIONS)[number]] ||
    NORMALIZED_FUEL_TYPE_LABELS[normalized] ||
    statusLabel ||
    value
  );
}

export function localizeEquipmentLabel(item?: string | null) {
  if (!item) return "";

  const normalized = normalizeLookupKey(item);

  return EQUIPMENT_LABELS[item] || NORMALIZED_EQUIPMENT_LABELS[normalized] || item;
}

export function localizeDescription(description?: string | null, name?: string | null) {
  if (!description) {
    return "لا توجد تفاصيل إضافية متاحة لهذه المركبة حاليًا.";
  }

  if (description.includes("excellent état") && description.includes("historique clair")) {
    return `${name || "هذه المركبة"} بحالة ممتازة مع تجهيز راقٍ وسجل واضح.`;
  }

  return description;
}

export const GUIDE_PAGES = [
  {
    slug: "achat-securise",
    title: "دليل المعاملات الآمنة",
    eyebrow: "دليل احترافي",
    description:
      "شرح واضح لكل المراحل من المعاينة الميدانية والفاتورة الرسمية إلى الشحن والمتابعة حتى الاستلام.",
    image: "/alhaduni-logo.jpg",
    heroLabel: "المعاينة، التوثيق، الشحن والمتابعة",
    ctaMessage:
      "مرحبًا، أريد الاستفسار عن خطوات شراء سيارة بأمان مع ALHADUNI CARS.",
    highlights: [
      {
        title: "استجابة تتعدى التوقعات",
        description:
          "فريقنا مستعد للتحرك فورًا لمعاينة السيارات ومساعدتك على اقتناص أفضل الفرص في الوقت المناسب."
      },
      {
        title: "جهد ميداني حقيقي",
        description:
          "نتواجد في المعارض ونفحص التفاصيل على الأرض بدقة وشفافية قبل أي خطوة مالية أو لوجستية."
      },
      {
        title: "شراكة قائمة على الصدق",
        description:
          "ثقتك هي أساس علاقتنا، لذلك نشاركك كل التفاصيل بوضوح ونبني القرار معك خطوة بخطوة."
      }
    ],
    steps: [
      {
        icon: "SearchCheck",
        title: "المعاينة والتوثيق المباشر",
        description:
          "بعد اختيارك للمركبة، نصوّر لك السيارة فيديو وصورًا تفصيلية وشاملة لتتأكد من كل جزء فيها وكأنك أمامها تمامًا."
      },
      {
        icon: "FileText",
        title: "الفاتورة الأولية الرسمية",
        description:
          "بنسخة جواز سفرك نجهّز لك الفاتورة الأولية من المعرض المعتمد في دبي مباشرة وباسمك الشخصي لضمان حقك."
      },
      {
        icon: "ShieldCheck",
        title: "الأمان المالي المطلق",
        description:
          "يتم تحويل المبلغ من بنك العميل إلى الحساب البنكي الرسمي للمعرض مباشرة، دون أي تعامل مع أطراف مجهولة."
      },
      {
        icon: "BadgeCheck",
        title: "مطابقة البيانات والتصدير",
        description:
          "نطابق رقم الشاسي يدويًا مع الأوراق الرسمية وننهي إجراءات شهادة التصدير واللوحات ثم نرسل لك الوثائق الأصلية."
      },
      {
        icon: "ShipWheel",
        title: "الشحن والوثائق",
        description:
          "نتعامل مع شركات شحن موثوقة ونجهّز السيارة بملف كامل يحتوي كل ما تحتاجه الإجراءات الجمركية عند الوصول."
      },
      {
        icon: "Handshake",
        title: "التتبع حتى الاستلام",
        description:
          "نمدّك برقم التتبع ونبقى على تواصل دائم معك حتى تضع يدك على مقود سيارتك بأمان."
      }
    ]
  }
] as const;

export type GuidePage = (typeof GUIDE_PAGES)[number];

export function getGuideBySlug(slug: string) {
  return GUIDE_PAGES.find((guide) => guide.slug === slug);
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${COMPANY_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://example.com";
}
