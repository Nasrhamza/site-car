"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SiteLanguage = "en" | "ar";

const copy = {
  en: {
    nav: ["Home", "Cars", "Contact"], inventory: "View cars", heroTag: "Dubai car marketplace", heroTitle: "Find your next car.", heroText: "Clear listings. Direct contact.", search: "Search brand or model", searchButton: "Search", whatsapp: "WhatsApp", featuredTag: "Available now", featuredTitle: "Cars for you", featuredText: "Price, kilometrage, and the details that matter.", noCars: "No cars are published yet.", finalTitle: "Need help choosing?", finalText: "Message us directly on WhatsApp.", contact: "Contact", footerText: "Cars, simply.", location: "Dubai, United Arab Emirates", details: "Details", price: "Price", mileage: "Kilométrage", year: "Year", fuel: "Fuel", status: "Status",
    catalogueTag: "Inventory", catalogueTitle: "Available cars", catalogueText: "Browse by category, fuel, or price.", directSearch: "Search brand, model, or category", filters: "Filters", reset: "Reset", all: "All", matchingCars: "cars found", allCategories: "All categories", allFuelTypes: "All fuel types", minPrice: "Minimum price", maxPrice: "Maximum price", newest: "Newest", priceLow: "Price: low to high", priceHigh: "Price: high to low", mostViewed: "Most viewed", unavailable: "The service is temporarily unavailable.", noMatch: "No cars match these filters.", loadMore: "Load more", favourite: "Add to favourites", compare: "Compare this car"
  },
  ar: {
    nav: ["الرئيسية", "السيارات", "تواصل معنا"], inventory: "عرض السيارات", heroTag: "سوق السيارات في دبي", heroTitle: "اعثر على سيارتك القادمة.", heroText: "سيارات واضحة. تواصل مباشر.", search: "ابحث بالعلامة أو الموديل", searchButton: "بحث", whatsapp: "واتساب", featuredTag: "متوفر الآن", featuredTitle: "سيارات مختارة لك", featuredText: "السعر والمسافة والتفاصيل المهمة فقط.", noCars: "لا توجد سيارات منشورة حالياً.", finalTitle: "تحتاج مساعدة في الاختيار؟", finalText: "راسلنا مباشرةً عبر واتساب.", contact: "تواصل معنا", footerText: "السيارات ببساطة.", location: "دبي، الإمارات العربية المتحدة", details: "التفاصيل", price: "السعر", mileage: "المسافة", year: "السنة", fuel: "الوقود", status: "الحالة",
    catalogueTag: "المعرض", catalogueTitle: "السيارات المتوفرة", catalogueText: "ابحث حسب الفئة، الوقود، أو السعر.", directSearch: "ابحث بالماركة، الموديل، أو الفئة", filters: "الفلاتر", reset: "إعادة ضبط", all: "الكل", matchingCars: "سيارة مطابقة", allCategories: "كل الفئات", allFuelTypes: "كل أنواع الوقود", minPrice: "أدنى سعر", maxPrice: "أقصى سعر", newest: "الأحدث", priceLow: "السعر: من الأقل إلى الأعلى", priceHigh: "السعر: من الأعلى إلى الأقل", mostViewed: "الأكثر مشاهدة", unavailable: "الخدمة غير متاحة مؤقتاً.", noMatch: "لا توجد سيارات مطابقة للفلاتر.", loadMore: "عرض المزيد", favourite: "إضافة إلى المفضلة", compare: "مقارنة السيارة"
  }
} as const;

type LanguageContextValue = { language: SiteLanguage; setLanguage: (language: SiteLanguage) => void; t: (typeof copy)[SiteLanguage] };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  useEffect(() => { const saved = window.localStorage.getItem("alhaduni-language"); if (saved === "ar" || saved === "en") setLanguage(saved); }, []);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; window.localStorage.setItem("alhaduni-language", language); }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: copy[language] }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export function translateVehicleValue(value: string | undefined, language: SiteLanguage) {
  if (!value) return "";
  const english: Record<string, string> = { "Véhicules légers": "Passenger cars", "Semi-remorques": "Semi-trailers", Camions: "Trucks", Tracteurs: "Tractors", Utilitaires: "Commercial vehicles", "Engins TP": "Construction equipment", "Bus / Minibus": "Bus / Minibus", Diesel: "Diesel", Essence: "Petrol", Hybride: "Hybrid", PHEV: "Plug-in Hybrid Electric Vehicle (PHEV)", REEV: "Range-extended electric (REEV)", "Électrique": "Electric", GPL: "LPG", Autre: "Other", Disponible: "Available", Reserve: "Reserved", Vendu: "Sold", Masque: "Hidden", Automatique: "Automatic", automatique: "Automatic", Manuelle: "Manual", manuelle: "Manual", "Séquentielle": "Sequential", Noir: "Black", Blanc: "White", Gris: "Grey", Argent: "Silver", Bleu: "Blue", Rouge: "Red", Vert: "Green", Marron: "Brown", جديد: "New", موثق: "Verified", تصدير: "Export ready", مميز: "Featured" };
  const arabic: Record<string, string> = { "Véhicules légers": "سيارات ركوب", "Semi-remorques": "أنصاف مقطورات", Camions: "شاحنات", Tracteurs: "جرارات", Utilitaires: "مركبات تجارية", "Engins TP": "معدات أشغال", "Bus / Minibus": "حافلات", Diesel: "ديزل", Essence: "بنزين", Hybride: "هجين", PHEV: "هجين قابل للشحن", REEV: "كهربائي ممتد المدى", "Électrique": "كهربائي", GPL: "غاز", Autre: "أخرى", Other: "أخرى", Disponible: "متوفرة", Available: "متوفرة", Reserve: "محجوزة", Reserved: "محجوزة", Vendu: "مباعة", Sold: "مباعة", Masque: "مخفية", Hidden: "مخفية", Automatique: "أوتوماتيك", automatique: "أوتوماتيك", Automatic: "أوتوماتيك", Manuelle: "يدوي", manuelle: "يدوي", Manual: "يدوي", "Séquentielle": "تتابعي", "Left hand": "مقود يسار", "Right hand": "مقود يمين", "Can be exported": "قابلة للتصدير", "Local sale only": "بيع محلي فقط", Yes: "نعم", Partial: "جزئي", No: "لا", "SUV/Crossover": "دفع رباعي / كروس أوفر", Sedan: "سيدان", "Pick Up Truck": "بيك آب", Coupe: "كوبيه", Van: "فان", Hatchback: "هاتشباك", Convertible: "مكشوفة", Truck: "شاحنة", Bus: "حافلة", "Station Wagon": "ستيشن واغن", Bike: "دراجة", Sportback: "سبورتباك", Limousine: "ليموزين", Buggy: "باغي", Noir: "أسود", Blanc: "أبيض", Gris: "رمادي", Argent: "فضي", Bleu: "أزرق", Rouge: "أحمر", Vert: "أخضر", Marron: "بني" };
  return (language === "ar" ? arabic[value] : english[value]) || value;
}
