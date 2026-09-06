import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/seller/", "/login"]
      }
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl()
  };
}
