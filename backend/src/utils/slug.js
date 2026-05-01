export function makeSlug(brand, model, year) {
  return `${brand || ""}-${model || ""}-${year || ""}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}