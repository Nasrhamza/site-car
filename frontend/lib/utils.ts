import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { buildWhatsAppUrl, getSiteUrl } from "@/lib/company";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function getApiBaseUrl() {
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api");

  return base.replace(/\/api\/?$/, "");
}

export function currency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCurrency(value: number) {
  return currency(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function absoluteCarUrl(slug: string) {
  return `${getSiteUrl()}/voitures/${slug}`;
}

export function resolveMediaUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${getApiBaseUrl().replace(/\/$/, "")}${normalizedPath}`;
}

export function buildWhatsAppMessage(car: {
  name: string;
  slug: string;
  price: number;
  mileage?: number;
  year?: number;
  reference?: string;
}) {
  const lines = [
    "مرحبًا",
    "أنا مهتم بهذه المركبة:",
    "",
    `${car.name}`,
    car.year ? `السنة: ${car.year}` : null,
    typeof car.mileage === "number"
      ? `الكيلومترات: ${car.mileage.toLocaleString("ar-TN")} km`
      : null,
    `السعر: ${currency(car.price)}`,
    `المرجع: ${car.reference || car.slug.toUpperCase()}`,
    `الرابط: ${absoluteCarUrl(car.slug)}`,
    "",
    "شكرًا."
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppLink(car: {
  name: string;
  slug: string;
  price: number;
  mileage?: number;
  year?: number;
  reference?: string;
}) {
  return buildWhatsAppUrl(buildWhatsAppMessage(car));
}
