import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/company";

type SitemapCar = {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
};

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api"
  ).replace(/\/$/, "");
}

async function getPublishedCars(): Promise<SitemapCar[]> {
  try {
    const response = await fetch(`${apiBase()}/cars?limit=1000&sort=-updatedAt`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) return [];

    const payload = await response.json();
    return Array.isArray(payload?.items) ? payload.items : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPages = [
    "",
    "/catalogue",
    "/guide",
    "/guide/achat-securise",
    "/contact",
    "/a-propos",
    "/developer",
    "/categorie/tracteurs",
    "/categorie/camions",
    "/faq"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/catalogue" ? "daily" as const : "weekly" as const,
    priority: path === "" ? 1 : path === "/catalogue" ? 0.9 : 0.7
  }));

  const cars = await getPublishedCars();
  const vehiclePages = cars
    .filter((car) => Boolean(car.slug))
    .map((car) => ({
      url: `${base}/voitures/${encodeURIComponent(car.slug!)}`,
      lastModified: new Date(car.updatedAt || car.createdAt || Date.now()),
      changeFrequency: "daily" as const,
      priority: 0.8
    }));

  return [...staticPages, ...vehiclePages];
}
