import fs from "fs";
import path from "path";

const uploadsDir = path.resolve(process.cwd(), "src", "uploads");

function resolveUploadedFile(url) {
  const value = String(url || "").trim();
  if (!value.startsWith("/uploads/")) return null;

  const fileName = path.basename(value.split("?")[0]);
  if (!fileName) return null;

  const resolved = path.resolve(uploadsDir, fileName);
  return path.dirname(resolved) === uploadsDir ? resolved : null;
}

export async function deleteUploadedImages(images = []) {
  const targets = [...new Set(images.map((image) => resolveUploadedFile(image?.url || image)).filter(Boolean))];
  await Promise.allSettled(targets.map((target) => fs.promises.unlink(target)));
}
