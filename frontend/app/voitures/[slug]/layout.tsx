import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/company";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
}

function absoluteMediaUrl(value?: string | null) {
  const source = String(value || "").trim();
  if (!source) return null;
  if (/^https?:\/\//i.test(source)) return source;
  const origin = apiBase().replace(/\/api$/, "");
  return `${origin}${source.startsWith("/") ? source : `/${source}`}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${apiBase()}/cars/${encodeURIComponent(params.slug)}?trackView=false`, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error("Vehicle metadata unavailable");
    const payload = await response.json();
    const car = payload?.car;
    const image = absoluteMediaUrl(car?.images?.[0]?.url);
    const price = Number(car?.price) > 0 ? `AED ${Number(car.price).toLocaleString("en-AE")}` : "Price on request";
    const details = [car?.year, car?.engineCapacity ? `${Number(car.engineCapacity).toFixed(1)} L` : null, car?.regionalSpecs, car?.mileage != null ? `${Number(car.mileage).toLocaleString()} km` : null].filter(Boolean).join(" · ");
    const title = car?.name || "Vehicle";
    const description = `${price}${details ? ` · ${details}` : ""}. Available from ALHADUNICARS in Dubai.`;
    const canonical = `${getSiteUrl()}/voitures/${encodeURIComponent(params.slug)}`;
    const images = image ? [{ url: image, alt: car?.images?.[0]?.alt || car?.name || "Vehicle" }] : [];
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: "website", siteName: "ALHADUNICARS", images },
      twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : [] }
    };
  } catch {
    const canonical = `${getSiteUrl()}/voitures/${encodeURIComponent(params.slug)}`;
    return { title: "Vehicle | ALHADUNICARS", description: "Vehicle listing from ALHADUNICARS in Dubai.", alternates: { canonical }, openGraph: { images: [] }, twitter: { card: "summary", images: [] } };
  }
}

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
