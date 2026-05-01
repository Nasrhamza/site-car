import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  return [
    "",
    "/catalogue",
    "/guide",
    "/guide/achat-securise",
    "/contact",
    "/a-propos",
    "/categorie/tracteurs",
    "/categorie/camions",
    "/faq"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}
