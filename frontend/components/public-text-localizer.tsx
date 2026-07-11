"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/site-language";

const translations: Record<string, string> = {
  "المعرض": "Inventory",
  "المركبات المتوفرة لدينا": "Available cars",
  "ابحث بسرعة حسب الفئة، نوع الوقود، السعر والتوفر داخل معرض واضح على الهاتف والكمبيوتر.": "Browse by category, fuel type, price, and availability.",
  "بحث مباشر: الفئة، الماركة أو الموديل...": "Search brand, model, or category...",
  "الفلاتر": "Filters",
  "إعادة ضبط": "Reset",
  "الكل": "All",
  "كل الفئات": "All categories",
  "كل أنواع الوقود": "All fuel types",
  "هجين قابل للشحن": "Plug-in Hybrid Electric Vehicle (PHEV)",
  "السعر الأدنى": "Minimum price",
  "السعر الأقصى": "Maximum price",
  "الأحدث": "Newest",
  "السعر تصاعدي": "Price: low to high",
  "السعر تنازلي": "Price: high to low",
  "الأكثر مشاهدة": "Most viewed",
  "تحميل المزيد": "Load more",
  "تواصل معنا": "Contact us",
  "خلّينا نحكيو على مركبتك القادمة": "Let’s talk about your next vehicle",
  "فريقنا يرد بسرعة بخصوص البيع، المعاينة، التوثيق والشحن.": "Our team responds quickly about sales, inspection, paperwork, and shipping.",
  "البيع والتوفر": "Sales and availability",
  "قل لنا نوع المركبة التي تبحث عنها وسنوجهك إلى الخيارات المناسبة.": "Tell us what vehicle you need and we will guide you to the right options.",
  "شراء آمن": "Buy with confidence",
  "نوجّهك في الوثائق، الفاتورة والخطوات اللازمة قبل تأكيد الشراء.": "We guide you through documents, invoicing, and the steps before confirming your purchase.",
  "الاسم": "Name",
  "البريد الإلكتروني": "Email address",
  "رقم الهاتف": "Phone number",
  "اكتب رسالتك": "Write your message",
  "إرسال": "Send",
  "من نحن": "About us",
  "نساعد المشترين والمهنيين على اختيار المركبة المناسبة، التثبت من حالتها، واستكمال العملية من دبي إلى حين الاستلام.": "We help buyers and professionals choose the right vehicle, verify its condition, and complete the process from Dubai to delivery.",
  "عرض موجّه": "Focused inventory",
  "نركز على السيارات والمركبات المطلوبة فعليًا مع اهتمام حقيقي بحاجيات السوق والعميل.": "We focus on vehicles that match real market and customer needs.",
  "منهجية واضحة": "A clear process",
  "معاينة، وثائق، فاتورة رسمية ومتابعة تقلّل المخاطر وتخلي القرار أوضح.": "Inspection, documents, an official invoice, and follow-up make every decision clearer.",
  "تواصل مباشر": "Direct contact",
  "واتساب هو القناة الأسرع لتأكيد التفاصيل، تبادل الصور، ومتابعة الملف خطوة بخطوة.": "WhatsApp is the fastest way to confirm details, share photos, and follow your request step by step.",
  "تواصل مع فريقنا": "Contact our team",
  "الأسئلة الشائعة": "Frequently asked questions",
  "الدليل": "Guide",
  "مقال عملي يشرح كيفاش تتم العملية من البداية للنهاية": "A practical guide from the first step to final delivery",
  "تحدث معنا على واتساب": "Chat with us on WhatsApp",
  "افتح المعرض": "View inventory",
  "البيانات القانونية": "Legal notice",
  "سياسة ملفات الارتباط": "Cookie policy",
  "سياسة الخصوصية": "Privacy policy",
  "الصفحة غير موجودة": "Page not found",
  "الصفحة المطلوبة غير موجودة أو تم نقلها.": "The page you requested does not exist or has moved.",
  "العودة إلى المعرض": "Back to inventory",
  "جارٍ تحميل التجربة...": "Loading...",
  "تفاصيل المركبة": "Vehicle details",
  "التفاصيل غير متاحة مؤقتًا": "Details are temporarily unavailable",
  "إعادة المحاولة": "Try again",
  "جارٍ التحميل...": "Loading...",
  "السنة": "Year",
  "الكيلومترات": "Mileage",
  "الوقود": "Fuel",
  "علبة السرعة": "Transmission",
  "الفئة": "Category",
  "الحالة": "Status",
  "نبذة": "Overview",
  "المواصفات": "Specifications",
  "التجهيزات": "Equipment",
  "الشحن": "Shipping",
  "معاينة بصرية": "Visual inspection",
  "وثائق مؤكدة": "Verified documents",
  "صور مفصلة": "Detailed photos",
  "إمكانية الشحن والمتابعة": "Shipping and follow-up available",
  "مركبات مشابهة": "Similar vehicles",
  "اطلب معلومات إضافية": "Request more information",
  "اسأل على واتساب": "Ask on WhatsApp",
  "اسأل عن الشحن": "Ask about shipping",
  "السعر غير متوفر": "Price unavailable",
  "تسجيل الدخول": "Sign in",
  "إدارة": "Management"
};

const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([ar, en]) => [en, ar]));

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function PublicTextLocalizer() {
  const pathname = usePathname();
  const { language } = useLanguage();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const dictionary = language === "en" ? translations : reverseTranslations;
    const update = () => {
      const root = document.querySelector("main");
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      nodes.forEach((node) => {
        const key = normalize(node.nodeValue || "");
        if (dictionary[key]) node.nodeValue = dictionary[key];
      });

      root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]").forEach((element) => {
        const key = normalize(element.placeholder);
        if (dictionary[key]) element.placeholder = dictionary[key];
      });
    };

    update();
    const observer = new MutationObserver(update);
    const root = document.querySelector("main");
    if (root) observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language, pathname]);

  return null;
}
