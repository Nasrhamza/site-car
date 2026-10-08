import type { MetadataRoute } from "next";
import { COMPANY_NAME, COMPANY_SHORT_NAME } from "@/lib/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY_NAME,
    short_name: COMPANY_SHORT_NAME,
    description: "Browse vehicles, contact ALHADUNICARS and manage your inventory. سوق سيارات وتصدير عالمي من دبي.",
    id: "/",
    start_url: "/",
    scope: "/",
    lang: "en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#C1121F",
    icons: [
      {
        src: "/alhaduni-icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/alhaduni-icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
