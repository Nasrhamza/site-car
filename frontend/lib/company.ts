export const COMPANY_NAME = "ALHADUNICARS";
export const COMPANY_SHORT_NAME = "ALHADUNICARS";
export const COMPANY_SECONDARY_NAME = "ALHADUNICARS";
export const COMPANY_SUBTITLE = "الحادوني للسيارات";
export const COMPANY_DESCRIPTION =
  "منصة احترافية لبيع السيارات والمركبات التجارية مع المعاينة الميدانية، التوثيق، الشحن والمتابعة حتى الاستلام.";
export const COMPANY_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "971563543177";
export const COMPANY_WHATSAPP_DISPLAY = "\u2066+971 56 354 3177\u2069";
export const COMPANY_LOCATION = "دبي، الإمارات العربية المتحدة";
export const COMPANY_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61585371121441";
export const DEVELOPER_WHATSAPP_PHONE = "21628260802";
export const DEVELOPER_WHATSAPP_DISPLAY = "+216 28 260 802";
export const DEVELOPER_FACEBOOK_URL = "https://www.facebook.com/hamza.nasr.307894/";

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

export const BODY_TYPE_OPTIONS = [
  "SUV/Crossover",
  "Sedan",
  "Pick Up Truck",
  "Coupe",
  "Van",
  "Hatchback",
  "Convertible",
  "Truck",
  "Bus",
  "Station Wagon",
  "Other",
  "Bike",
  "Sportback",
  "Limousine",
  "Buggy"
] as const;

export const TRIM_OPTIONS = ["Basic Option", "Mid Option", "Full Option"] as const;
export const STEERING_SIDE_OPTIONS = ["Left hand", "Right hand"] as const;
export const EXPORT_STATUS_OPTIONS = ["Can be exported", "Local sale only"] as const;
export const SERVICE_HISTORY_OPTIONS = ["Yes", "Partial", "No"] as const;
export const SEATING_CAPACITY_OPTIONS = Array.from({ length: 100 }, (_unused, index) => index + 1);

export const VEHICLE_BRANDS = [
  "Abarth", "Acura", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "BAIC", "Bentley",
  "BMW", "Bugatti", "Buick", "BYD", "Cadillac", "Changan", "Chery", "Chevrolet",
  "Chrysler", "Citroën", "Cupra", "Dacia", "Daewoo", "DAF", "Daihatsu", "Dodge",
  "Dongfeng", "DS Automobiles", "Exeed", "Ferrari", "Fiat", "Ford", "Foton", "Freightliner",
  "GAC", "Geely", "Genesis", "GMC", "Great Wall", "Haval", "Hino", "Honda", "Hongqi",
  "Hummer", "Hyundai", "Infiniti", "Isuzu", "Iveco", "JAC", "Jaguar", "Jeep", "Jetour",
  "JMC", "Kia", "Koenigsegg", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lincoln",
  "Lotus", "Lucid", "Mack", "Mahindra", "MAN", "Maserati", "Maxus", "Mazda", "McLaren",
  "Mercedes-Benz", "MG", "MINI", "Mitsubishi", "NIO", "Nissan", "Opel", "Peugeot",
  "Polestar", "Porsche", "RAM", "Renault", "Rivian", "Rolls-Royce", "Saab", "Scania",
  "SEAT", "Škoda", "Smart", "SsangYong / KGM", "Subaru", "Suzuki", "Tank", "Tesla",
  "Toyota", "UD Trucks", "Volkswagen", "Volvo", "XPeng", "Zeekr", "Caterpillar", "JCB",
  "Komatsu", "Liebherr", "Hitachi", "Bobcat", "Case", "New Holland"
] as const;

export const VEHICLE_YEARS = Array.from(
  { length: 2050 - 1950 + 1 },
  (_unused, index) => 2050 - index
);

export const GEARBOX_OPTIONS = [
  "Automatique", "Manuelle", "CVT", "DCT", "AMT", "Tiptronic", "Séquentielle", "Autre"
] as const;

export const DRIVETRAIN_OPTIONS = [
  "4x2", "4x4", "6x2", "6x4", "6x6", "8x4", "AWD", "FWD", "RWD", "Autre"
] as const;

export const EXTERIOR_COLOR_OPTIONS = [
  "Noir", "Blanc", "Gris", "Argent", "Bleu", "Rouge", "Vert", "Beige", "Marron",
  "Or", "Orange", "Jaune", "Violet", "Autre"
] as const;

export const ENGINE_CAPACITY_OPTIONS = Array.from(
  { length: 51 },
  (_unused, index) => Number((1 + index * 0.1).toFixed(1))
);

export const REGIONAL_SPECS_OPTIONS = [
  "GCC",
  "European",
  "American",
  "Canadian",
  "Japanese",
  "Korean",
  "Chinese",
  "Australian",
  "Other"
] as const;

const VEHICLE_MODEL_SUGGESTIONS: Record<string, string[]> = {
  audi: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  bmw: ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "X7", "iX"],
  byd: ["Atto 3", "Dolphin", "Han", "Seal", "Song Plus", "Tang"],
  chevrolet: ["Camaro", "Captiva", "Corvette", "Silverado", "Suburban", "Tahoe"],
  ford: ["Bronco", "Edge", "Explorer", "F-150", "Mustang", "Ranger", "Transit"],
  gmc: ["Canyon", "Sierra", "Terrain", "Yukon"],
  hyundai: ["Accent", "Elantra", "Palisade", "Santa Fe", "Sonata", "Tucson"],
  iveco: ["Daily", "Eurocargo", "S-Way", "T-Way"],
  jeep: ["Compass", "Gladiator", "Grand Cherokee", "Wrangler"],
  kia: ["Carnival", "K5", "Sorento", "Sportage", "Telluride"],
  "land rover": ["Defender", "Discovery", "Range Rover", "Range Rover Sport", "Range Rover Velar"],
  lexus: ["ES", "GX", "IS", "LC", "LX", "NX", "RX"],
  man: ["TGE", "TGM", "TGS", "TGX"],
  "mercedes-benz": ["A-Class", "C-Class", "E-Class", "S-Class", "G-Class", "GLC", "GLE", "GLS", "Sprinter", "Actros"],
  mitsubishi: ["ASX", "L200", "Montero", "Outlander", "Pajero"],
  nissan: ["Altima", "Navara", "Patrol", "Pathfinder", "Sunny", "X-Trail"],
  peugeot: ["208", "308", "3008", "5008", "Boxer", "Partner", "Traveller"],
  porsche: ["718", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  renault: ["Captur", "Clio", "Duster", "Kangoo", "Master", "Megane", "Trafic"],
  scania: ["P-series", "G-series", "R-series", "S-series"],
  tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  toyota: ["Camry", "Corolla", "Fortuner", "Hiace", "Hilux", "Land Cruiser", "Prado", "RAV4"],
  volkswagen: ["Caddy", "Golf", "Passat", "Tiguan", "Touareg", "Transporter"],
  volvo: ["S60", "S90", "XC40", "XC60", "XC90", "FH", "FM", "FMX"]
};

export function getVehicleModelSuggestions(brand?: string | null) {
  if (!brand) return [];
  return VEHICLE_MODEL_SUGGESTIONS[normalizeLookupKey(brand)] || [];
}

export const DEFAULT_VEHICLE_CATEGORY = "Véhicules légers";
export const FUEL_TYPE_OPTIONS = [
  "Diesel",
  "Essence",
  "Hybride",
  "PHEV",
  "REEV",
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

export const CATEGORY_ENGLISH_LABELS: Record<(typeof VEHICLE_CATEGORIES)[number], string> = {
  Tracteurs: "Tractors",
  "Semi-remorques": "Semi-trailers",
  Camions: "Trucks",
  Utilitaires: "Commercial vehicles",
  "Engins TP": "Construction equipment",
  "Bus / Minibus": "Bus / Minibus",
  "Véhicules légers": "Passenger cars"
};

export function getCategoryDisplayLabel(category: string, language: "ar" | "en") {
  if (language === "ar") return getCategoryLabel(category);
  return CATEGORY_ENGLISH_LABELS[category as (typeof VEHICLE_CATEGORIES)[number]] || category;
}

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
  PHEV: "PHEV",
  REEV: "REEV",
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
  PHEV: "PHEV",
  REEV: "REEV",
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

const FUEL_TYPE_IMAGES: Record<string, string> = {
  essence: "/fuel-types/petrol.png",
  petrol: "/fuel-types/petrol.png",
  diesel: "/fuel-types/diesel.png",
  hybride: "/fuel-types/hybrid.png",
  hybrid: "/fuel-types/hybrid.png",
  electrique: "/fuel-types/electric.png",
  electric: "/fuel-types/electric.png",
  ev: "/fuel-types/electric.png",
  phev: "/fuel-types/phev.png",
  reev: "/fuel-types/reev.png"
};

export function getFuelTypeImage(fuelType?: string | null) {
  if (!fuelType) return null;
  return FUEL_TYPE_IMAGES[normalizeLookupKey(fuelType)] || null;
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
      "مرحبًا، أريد الاستفسار عن خطوات شراء سيارة بأمان مع ALHADUNICARS.",
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
