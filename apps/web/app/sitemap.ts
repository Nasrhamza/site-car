export default async function sitemap() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://example.com");

  return [
    "",
    "/catalogue",
    "/guide",
    "/guide/achat-securise",
    "/guide/importation",
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
